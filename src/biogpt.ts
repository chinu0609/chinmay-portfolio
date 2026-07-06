// Runs BioGPT (a from-scratch, ~480K-param character/word transformer,
// overfit on one paragraph about Chinmay) entirely client-side via
// onnxruntime-web/WASM. No server involved.
//
// onnxruntime-web's ESM build does a dynamic import() of its wasm glue
// code, which Vite's dev-server module transform 500s on. Loading the
// classic UMD build via an injected <script> tag sidesteps that (plain
// script fetch, no ESM involved) and keeps it lazy — only fetched the
// first time a command actually needs it.
import type * as OrtType from 'onnxruntime-web';
declare const ort: typeof OrtType;

const ASSET_BASE = import.meta.env.BASE_URL;

let ortLoaded: Promise<void> | null = null;
function loadOrtScript(): Promise<void> {
  if (ortLoaded) return ortLoaded;
  ortLoaded = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${ASSET_BASE}ort/ort.min.js`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('failed to load onnxruntime-web'));
    document.head.appendChild(script);
  });
  return ortLoaded;
}

interface Vocab {
  stoi: Record<string, number>;
  itos: Record<string, string>;
  block_size: number;
  vocab_size: number;
}

let session: OrtType.InferenceSession | null = null;
let vocab: Vocab | null = null;

async function loadModel(): Promise<void> {
  if (session) return;
  await loadOrtScript();
  ort.env.wasm.wasmPaths = new URL(`${ASSET_BASE}ort/`, window.location.href).href;
  const vocabRes = await fetch(`${ASSET_BASE}biogpt/vocab.json`);
  vocab = await vocabRes.json();
  session = await ort.InferenceSession.create(`${ASSET_BASE}biogpt/model.onnx`, {
    executionProviders: ['wasm'],
  });
}

function encode(str: string): number[] {
  const v = vocab!;
  const unkId = v.stoi['<unk>'];
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w in v.stoi ? v.stoi[w] : unkId));
}

function decodeWord(id: number): string {
  return vocab!.itos[String(id)];
}

function softmaxSample(logits: Float32Array | number[], temperature: number, topK: number): number {
  const scaled = Array.from(logits, (v) => v / Math.max(temperature, 1e-6));

  let candidates: [number, number][] = scaled.map((v, i) => [v, i]);
  if (topK && topK < candidates.length) {
    candidates.sort((a, b) => b[0] - a[0]);
    candidates = candidates.slice(0, topK);
  }

  const maxLogit = Math.max(...candidates.map((c) => c[0]));
  const exps = candidates.map(([v, i]): [number, number] => [Math.exp(v - maxLogit), i]);
  const sum = exps.reduce((s, [e]) => s + e, 0);
  const probs = exps.map(([e, i]): [number, number] => [e / sum, i]);

  let r = Math.random();
  for (const [p, i] of probs) {
    r -= p;
    if (r <= 0) return i;
  }
  return probs[probs.length - 1][1];
}

// Mirrors the Python model.generate(): grow the input with no padding,
// only sliding once it hits block_size. The model was never trained on
// padded contexts, so padding here would misfire it near the start.
export async function generateBioStream(
  prompt: string,
  onToken: (word: string) => void,
  { maxNewTokens = 208, temperature = 0.05, topK = 1 }: { maxNewTokens?: number; temperature?: number; topK?: number } = {}
): Promise<void> {
  await loadModel();
  const v = vocab!;
  const blockSize = v.block_size;
  const vocabSize = v.vocab_size;

  const encoded = encode(prompt);
  const promptIds = encoded.length ? encoded : [v.stoi['<unk>']];
  let buffer = promptIds.slice(-blockSize);

  for (const id of promptIds) onToken(decodeWord(id));

  for (let step = 0; step < maxNewTokens; step++) {
    const seqLen = buffer.length;
    const inputData = BigInt64Array.from(buffer.map((x) => BigInt(x)));
    const inputTensor = new ort.Tensor('int64', inputData, [1, seqLen]);
    const results = await session!.run({ input_ids: inputTensor });

    const logitsTensor = results.logits;
    const lastPosOffset = (seqLen - 1) * vocabSize;
    const lastLogits = (logitsTensor.data as Float32Array).slice(lastPosOffset, lastPosOffset + vocabSize);

    const nextId = softmaxSample(lastLogits, temperature, topK);

    onToken(decodeWord(nextId));
    buffer.push(nextId);
    if (buffer.length > blockSize) buffer.shift();
  }
}
