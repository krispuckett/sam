import chalk from 'chalk';

const ORACLE_GOLD = chalk.hex('#C4A34A');
const ORACLE_DIM = chalk.dim;
const ORACLE_BOLD = chalk.bold;

export function banner() {
  console.log('');
  console.log(ORACLE_GOLD('  ═══════════════════════════════════════════════════'));
  console.log(ORACLE_GOLD('  ') + ORACLE_BOLD.white('  ORACLE') + ORACLE_DIM('  Elite Executive Coaching'));
  console.log(ORACLE_GOLD('  ═══════════════════════════════════════════════════'));
  console.log('');
}

export function sessionHeader(title: string, duration?: string) {
  console.log('');
  console.log(ORACLE_GOLD('  ─── ') + ORACLE_BOLD.white(title) + (duration ? ORACLE_DIM(` (${duration})`) : ''));
  console.log('');
}

export function oracleSays(text: string) {
  // Stream-friendly: just write the text with oracle styling prefix
  process.stdout.write(ORACLE_GOLD('  ▸ '));
  console.log(chalk.white(text));
}

export function dim(text: string) {
  console.log(ORACLE_DIM(`  ${text}`));
}

export function divider() {
  console.log(ORACLE_GOLD('  ───'));
}

export function blank() {
  console.log('');
}

export function error(text: string) {
  console.log(chalk.red(`  ✗ ${text}`));
}

export function success(text: string) {
  console.log(chalk.green(`  ✓ ${text}`));
}

export function info(text: string) {
  console.log(ORACLE_DIM(`  ℹ ${text}`));
}

export { ORACLE_GOLD, ORACLE_DIM, ORACLE_BOLD };
