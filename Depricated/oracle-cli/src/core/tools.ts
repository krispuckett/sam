import Anthropic from '@anthropic-ai/sdk';
import { ObsidianVault } from '../obsidian/vault';
import { OracleConfig } from '../utils/config';
import { tavily } from '@tavily/core';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { format } from 'date-fns';
import chalk from 'chalk';

const DIM = chalk.dim;

// ── Tool Definitions (Claude API format) ──────────────────────────

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  // ── Web Search ──
  {
    name: 'web_search',
    description: `Search the web for current information. Use when:
- The coachee references a concept, framework, or person you want to understand more deeply
- You need current context about their company, industry, or role
- They mention an article, book, or research you want to verify
- You want to ground coaching advice in recent evidence or data
Keep queries focused and specific.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query — concise and specific',
        },
        topic: {
          type: 'string',
          enum: ['general', 'news'],
          description: 'Search topic type. Use "news" for recent events.',
        },
      },
      required: ['query'],
    },
  },

  // ── Obsidian Read ──
  {
    name: 'vault_read',
    description: `Read a specific file or section from the coaching vault in Obsidian. Use when:
- You need to check the current baseline, immunity map, patterns, or development focus
- You want to review a specific past session
- You need to verify a commitment or stakeholder detail
- You want to look at daily score trends
Available paths: Baseline.md, Patterns.md, Development Focus.md, Guardrails.md, 
Active Questions.md, Commitments.md, Sessions/<filename>, Immunity Maps/<filename>,
Stakeholders/<filename>, Daily Scores/<month>.csv`,
    input_schema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description: 'Relative path within the Oracle vault folder (e.g., "Baseline.md", "Sessions/2026-04-16-tactical.md")',
        },
      },
      required: ['path'],
    },
  },

  // ── Obsidian Write ──
  {
    name: 'vault_write',
    description: `Write or update a file in the coaching vault. Use when:
- Updating patterns based on what you're observing across sessions
- Recording a new immunity map
- Updating the baseline after significant insight
- Adding a commitment
- Updating development focus
- Writing session notes
Always explain what you're writing and why.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        path: {
          type: 'string',
          description: 'Relative path within the Oracle vault folder',
        },
        content: {
          type: 'string',
          description: 'Full markdown content to write',
        },
        mode: {
          type: 'string',
          enum: ['overwrite', 'append'],
          description: 'Write mode. Use "append" to add to existing file, "overwrite" to replace.',
        },
      },
      required: ['path', 'content'],
    },
  },

  // ── Vault List ──
  {
    name: 'vault_list',
    description: `List files in a vault directory. Use to discover available sessions, immunity maps, or stakeholder profiles.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        directory: {
          type: 'string',
          description: 'Relative directory path (e.g., "Sessions", "Immunity Maps", "Stakeholders", "Daily Scores")',
        },
      },
      required: ['directory'],
    },
  },

  // ── Memory Store ──
  {
    name: 'memory_store',
    description: `Store a cross-session pattern observation or insight in persistent memory. Use when:
- You notice a pattern across multiple sessions (avoidance, recurring theme, emotional signature)
- A significant insight emerges that should inform future sessions
- You detect a shift in behavior or language
- Something is conspicuously absent from what the coachee shares
Memory entries are timestamped and searchable. Be specific and include evidence.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string',
          enum: ['pattern', 'insight', 'shift', 'avoidance', 'strength', 'risk', 'relationship', 'growth'],
          description: 'Category of the memory entry',
        },
        content: {
          type: 'string',
          description: 'The observation, pattern, or insight to remember. Be specific with evidence.',
        },
        significance: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'How significant is this for ongoing coaching work',
        },
      },
      required: ['category', 'content'],
    },
  },

  // ── Memory Search ──
  {
    name: 'memory_search',
    description: `Search persistent memory for past observations, patterns, and insights. Use when:
- You want to check if a pattern has been observed before
- Exploring what has been noted about a specific topic, person, or behavior
- Looking for evidence to support a confrontation or challenge
- Preparing context for a session`,
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Natural language search query',
        },
        category: {
          type: 'string',
          enum: ['pattern', 'insight', 'shift', 'avoidance', 'strength', 'risk', 'relationship', 'growth', 'all'],
          description: 'Filter by category, or "all" for everything',
        },
      },
      required: ['query'],
    },
  },

  // ── Shell Command ──
  {
    name: 'run_command',
    description: `Execute a shell command and return the output. Use sparingly and only when:
- Checking git status on a project being discussed
- Reading a specific file the coachee mentions
- Getting system information relevant to the conversation
Commands are executed in a sandboxed context. Never execute destructive commands.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        command: {
          type: 'string',
          description: 'Shell command to execute',
        },
        working_directory: {
          type: 'string',
          description: 'Working directory for the command (optional)',
        },
      },
      required: ['command'],
    },
  },

  // ── Add Commitment ──
  {
    name: 'add_commitment',
    description: `Record a coaching commitment. Use at the end of a session when the coachee makes a specific, behavioral, time-bound commitment. Always confirm the commitment details before recording.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        commitment: {
          type: 'string',
          description: 'The specific, behavioral commitment',
        },
        due_date: {
          type: 'string',
          description: 'Due date (YYYY-MM-DD format)',
        },
        stakeholder: {
          type: 'string',
          description: 'Who will notice if this is done (optional)',
        },
      },
      required: ['commitment', 'due_date'],
    },
  },
];

