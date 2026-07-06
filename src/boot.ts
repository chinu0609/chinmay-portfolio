interface BootLine {
  text: string;
  cls: string;
}

const BOOT_LINES: BootLine[] = [
  { text: '[boot]  initializing chinmay.exe ...', cls: 'text' },
  { text: '[ok]    trait loaded: curiosity             (learning_rate: high, decay: none)', cls: 'teal' },
  { text: '[ok]    trait loaded: continuous-tuning     (gradient updates: daily, never converges)', cls: 'teal' },
  { text: '[ok]    trait loaded: pattern-recognition   (applies across logs, language, systems)', cls: 'teal' },
  { text: '[ok]    trait loaded: build-first-bias      (prefers running code over perfect specs)', cls: 'teal' },
  { text: '[warn]  sudo access requested               (denied by design)', cls: 'amber' },
  { text: "[ready] system online. type 'help' to explore.", cls: 'text' },
];

const CHAR_DELAY_MS = 12;
const LINE_DELAY_MS = 100;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function appendFullLine(outputEl: HTMLElement, line: BootLine): HTMLDivElement {
  const div = document.createElement('div');
  div.className = `line ${line.cls}`;
  div.textContent = line.text;
  outputEl.appendChild(div);
  outputEl.scrollTop = outputEl.scrollHeight;
  return div;
}

export function runBootSequence(outputEl: HTMLElement, onDone: () => void): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    BOOT_LINES.forEach((line) => appendFullLine(outputEl, line));
    onDone();
    return;
  }

  let skip = false;
  const onSkip = () => {
    skip = true;
  };
  document.addEventListener('keydown', onSkip, { once: true });
  document.addEventListener('click', onSkip, { once: true });

  (async () => {
    for (const line of BOOT_LINES) {
      if (skip) {
        appendFullLine(outputEl, line);
        continue;
      }
      const div = document.createElement('div');
      div.className = `line ${line.cls}`;
      outputEl.appendChild(div);
      for (const ch of line.text) {
        if (skip) {
          div.textContent = line.text;
          break;
        }
        div.textContent += ch;
        outputEl.scrollTop = outputEl.scrollHeight;
        await sleep(CHAR_DELAY_MS);
      }
      outputEl.scrollTop = outputEl.scrollHeight;
      if (!skip) await sleep(LINE_DELAY_MS);
    }
    document.removeEventListener('keydown', onSkip);
    document.removeEventListener('click', onSkip);
    onDone();
  })();
}
