import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface OracleConfig {
  obsidianVaultPath: string;
  oracleFolder: string;  // folder within vault for Oracle data
  anthropicApiKey: string;
  tavilyApiKey?: string;  // optional — enables web search
  model: string;
  shadowfaxPath: string;  // path to Shadowfax/SAM data
}

const CONFIG_DIR = path.join(os.homedir(), '.oracle');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG: Partial<OracleConfig> = {
  oracleFolder: 'Oracle',
  model: 'claude-sonnet-4-20250514',
};

export function loadConfig(): OracleConfig {
  if (!fs.existsSync(CONFIG_FILE)) {
    throw new Error(
      'Oracle not configured. Run: oracle init'
    );
  }
  const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  return { ...DEFAULT_CONFIG, ...raw } as OracleConfig;
}

export function saveConfig(config: Partial<OracleConfig>): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  const existing = fs.existsSync(CONFIG_FILE)
    ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
    : {};
  const merged = { ...DEFAULT_CONFIG, ...existing, ...config };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2));
}

export function configExists(): boolean {
  return fs.existsSync(CONFIG_FILE);
}

export function getOraclePath(config: OracleConfig, ...segments: string[]): string {
  return path.join(config.obsidianVaultPath, config.oracleFolder, ...segments);
}