// ── Tool Executor ─────────────────────────────────────────────────

export class ToolExecutor {
  private vault: ObsidianVault;
  private config: OracleConfig;
  private memoryPath: string;
  private tavilyClient: ReturnType<typeof tavily> | null = null;

  constructor(config: OracleConfig, vault: ObsidianVault) {
    this.config = config;
    this.vault = vault;
    this.memoryPath = path.join(
      config.obsidianVaultPath,
      config.oracleFolder,
      '.memory.jsonl'
    );

    // Initialize Tavily if key is available
    if (config.tavilyApiKey) {
      this.tavilyClient = tavily({ apiKey: config.tavilyApiKey });
    }
  }

  async execute(
    toolName: string,
    toolInput: Record<string, unknown>
  ): Promise<string> {
    const startTime = Date.now();

    try {
      let result: string;

      switch (toolName) {
        case 'web_search':
          result = await this.webSearch(
            toolInput.query as string,
            toolInput.topic as string | undefined
          );
          break;

        case 'vault_read':
          result = this.vaultRead(toolInput.path as string);
          break;

        case 'vault_write':
          result = this.vaultWrite(
            toolInput.path as string,
            toolInput.content as string,
            toolInput.mode as 'overwrite' | 'append' | undefined
          );
          break;

        case 'vault_list':
          result = this.vaultList(toolInput.directory as string);
          break;

        case 'memory_store':
          result = this.memoryStore(
            toolInput.category as string,
            toolInput.content as string,
            toolInput.significance as string | undefined
          );
          break;

        case 'memory_search':
          result = this.memorySearch(
            toolInput.query as string,
            toolInput.category as string | undefined
          );
          break;

        case 'run_command':
          result = this.runCommand(
            toolInput.command as string,
            toolInput.working_directory as string | undefined
          );
          break;

        case 'add_commitment':
          result = this.addCommitment(
            toolInput.commitment as string,
            toolInput.due_date as string,
            toolInput.stakeholder as string | undefined
          );
          break;

        default:
          result = `Unknown tool: ${toolName}`;
      }

      const elapsed = Date.now() - startTime;
      process.stderr.write(DIM(`  [${toolName} ${elapsed}ms]\n`));

      return result;
    } catch (err: any) {
      return `Error executing ${toolName}: ${err.message}`;
    }
  }

  // ── Individual tool implementations ─────────────────────────────

  private async webSearch(query: string, topic?: string): Promise<string> {
    if (!this.tavilyClient) {
      return 'Web search not available — no Tavily API key configured. Run `oracle init` to add one.';
    }

    const response = await this.tavilyClient.search(query, {
      searchDepth: 'advanced',
      maxResults: 5,
      topic: topic === 'news' ? 'news' : 'general',
    });

    if (!response.results || response.results.length === 0) {
      return 'No results found.';
    }

    let output = '';
    for (const result of response.results) {
      output += `### ${result.title}\n`;
      output += `${result.url}\n`;
      output += `${result.content}\n\n`;
    }

    return output;
  }

  private vaultRead(relativePath: string): string {
    const content = this.vault.readFile(relativePath);
    if (content === null) {
      return `File not found: ${relativePath}`;
    }
    return content;
  }

  private vaultWrite(
    relativePath: string,
    content: string,
    mode?: 'overwrite' | 'append'
  ): string {
    if (mode === 'append') {
      const existing = this.vault.readFile(relativePath) || '';
      this.vault.writeFile(relativePath, existing + '\n\n' + content);
    } else {
      this.vault.writeFile(relativePath, content);
    }
    return `Written to ${relativePath}`;
  }

