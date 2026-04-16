import Anthropic from '@anthropic-ai/sdk';
import { OracleConfig } from '../utils/config';
import { ObsidianVault } from '../obsidian/vault';
import { ShadowfaxConnector } from '../shadowfax/context';
import { SYSTEM_PROMPT } from '../prompts/system';
import { getSessionPrompt } from '../prompts/sessions';
import { TOOL_DEFINITIONS, ToolExecutor } from './tools';
import * as readline from 'readline';
import chalk from 'chalk';

const ORACLE_GOLD = chalk.hex('#C4A34A');
const DIM = chalk.dim;

export type SessionType = 
  | 'tactical' 
  | 'immunity' 
  | 'decision' 
  | 'feedback' 
  | 'retro' 
  | 'stakeholders'
  | 'intake'
  | 'open'
  | 'daily'
  | 'accountability'
  | 'patterns'
  | 'derailers'
  | '360';

// Use Anthropic's native message param type for full compatibility
type Message = Anthropic.MessageParam;

export class OracleEngine {
  private client: Anthropic;
  private config: OracleConfig;
  private vault: ObsidianVault;
  private shadowfax: ShadowfaxConnector;
  private toolExecutor: ToolExecutor;
  private messages: Message[] = [];
  private sessionType: SessionType = 'open';
  private sessionTranscript: string[] = [];
  private rl: readline.Interface;
  private fullSystemPrompt: string = '';

