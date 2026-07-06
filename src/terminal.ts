import { Line } from './content';
import { dispatch, CommandContext, StreamHandle } from './commands';

const PROMPT = 'guest@chinmay:~$';
const QUICK_COMMANDS = ['help', 'about', 'projects', 'skills', 'contact'];

function isTouchDevice(): boolean {
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  return coarsePointer || (hasTouch && window.innerWidth < 768);
}

export class Terminal {
  private outputEl: HTMLDivElement;
  private inputEl: HTMLInputElement;
  private formEl: HTMLFormElement;
  private history: string[] = [];
  private historyIndex = 0;

  constructor(private root: HTMLElement) {
    const win = document.createElement('div');
    win.className = 'term-window';

    const chrome = document.createElement('div');
    chrome.className = 'term-chrome';
    chrome.innerHTML = `
      <span class="term-dots"><span class="dot dot-red"></span><span class="dot dot-amber"></span><span class="dot dot-teal"></span></span>
      <span class="term-title">chinmay@kolhapur: ~</span>
    `;

    const body = document.createElement('div');
    body.className = 'term-body';

    this.outputEl = document.createElement('div');
    this.outputEl.className = 'term-output';
    this.outputEl.setAttribute('role', 'log');
    this.outputEl.setAttribute('aria-live', 'polite');

    this.formEl = document.createElement('form');
    this.formEl.className = 'term-inputline';
    this.formEl.innerHTML = `
      <span class="prompt">${PROMPT}</span>
      <input type="text" class="term-input" autocomplete="off" autocapitalize="off"
        autocorrect="off" spellcheck="false" aria-label="terminal command input" disabled />
    `;
    this.inputEl = this.formEl.querySelector('input') as HTMLInputElement;

    const chips = document.createElement('div');
    chips.className = 'term-chips';
    for (const cmd of QUICK_COMMANDS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = cmd;
      btn.addEventListener('click', () => this.runChip(cmd));
      chips.appendChild(btn);
    }

    body.appendChild(this.outputEl);
    body.appendChild(this.formEl);
    body.appendChild(chips);
    win.appendChild(chrome);
    win.appendChild(body);
    this.root.appendChild(win);

    this.formEl.addEventListener('submit', (e) => this.onSubmit(e));
    this.inputEl.addEventListener('keydown', (e) => this.onKeydown(e));
    win.addEventListener('click', () => {
      if (!isTouchDevice() && !this.inputEl.disabled) this.inputEl.focus();
    });
  }

  get output(): HTMLDivElement {
    return this.outputEl;
  }

  enableInput(): void {
    this.inputEl.disabled = false;
    if (!isTouchDevice()) this.inputEl.focus();
  }

  appendLines(lines: Line[]): void {
    for (const line of lines) {
      const div = document.createElement('div');
      div.className = `line${line.cls ? ' ' + line.cls : ''}`;
      if (line.href) {
        const a = document.createElement('a');
        a.className = 'term-link';
        a.href = line.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = line.text;
        div.appendChild(a);
      } else {
        div.textContent = line.text || ' ';
      }
      this.outputEl.appendChild(div);
    }
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  private printPrompt(raw: string): void {
    const div = document.createElement('div');
    div.className = 'line prompt-line';
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = `${PROMPT} `;
    div.appendChild(promptSpan);
    div.appendChild(document.createTextNode(raw));
    this.outputEl.appendChild(div);
    this.scrollToBottom();
  }

  private createStreamLine(cls?: string): StreamHandle {
    const div = document.createElement('div');
    div.className = `line${cls ? ' ' + cls : ''}`;
    this.outputEl.appendChild(div);
    this.scrollToBottom();
    return {
      set: (text: string) => {
        div.textContent = text;
        this.scrollToBottom();
      },
      append: (text: string) => {
        div.textContent += text;
        this.scrollToBottom();
      },
    };
  }

  private async runCommand(raw: string): Promise<void> {
    const ctx: CommandContext = {
      history: this.history,
      print: (lines) => this.appendLines(lines),
      streamLine: (cls) => this.createStreamLine(cls),
    };
    const result = await dispatch(raw, ctx);
    if (Array.isArray(result)) {
      this.appendLines(result);
    } else {
      this.outputEl.innerHTML = '';
    }
  }

  private async submit(raw: string): Promise<void> {
    if (!raw.trim()) return;
    this.printPrompt(raw);
    this.history.push(raw);
    this.historyIndex = this.history.length;
    this.inputEl.disabled = true;
    try {
      await this.runCommand(raw);
    } finally {
      this.inputEl.disabled = false;
      if (!isTouchDevice()) this.inputEl.focus();
    }
  }

  private onSubmit(e: Event): void {
    e.preventDefault();
    const raw = this.inputEl.value;
    this.inputEl.value = '';
    void this.submit(raw);
  }

  private onKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length === 0) return;
      this.historyIndex = Math.max(0, this.historyIndex - 1);
      this.inputEl.value = this.history[this.historyIndex] ?? '';
      this.moveCursorToEnd();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex >= this.history.length - 1) {
        this.historyIndex = this.history.length;
        this.inputEl.value = '';
      } else {
        this.historyIndex++;
        this.inputEl.value = this.history[this.historyIndex] ?? '';
      }
      this.moveCursorToEnd();
    }
  }

  private moveCursorToEnd(): void {
    const len = this.inputEl.value.length;
    this.inputEl.setSelectionRange(len, len);
  }

  private async runChip(cmd: string): Promise<void> {
    this.inputEl.value = cmd;
    this.inputEl.focus();
    this.inputEl.value = '';
    await this.submit(cmd);
  }
}
