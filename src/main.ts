import './style.css';
import { Terminal } from './terminal';
import { runBootSequence } from './boot';

const app = document.querySelector<HTMLDivElement>('#app')!;
const terminal = new Terminal(app);

runBootSequence(terminal.output, () => terminal.enableInput());