  constructor(config: OracleConfig) {
    this.config = config;
    this.client = new Anthropic({ apiKey: config.anthropicApiKey });
    this.vault = new ObsidianVault(config);
    this.shadowfax = new ShadowfaxConnector(config);
    this.toolExecutor = new ToolExecutor(config, this.vault);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async startSession(type: SessionType, topic?: string): Promise<void> {
    this.sessionType = type;
    this.vault.ensureStructure();

    // Assemble context
    const vaultContext = this.vault.assembleContext();
    const shadowfaxContext = this.shadowfax.formatForPrompt();
    const sessionPrompt = getSessionPrompt(type, topic);

    // Build system prompt with tool awareness
    this.fullSystemPrompt = [
      SYSTEM_PROMPT,
      '\n\n---\n\n# CURRENT COACHING DATA\n\n',
      shadowfaxContext,
      '\n\n---\n\n',
      vaultContext,
      '\n\n---\n\n',
      TOOL_AWARENESS_PROMPT,
    ].join('');

    // Add the session-specific opening as the first user message
    this.messages = [{
      role: 'user',
      content: sessionPrompt,
    }];

    // Get and stream the first response (with tool loop)
    await this.getResponse();

    // Enter conversation loop
    await this.conversationLoop();
  }

  /**
   * Core response loop — handles streaming + tool use cycles.
   * Claude may return tool_use blocks, which we execute and feed back,
   * continuing until we get a final text response.
   */
  private async getResponse(): Promise<string> {
    let fullTextResponse = '';
    let iterations = 0;
    const MAX_TOOL_ITERATIONS = 10;

    while (iterations < MAX_TOOL_ITERATIONS) {
      iterations++;

      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: 4096,
        system: this.fullSystemPrompt,
        tools: TOOL_DEFINITIONS,
        messages: this.messages as Anthropic.MessageParam[],
      });

      // Process the response content blocks
      const toolUseBlocks: Anthropic.ToolUseBlock[] = [];
      let textContent = '';

      for (const block of response.content) {
        if (block.type === 'text') {
          textContent += block.text;
        } else if (block.type === 'tool_use') {
          toolUseBlocks.push(block);
        }
      }

      // Display any text content
      if (textContent) {
        this.displayOracleText(textContent);
        fullTextResponse += textContent;
      }

      // Add assistant response to messages
      this.messages.push({
        role: 'assistant',
        content: response.content,
      });

      // If no tool calls, we're done
      if (toolUseBlocks.length === 0) {
        break;
      }

      // Execute tools and add results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolBlock of toolUseBlocks) {
        process.stderr.write(DIM(`  ⚙ ${toolBlock.name}...`));

        const result = await this.toolExecutor.execute(
          toolBlock.name,
          toolBlock.input as Record<string, unknown>
        );

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolBlock.id,
          content: result,
        });
      }

      // Add tool results as user message (Claude API convention)
      this.messages.push({
        role: 'user',
        content: toolResults,
      });

      // If stop reason is end_turn (not tool_use), we're done
      if (response.stop_reason === 'end_turn') {
        break;
      }

      // Otherwise, loop to let Claude process tool results
    }

    // Add to transcript
    if (fullTextResponse) {
      this.sessionTranscript.push(`**Oracle:** ${fullTextResponse}`);
    }

    return fullTextResponse;
  }

  private displayOracleText(text: string): void {
    process.stdout.write('\n' + ORACLE_GOLD('  '));
    const formatted = text.replace(/\n/g, '\n' + ORACLE_GOLD('  '));
    process.stdout.write(chalk.white(formatted));
    process.stdout.write('\n\n');
  }

  private async conversationLoop(): Promise<void> {
    while (true) {
      const input = await this.prompt();

      if (!input) continue;

      // Handle meta-commands
      if (input.toLowerCase() === '/end' || input.toLowerCase() === '/quit') {
        await this.endSession();
        break;
      }

      if (input.toLowerCase() === '/save') {
        await this.saveSession();
        continue;
      }

      if (input.toLowerCase() === '/help') {
        this.showSessionHelp();
        continue;
      }

      if (input.toLowerCase() === '/tools') {
        this.showToolStatus();
        continue;
      }

      // Add user message and get response
      this.messages.push({ role: 'user', content: input });
      this.sessionTranscript.push(`**Kris:** ${input}`);

      await this.getResponse();
    }
  }

  private async endSession(): Promise<void> {
    // Ask Oracle to generate session summary + use tools to save
    const summaryRequest = `The session is ending. Do three things:

1. Generate session notes in this format:

## ${new Date().toISOString().split('T')[0]} — ${this.sessionType.charAt(0).toUpperCase() + this.sessionType.slice(1)}

**Focus:** [What was explored]

**Key Insight:** [The one thing that emerged]

**Pattern Observed:** [Any pattern worth tracking]

**Framework(s) Used:** [Which frameworks were activated and why]

**Commitment:** [Exact commitment, due date, who will notice — or "None this session"]

**Commitment Review:** [Status of previous commitment if discussed]

**What Was Most Useful:** [If discussed, otherwise "Not asked"]

**Ripple:** [How this might affect the team/organization]

**Oracle Notes:** [Your observations — what wasn't said, what was avoided, what shifted, what's emerging across sessions]

2. Use vault_write to save the session notes to Sessions/

3. If any patterns were observed, use memory_store to record them.

4. If a commitment was made, use add_commitment to record it.`;

    this.messages.push({ role: 'user', content: summaryRequest });

    console.log(DIM('\n  Generating session notes...\n'));

    await this.getResponse();

    console.log(chalk.green('  ✓ Session complete'));

    this.rl.close();
  }

  private async saveSession(): Promise<void> {
    const transcript = this.sessionTranscript.join('\n\n');
    const filename = this.vault.writeSessionNotes(
      this.sessionType + '-partial',
      `# Partial Session Transcript\n\n${transcript}`
    );
    console.log(chalk.green(`  ✓ Partial save: Oracle/Sessions/${filename}`));
  }

  private showSessionHelp(): void {
    console.log('');
    console.log(DIM('  Session Commands:'));
    console.log(DIM('  /end    — End session, generate notes, save to vault'));
    console.log(DIM('  /save   — Save partial transcript'));
    console.log(DIM('  /tools  — Show available tools and status'));
    console.log(DIM('  /help   — Show this help'));
    console.log(DIM('  /quit   — Same as /end'));
    console.log('');
  }

  private showToolStatus(): void {
    console.log('');
    console.log(ORACLE_GOLD('  Tools Available:'));
    console.log(`  ${chalk.green('●')} vault_read     Read from Obsidian vault`);
    console.log(`  ${chalk.green('●')} vault_write    Write to Obsidian vault`);
    console.log(`  ${chalk.green('●')} vault_list     List vault files`);
    console.log(`  ${chalk.green('●')} memory_store   Store cross-session patterns`);
    console.log(`  ${chalk.green('●')} memory_search  Search past observations`);
    console.log(`  ${chalk.green('●')} add_commitment Record a commitment`);
    console.log(`  ${chalk.green('●')} run_command    Execute shell commands`);
    const searchStatus = this.config.tavilyApiKey ? chalk.green('●') : chalk.red('○');
    console.log(`  ${searchStatus} web_search     Search the web${!this.config.tavilyApiKey ? ' (no API key)' : ''}`);
    console.log('');
  }

  private prompt(): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(chalk.hex('#666666')('  You: '), (answer) => {
        resolve(answer.trim());
      });
    });
  }

  // ── Daily Active Questions (non-conversational) ─────────────────

  async runDailyQuestions(): Promise<void> {
    this.vault.ensureStructure();

    const questions = [
      'Set clear goals?',
      'Make progress toward my goals?',
      'Find meaning?',
      'Be fully engaged?',
      'Build positive relationships?',
      'Be happy?',
      'Be visibly present (not just connector mode)?',
      'Protect my energy (not overextend to prove myself)?',
    ];

    console.log(DIM('  Rate EFFORT today (1-10), not results.'));
    console.log(DIM('  "Did I do my best to..."\n'));

    const scores: number[] = [];

    for (let i = 0; i < questions.length; i++) {
      const label = i < 6 ? `  ${i + 1}.` : ORACLE_GOLD(`  ${i + 1}.`);
      const answer = await this.promptSync(`${label} ${questions[i]} `);
      const score = parseInt(answer) || 0;
      scores.push(Math.min(10, Math.max(0, score)));
    }

    console.log('');
    const notes = await this.promptSync(DIM('  Brief note (optional): '));

    // Save to vault
    this.vault.appendDailyScore(scores, notes);
    console.log(chalk.green('\n  ✓ Logged to Oracle/Daily Scores/'));

    // Quick pattern analysis
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const lowIndices = scores.reduce<number[]>((acc, s, i) => s < 5 ? [...acc, i] : acc, []);

    if (lowIndices.length > 0) {
      const lowItems = lowIndices.map(i => questions[i]);
      console.log(ORACLE_GOLD(`\n  ▸ Below 5: ${lowItems.join(', ')}`));
    }
    console.log(DIM(`  Average effort: ${avg.toFixed(1)}/10\n`));

    this.rl.close();
  }

  private promptSync(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }
}

