import * as fs from 'fs';
import * as path from 'path';
import { OracleConfig, getOraclePath } from '../utils/config';
import { format } from 'date-fns';
import matter from 'gray-matter';

/**
 * Obsidian Vault integration.
 * Reads/writes markdown files in the Oracle folder of the user's vault.
 * 
 * Expected vault structure:
 * 
 * {vault}/Oracle/
 * ├── Baseline.md              # Leadership profile, strengths, edges
 * ├── Patterns.md              # Cross-session pattern tracking
 * ├── Development Focus.md     # Current growth area
 * ├── Guardrails.md            # If-Then rules
 * ├── Active Questions.md      # Daily questions config
 * ├── Immunity Maps/           # Immunity to Change maps
 * ├── Sessions/                # Session notes by date
 * │   └── 2026-04-16-tactical.md
 * ├── Commitments.md           # Active + completed commitments
 * ├── Stakeholders/            # Stakeholder profiles
 * ├── Daily Scores/            # Daily active question logs
 * │   └── 2026-04.csv
 * └── Pattern Reports/         # Generated pattern analysis
 */

export class ObsidianVault {
  private config: OracleConfig;
  private oracleRoot: string;

  constructor(config: OracleConfig) {
    this.config = config;
    this.oracleRoot = getOraclePath(config);
  }

  // ── Initialization ──────────────────────────────────────────────