  private vaultList(directory: string): string {
    const fullPath = path.join(
      this.config.obsidianVaultPath,
      this.config.oracleFolder,
      directory
    );

    if (!fs.existsSync(fullPath)) {
      return `Directory not found: ${directory}`;
    }

    const files = fs.readdirSync(fullPath)
      .filter(f => !f.startsWith('.'))
      .sort();

    if (files.length === 0) {
      return `No files in ${directory}`;
    }

    return files.map(f => {
      const stat = fs.statSync(path.join(fullPath, f));
      if (stat.isDirectory()) return `📁 ${f}/`;
      const size = stat.size < 1024
        ? `${stat.size}B`
        : `${(stat.size / 1024).toFixed(1)}KB`;
      return `  ${f} (${size})`;
    }).join('\n');
  }

  private memoryStore(
    category: string,
    content: string,
    significance?: string
  ): string {
    const entry = {
      timestamp: new Date().toISOString(),
      category,
      content,
      significance: significance || 'medium',
    };

    fs.appendFileSync(this.memoryPath, JSON.stringify(entry) + '\n');

    return `Stored ${category} memory (${significance || 'medium'} significance)`;
  }

  private memorySearch(query: string, category?: string): string {
    if (!fs.existsSync(this.memoryPath)) {
      return 'No memories stored yet.';
    }

    const lines = fs.readFileSync(this.memoryPath, 'utf-8')
      .trim()
      .split('\n')
      .filter(Boolean);

    if (lines.length === 0) return 'No memories stored yet.';

    const entries = lines.map(l => JSON.parse(l));

    // Filter by category if specified
    let filtered = category && category !== 'all'
      ? entries.filter((e: any) => e.category === category)
      : entries;

    // Simple keyword matching (could be upgraded to embeddings later)
    const queryWords = query.toLowerCase().split(/\s+/);
    const scored = filtered.map((entry: any) => {
      const text = entry.content.toLowerCase();
      const score = queryWords.filter(w => text.includes(w)).length;
      return { ...entry, score };
    });

    const relevant = scored
      .filter((e: any) => e.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);

    if (relevant.length === 0) {
      // Return most recent entries if no keyword match
      const recent = filtered.slice(-5);
      if (recent.length === 0) return 'No relevant memories found.';
      return 'No exact matches. Recent entries:\n\n' +
        recent.map((e: any) =>
          `[${e.timestamp.split('T')[0]}] (${e.category}/${e.significance}) ${e.content}`
        ).join('\n\n');
    }

    return relevant.map((e: any) =>
      `[${e.timestamp.split('T')[0]}] (${e.category}/${e.significance}) ${e.content}`
    ).join('\n\n');
  }

  private runCommand(command: string, cwd?: string): string {
    // Safety: block destructive commands
    const blocked = ['rm -rf', 'rmdir', 'mkfs', 'dd if=', 'format', ':(){', 'fork bomb'];
    if (blocked.some(b => command.includes(b))) {
      return 'Command blocked for safety.';
    }

    try {
      const output = execSync(command, {
        cwd: cwd || process.env.HOME,
        timeout: 10000,
        maxBuffer: 1024 * 100,
        encoding: 'utf-8',
      });
      return output.trim() || '(no output)';
    } catch (err: any) {
      return `Command failed: ${err.message.slice(0, 500)}`;
    }
  }

  private addCommitment(
    commitment: string,
    dueDate: string,
    stakeholder?: string
  ): string {
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const commitmentLine = stakeholder
      ? `| ${commitment} | ${dateStr} | ${dueDate} | ${stakeholder} | Open |`
      : `| ${commitment} | ${dateStr} | ${dueDate} | — | Open |`;

    const existing = this.vault.readFile('Commitments.md');

    if (!existing) {
      // Create the file from scratch
      const content = `# Commitments

## Active

| Commitment | Made | Due | Stakeholder | Status |
|---|---|---|---|---|
${commitmentLine}

## Completed

| Commitment | Made | Due | Stakeholder | Completed | Outcome |
|---|---|---|---|---|---|
`;
      this.vault.writeFile('Commitments.md', content);
    } else {
      // Insert after the active table header
      const headerPattern = /(\| Commitment \| Made \| Due \|.*\|\n\|[-|]+\|)/;
      const match = existing.match(headerPattern);
      if (match) {
        const updated = existing.replace(
          headerPattern,
          `$1\n${commitmentLine}`
        );
        this.vault.writeFile('Commitments.md', updated);
      } else {
        // Fallback: append
        this.vault.writeFile(
          'Commitments.md',
          existing + '\n' + commitmentLine
        );
      }
    }

    return `Commitment recorded: "${commitment}" (due ${dueDate})`;
  }
}