// ── Tool Awareness Prompt Addition ────────────────────────────────

const TOOL_AWARENESS_PROMPT = `## Your Tools

You have access to tools during the session. Use them naturally — don't announce tool usage, just use them when they'd add value.

**vault_read / vault_write / vault_list** — Read and write directly to the Obsidian coaching vault. Check the immunity map mid-session. Update patterns when you see them. Save session notes at the end. This is your persistent memory.

**memory_store / memory_search** — Store and retrieve cross-session observations. When you notice a pattern, store it. When you're about to challenge, search for supporting evidence. Build the pattern intelligence that makes you worth $20K/month.

**web_search** — Search the web when you need current information, want to verify a framework, or the coachee references something you want to understand deeply.

**run_command** — Execute shell commands when relevant. Check git status on a project, read a file, get context.

**add_commitment** — Record coaching commitments with due dates and stakeholders.

### Tool Use Guidelines

- **Use vault_read** to check specific details before making assumptions about past sessions, commitments, or patterns
- **Use memory_store** whenever you notice something worth tracking — patterns, avoidances, shifts, insights
- **Use web_search** when a coaching topic would benefit from current research or context
- **Use vault_write** to update Patterns.md when you see cross-session patterns evolving
- **At session end**, use vault_write for session notes, add_commitment for any commitments, and memory_store for observations
- Don't over-use tools — they should enhance the coaching, not interrupt the flow
`;
