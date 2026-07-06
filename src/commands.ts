import { Line, WHOAMI, ABOUT, SKILLS, PROJECTS, EXPERIENCE, CONTACT } from './content';

export type CommandResult = Line[] | { clear: true };

export interface StreamHandle {
  set: (text: string) => void;
  append: (text: string) => void;
}

export interface CommandContext {
  history: string[];
  print: (lines: Line[]) => void;
  streamLine: (cls?: string) => StreamHandle;
}

interface Command {
  desc: string;
  hidden?: boolean;
  run: (args: string[], ctx: CommandContext) => CommandResult | Promise<CommandResult>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MODEL_NAME = 'biogpt';
let modelPulled = false;

async function cmdPull(args: string[], ctx: CommandContext): Promise<CommandResult> {
  const model = args[0];
  if (!model) return [{ text: 'usage: pull <model>   (try: pull biogpt)', cls: 'muted' }];
  if (model !== MODEL_NAME) {
    return [
      { text: `error: model '${model}' not found`, cls: 'red' },
      { text: `this shell only serves '${MODEL_NAME}' — a tiny transformer overfit on my bio.`, cls: 'muted' },
    ];
  }
  if (modelPulled) return [{ text: `model '${model}' already pulled.`, cls: 'muted' }];

  ctx.print([{ text: `pulling manifest for ${model}...`, cls: 'muted' }]);
  await sleep(250);

  const layers: [string, number][] = [
    ['token+pos embeddings', 420],
    ['attention blocks (x4)', 980],
    ['feedforward blocks (x4)', 760],
    ['output head', 240],
  ];
  for (const [name, kb] of layers) {
    const line = ctx.streamLine('muted');
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const pct = Math.round((i / steps) * 100);
      const filled = Math.round((i / steps) * 20);
      const bar = '#'.repeat(filled) + '.'.repeat(20 - filled);
      line.set(`  ${name.padEnd(24)} [${bar}] ${pct}%  ${kb}KB`);
      await sleep(35);
    }
  }

  ctx.print([
    { text: '  verifying sha256 digest... ok', cls: 'teal' },
    { text: `success. run 'run ${model}' to generate.`, cls: 'teal' },
  ]);
  modelPulled = true;
  return [];
}

async function cmdRun(args: string[], ctx: CommandContext): Promise<CommandResult> {
  const model = args[0];
  if (!model) return [{ text: 'usage: run <model> [seed words...]   (try: run biogpt)', cls: 'muted' }];
  if (model !== MODEL_NAME) {
    return [{ text: `error: model '${model}' not found`, cls: 'red' }];
  }
  const seed = args.slice(1).join(' ') || "I'm Chinmay";

  if (!modelPulled) {
    ctx.print([{ text: `model '${model}' not found locally.`, cls: 'amber' }]);
    await cmdPull([model], ctx);
  }

  ctx.print([{ text: `loading ${model}...`, cls: 'muted' }]);
  try {
    const { generateBioStream } = await import('./biogpt');
    const line = ctx.streamLine();
    await generateBioStream(seed, (word) => line.append(word + ' '));
  } catch (err) {
    return [{ text: `error: ${(err as Error).message}`, cls: 'red' }];
  }
  return [];
}

const registry: Record<string, Command> = {
  help: { desc: 'list available commands', run: () => helpOutput() },
  whoami: { desc: 'who is this', run: () => WHOAMI },
  about: { desc: 'what I work on', run: () => ABOUT },
  skills: { desc: 'tools & technologies', run: () => SKILLS },
  projects: { desc: 'things I have built', run: () => PROJECTS },
  experience: { desc: 'education & work history', run: () => EXPERIENCE },
  contact: { desc: 'reach me', run: () => CONTACT },
  clear: { desc: 'clear the screen', run: () => ({ clear: true }) },
  pull: { desc: 'download a model (try: pull biogpt)', run: (args, ctx) => cmdPull(args, ctx) },
  run: { desc: 'generate text from a model (try: run biogpt)', run: (args, ctx) => cmdRun(args, ctx) },
  history: {
    desc: '',
    hidden: true,
    run: (_args, ctx) => ctx.history.map((cmd, i) => ({ text: `${i + 1}  ${cmd}` })),
  },
};

const ALIASES: Record<string, string> = {
  'cat skills.json': 'skills',
  'ls projects': 'projects',
  'cat resume.txt': 'experience',
};

function helpOutput(): Line[] {
  const lines: Line[] = [{ text: 'available commands:', cls: 'muted' }, { text: '' }];
  for (const [name, cmd] of Object.entries(registry)) {
    if (cmd.hidden) continue;
    lines.push({ text: `  ${name.padEnd(12)}${cmd.desc}` });
  }
  lines.push({ text: '' });
  lines.push({ text: "'biogpt' is a ~480K-param transformer I trained from scratch on my own", cls: 'muted' });
  lines.push({ text: 'bio until it overfit — it recites the paragraph above, word for word,', cls: 'muted' });
  lines.push({ text: 'generated live in your browser (WASM, no server). pull it, then run it.', cls: 'muted' });
  lines.push({ text: '' });
  lines.push({ text: "tip: click a command below, or type your own.", cls: 'muted' });
  return lines;
}

export async function dispatch(raw: string, ctx: CommandContext): Promise<CommandResult> {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const lower = trimmed.toLowerCase();
  const aliased = ALIASES[lower];
  if (aliased) return await registry[aliased].run([], ctx);

  const [cmdRaw, ...args] = trimmed.split(/\s+/);
  const cmd = cmdRaw.toLowerCase();

  if (cmd === 'sudo') {
    return [{ text: "permission denied: 'sudo' grants root, not shortcuts. try 'about' instead.", cls: 'red' }];
  }

  const found = registry[cmd];
  if (found) return await found.run(args, ctx);

  return [
    { text: `command not found: ${cmdRaw}`, cls: 'red' },
    { text: "type 'help' to see available commands.", cls: 'muted' },
  ];
}