  ensureStructure(): void {
    const dirs = [
      '',
      'Sessions',
      'Immunity Maps',
      'Stakeholders',
      'Daily Scores',
      'Pattern Reports',
    ];
    for (const dir of dirs) {
      const fullPath = path.join(this.oracleRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  // ── Reading ─────────────────────────────────────────────────────

  readFile(relativePath: string): string | null {
    const fullPath = path.join(this.oracleRoot, relativePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf-8');
    }
    return null;
  }

  readBaseline(): string {
    return this.readFile('Baseline.md') || '# Baseline\n\nNo baseline established yet. Run `oracle intake` to create one.';
  }

  readPatterns(): string {
    return this.readFile('Patterns.md') || '# Patterns\n\nNo patterns tracked yet.';
  }

  readDevelopmentFocus(): string {
    return this.readFile('Development Focus.md') || '# Development Focus\n\nNo focus set yet.';
  }

  readGuardrails(): string {
    return this.readFile('Guardrails.md') || '# Guardrails\n\nNo guardrails defined yet.';
  }

  readActiveQuestions(): string {
    return this.readFile('Active Questions.md') || '# Active Questions\n\nUsing default Goldsmith 6 + 2 custom questions.';
  }

  readCommitments(): string {
    return this.readFile('Commitments.md') || '# Commitments\n\nNo active commitments.';
  }

  readStakeholders(): string {
    const indexPath = path.join(this.oracleRoot, 'Stakeholders');
    if (!fs.existsSync(indexPath)) return '# Stakeholders\n\nNo stakeholder map yet.';

    const files = fs.readdirSync(indexPath).filter(f => f.endsWith('.md'));
    if (files.length === 0) return '# Stakeholders\n\nNo stakeholder profiles yet.';

    let combined = '# Stakeholders\n\n';
    for (const file of files) {
      combined += fs.readFileSync(path.join(indexPath, file), 'utf-8') + '\n\n---\n\n';
    }
    return combined;
  }

  readRecentSessions(count: number = 5): string {
    const sessionsDir = path.join(this.oracleRoot, 'Sessions');
    if (!fs.existsSync(sessionsDir)) return '';

    const files = fs.readdirSync(sessionsDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse()
      .slice(0, count);

    if (files.length === 0) return '';

    let combined = '# Recent Sessions\n\n';
    for (const file of files) {
      combined += fs.readFileSync(path.join(sessionsDir, file), 'utf-8') + '\n\n---\n\n';
    }
    return combined;
  }

  readImmunityMaps(): string {
    const mapsDir = path.join(this.oracleRoot, 'Immunity Maps');
    if (!fs.existsSync(mapsDir)) return '';

    const files = fs.readdirSync(mapsDir).filter(f => f.endsWith('.md'));
    if (files.length === 0) return '';

    let combined = '# Active Immunity Maps\n\n';
    for (const file of files) {
      combined += fs.readFileSync(path.join(mapsDir, file), 'utf-8') + '\n\n---\n\n';
    }
    return combined;
  }

  readDailyScores(days: number = 30): string {
    const scoresDir = path.join(this.oracleRoot, 'Daily Scores');
    if (!fs.existsSync(scoresDir)) return '';

    const files = fs.readdirSync(scoresDir)
      .filter(f => f.endsWith('.csv'))
      .sort()
      .reverse();

    if (files.length === 0) return '';

    let lines: string[] = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(scoresDir, file), 'utf-8');
      const fileLines = content.trim().split('\n');
      // Skip header except for first file
      if (lines.length === 0) {
        lines.push(...fileLines);
      } else {
        lines.push(...fileLines.slice(1));
      }
      if (lines.length > days + 1) break;
    }

    return lines.slice(0, days + 1).join('\n');
  }

  /**
   * Assemble full coaching context for a session.
   */
  assembleContext(): string {
    const sections = [
      this.readBaseline(),
      this.readDevelopmentFocus(),
      this.readPatterns(),
      this.readGuardrails(),
      this.readCommitments(),
      this.readImmunityMaps(),
      this.readStakeholders(),
      this.readRecentSessions(3),
    ].filter(s => s.trim().length > 0);

    const dailyScores = this.readDailyScores(14);
    if (dailyScores) {
      sections.push('# Recent Daily Scores (Last 14 Days)\n\n```csv\n' + dailyScores + '\n```');
    }

    return sections.join('\n\n---\n\n');
  }

  // ── Writing ─────────────────────────────────────────────────────

  writeFile(relativePath: string, content: string): void {
    const fullPath = path.join(this.oracleRoot, relativePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content);
  }

  writeSessionNotes(sessionType: string, content: string): string {
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const filename = `${dateStr}-${sessionType}.md`;

    // Handle duplicate session names on same day
    let finalFilename = filename;
    let counter = 2;
    while (fs.existsSync(path.join(this.oracleRoot, 'Sessions', finalFilename))) {
      finalFilename = `${dateStr}-${sessionType}-${counter}.md`;
      counter++;
    }

    const frontmatter = matter.stringify(content, {
      date: dateStr,
      type: sessionType,
      tags: ['oracle', 'coaching', sessionType],
    });

    this.writeFile(path.join('Sessions', finalFilename), frontmatter);
    return finalFilename;
  }

  appendDailyScore(scores: number[], notes: string = ''): void {
    const monthStr = format(new Date(), 'yyyy-MM');
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const filename = `${monthStr}.csv`;
    const filePath = path.join(this.oracleRoot, 'Daily Scores', filename);

    const header = 'date,goals,progress,meaning,engaged,relationships,happy,custom1,custom2,notes';

    if (!fs.existsSync(filePath)) {
      this.writeFile(path.join('Daily Scores', filename), header + '\n');
    }

    const line = `${dateStr},${scores.join(',')},\"${notes.replace(/"/g, '""')}\"`;
    fs.appendFileSync(filePath, line + '\n');
  }

  appendCommitment(commitment: string, dueDate: string): void {
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const existing = this.readFile('Commitments.md') || '# Commitments\n\n## Active\n\n| Commitment | Made | Due | Status |\n|---|---|---|---|\n\n## Completed\n\n| Commitment | Made | Due | Completed | Outcome |\n|---|---|---|---|---|';

    // Insert new commitment into active table
    const newRow = `| ${commitment} | ${dateStr} | ${dueDate} | Open |`;
    const updated = existing.replace(
      /(\| Commitment \| Made \| Due \| Status \|\n\|.*\|.*\|.*\|.*\|)/,
      `$1\n${newRow}`
    );

    this.writeFile('Commitments.md', updated);
  }

  writeImmunityMap(name: string, content: string): void {
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    this.writeFile(path.join('Immunity Maps', `${dateStr}-${name}.md`), content);
  }

  updatePatterns(newPatterns: string): void {
    this.writeFile('Patterns.md', newPatterns);
  }
}
