#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { OracleEngine, SessionType } from './core/engine';
import { loadConfig, saveConfig, configExists, OracleConfig } from './utils/config';
import { ObsidianVault } from './obsidian/vault';
import { banner, sessionHeader, dim, error, success, info, divider } from './utils/display';
import * as path from 'path';

const ORACLE_GOLD = chalk.hex('#C4A34A');

const program = new Command();

program
  .name('oracle')
  .description('Elite AI executive coaching system')
  .version('3.0.0');

// ── Init ──────────────────────────────────────────────────────────

program
  .command('init')
  .description('Configure Oracle for first use')
  .action(async () => {
    banner();
    dim('Setting up Oracle. You\'ll need:');
    dim('  1. Path to your Obsidian vault');
    dim('  2. Path to your SAM/Shadowfax data');
    dim('  3. Anthropic API key');
    console.log('');

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'obsidianVaultPath',
        message: 'Obsidian vault path:',
        default: path.join(process.env.HOME || '~', 'Documents', 'Obsidian'),
        validate: (input: string) => {
          const resolved = input.replace('~', process.env.HOME || '');
          return true; // We'll create the Oracle folder if it doesn't exist
        },
      },
      {
        type: 'input',
        name: 'oracleFolder',
        message: 'Oracle folder within vault:',
        default: 'Oracle',
      },
      {
        type: 'input',
        name: 'shadowfaxPath',
        message: 'SAM/Shadowfax data path:',
        default: path.join(process.env.HOME || '~', 'sam'),
      },
      {
        type: 'input',
        name: 'anthropicApiKey',
        message: 'Anthropic API key:',
        validate: (input: string) => input.startsWith('sk-') ? true : 'Must start with sk-',
      },
      {
        type: 'input',
        name: 'tavilyApiKey',
        message: 'Tavily API key (optional — enables web search):',
        default: '',
      },
      {
        type: 'list',
        name: 'model',
        message: 'Claude model:',
        choices: [
          { name: 'Claude Sonnet 4 (recommended)', value: 'claude-sonnet-4-20250514' },
          { name: 'Claude Opus 4', value: 'claude-opus-4-20250514' },
          { name: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022' },
        ],
        default: 'claude-sonnet-4-20250514',
      },
    ]);

    // Resolve ~ in paths
    answers.obsidianVaultPath = answers.obsidianVaultPath.replace('~', process.env.HOME || '');
    answers.shadowfaxPath = answers.shadowfaxPath.replace('~', process.env.HOME || '');

    saveConfig(answers);

    // Initialize vault structure
    const vault = new ObsidianVault(answers as OracleConfig);
    vault.ensureStructure();

    success('Oracle configured');
    success(`Vault: ${answers.obsidianVaultPath}/${answers.oracleFolder}/`);
    info('Run `oracle session` to start coaching');
    console.log('');
  });

// ── Session Chooser ───────────────────────────────────────────────

program
  .command('session')
  .alias('s')
  .description('Interactive session chooser')
  .action(async () => {
    const config = ensureConfig();
    banner();

    const { sessionType } = await inquirer.prompt([{
      type: 'list',
      name: 'sessionType',
      message: 'What kind of session?',
      choices: [
        { name: `${ORACLE_GOLD('Tactical')}      Weekly check-in (20 min)`, value: 'tactical' },
        { name: `${ORACLE_GOLD('Immunity')}      Deep change work (45-60 min)`, value: 'immunity' },
        { name: `${ORACLE_GOLD('Decision')}      Decision coaching (30 min)`, value: 'decision' },
        { name: `${ORACLE_GOLD('Feedback')}      Process feedback (45 min)`, value: 'feedback' },
        { name: `${ORACLE_GOLD('Retro')}         Retrospective (30 min)`, value: 'retro' },
        { name: `${ORACLE_GOLD('Stakeholders')}  Relationship audit (30 min)`, value: 'stakeholders' },
        { name: `${ORACLE_GOLD('Open')}          Whatever needs attention`, value: 'open' },
        new inquirer.Separator(),
        { name: `${chalk.dim('Intake')}         Full baseline (45-60 min)`, value: 'intake' },
        { name: `${chalk.dim('Derailers')}      20 Derailers assessment`, value: 'derailers' },
        { name: `${chalk.dim('360')}            Self-administered 360`, value: '360' },
      ],
    }]);

    let topic: string | undefined;
    if (sessionType === 'decision') {
      const answer = await inquirer.prompt([{ type: 'input', name: 'topic', message: 'What decision?' }]);
      topic = answer.topic;
    }
    if (sessionType === 'retro') {
      const answer = await inquirer.prompt([{ type: 'input', name: 'topic', message: 'What period?' }]);
      topic = answer.topic;
    }
    if (sessionType === '360') {
      const answer = await inquirer.prompt([{ type: 'input', name: 'topic', message: 'What development area?' }]);
      topic = answer.topic;
    }

    const engine = new OracleEngine(config);
    sessionHeader(sessionType.toUpperCase(), getSessionDuration(sessionType));
    await engine.startSession(sessionType as SessionType, topic);
  });

// ── Direct Session Commands ───────────────────────────────────────

const sessionCommands: Array<{ name: string; aliases: string[]; desc: string; type: SessionType; duration: string; hasTopic?: boolean; topicPrompt?: string }> = [
  { name: 'tactical', aliases: ['t', 'weekly'], desc: 'Weekly tactical session', type: 'tactical', duration: '20 min' },
  { name: 'immunity', aliases: ['i', 'deep'], desc: 'Immunity to Change deep work', type: 'immunity', duration: '45-60 min' },
  { name: 'decision', aliases: ['d'], desc: 'Decision coaching', type: 'decision', duration: '30 min', hasTopic: true, topicPrompt: 'Decision: ' },
  { name: 'feedback', aliases: ['f'], desc: 'Process feedback', type: 'feedback', duration: '45 min' },
  { name: 'retro', aliases: ['r'], desc: 'Retrospective', type: 'retro', duration: '30 min', hasTopic: true, topicPrompt: 'Period: ' },
  { name: 'stakeholders', aliases: ['stake'], desc: 'Stakeholder audit', type: 'stakeholders', duration: '30 min' },
  { name: 'intake', aliases: ['baseline'], desc: 'Full intake assessment', type: 'intake', duration: '45-60 min' },
  { name: 'open', aliases: ['o'], desc: 'Open session', type: 'open', duration: 'flexible' },
  { name: 'derailers', aliases: [], desc: '20 Derailers assessment', type: 'derailers', duration: '30 min' },
];

for (const cmd of sessionCommands) {
  const c = program
    .command(cmd.name)
    .description(cmd.desc);

  for (const alias of cmd.aliases) {
    c.alias(alias);
  }

  if (cmd.hasTopic) {
    c.argument('[topic]', cmd.topicPrompt);
  }

  c.action(async (topic?: string) => {
    const config = ensureConfig();
    banner();
    sessionHeader(cmd.name.toUpperCase(), cmd.duration);
    const engine = new OracleEngine(config);
    await engine.startSession(cmd.type, topic);
  });
}

// ── 360 (special because of numeric name) ─────────────────────────

program
  .command('360')
  .argument('[area]', 'Development area to assess')
  .description('Self-administered 360')
  .action(async (area?: string) => {
    const config = ensureConfig();
    banner();
    sessionHeader('SELF-ADMINISTERED 360', '30 min');
    const engine = new OracleEngine(config);
    await engine.startSession('360', area);
  });

// ── Daily Questions ───────────────────────────────────────────────

program
  .command('daily')
  .description('Daily Active Questions (3 min)')
  .action(async () => {
    const config = ensureConfig();
    banner();
    sessionHeader('DAILY ACTIVE QUESTIONS', '3 min');
    const engine = new OracleEngine(config);
    await engine.runDailyQuestions();
  });

// ── Accountability ────────────────────────────────────────────────

program
  .command('accountability')
  .alias('acc')
  .alias('a')
  .description('Commitment accountability check')
  .action(async () => {
    const config = ensureConfig();
    banner();
    sessionHeader('ACCOUNTABILITY CHECK');
    const engine = new OracleEngine(config);
    await engine.startSession('accountability');
  });

// ── Patterns ──────────────────────────────────────────────────────

program
  .command('patterns')
  .description('Cross-session pattern analysis')
  .action(async () => {
    const config = ensureConfig();
    banner();
    sessionHeader('PATTERN ANALYSIS');
    const engine = new OracleEngine(config);
    await engine.startSession('patterns');
  });

// ── Status ────────────────────────────────────────────────────────

program
  .command('status')
  .description('Show Oracle status and recent activity')
  .action(async () => {
    const config = ensureConfig();
    banner();

    const vault = new ObsidianVault(config);
    const commitments = vault.readCommitments();
    const recentSessions = vault.readRecentSessions(5);
    const dailyScores = vault.readDailyScores(7);

    info(`Vault: ${config.obsidianVaultPath}/${config.oracleFolder}/`);
    info(`Model: ${config.model}`);
    console.log('');

    if (commitments) {
      console.log(ORACLE_GOLD('  Active Commitments'));
      console.log(chalk.white(`  ${commitments.split('\n').slice(0, 15).join('\n  ')}`));
      console.log('');
    }

    if (dailyScores) {
      console.log(ORACLE_GOLD('  Recent Daily Scores'));
      console.log(chalk.dim(`  ${dailyScores.split('\n').slice(0, 8).join('\n  ')}`));
      console.log('');
    }

    if (recentSessions) {
      const sessionLines = recentSessions.split('\n').filter(l => l.startsWith('## '));
      if (sessionLines.length > 0) {
        console.log(ORACLE_GOLD('  Recent Sessions'));
        sessionLines.forEach(l => console.log(chalk.dim(`  ${l.replace('## ', '')}`)));
        console.log('');
      }
    }
  });

// ── Migrate ───────────────────────────────────────────────────────

program
  .command('migrate')
  .description('Migrate data from SAM/oracle to Obsidian vault')
  .action(async () => {
    const config = ensureConfig();
    banner();
    sessionHeader('MIGRATE');

    const vault = new ObsidianVault(config);
    vault.ensureStructure();

    const samOracle = path.join(config.shadowfaxPath, 'oracle');
    const fs = require('fs');

    const migrations: Array<[string, string]> = [
      ['baseline.md', 'Baseline.md'],
      ['patterns.md', 'Patterns.md'],
      ['development-focus.md', 'Development Focus.md'],
      ['guardrails.md', 'Guardrails.md'],
      ['active-questions.md', 'Active Questions.md'],
      ['commitments/_log.md', 'Commitments.md'],
    ];

    for (const [from, to] of migrations) {
      const sourcePath = path.join(samOracle, from);
      if (fs.existsSync(sourcePath)) {
        const content = fs.readFileSync(sourcePath, 'utf-8');
        vault.writeFile(to, content);
        success(`Migrated ${from} → ${to}`);
      } else {
        dim(`Skipped ${from} (not found)`);
      }
    }

    // Migrate stakeholders
    const stakeholdersDir = path.join(samOracle, 'stakeholders');
    if (fs.existsSync(stakeholdersDir)) {
      const files = fs.readdirSync(stakeholdersDir).filter((f: string) => f.endsWith('.md'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(stakeholdersDir, file), 'utf-8');
        vault.writeFile(path.join('Stakeholders', file), content);
        success(`Migrated stakeholders/${file}`);
      }
    }

    console.log('');
    success('Migration complete');
    info('Review files in your Obsidian vault Oracle folder');
    console.log('');
  });

// ── Helpers ───────────────────────────────────────────────────────

function ensureConfig(): OracleConfig {
  if (!configExists()) {
    error('Oracle not configured. Run: oracle init');
    process.exit(1);
  }
  return loadConfig();
}

function getSessionDuration(type: string): string {
  const durations: Record<string, string> = {
    tactical: '20 min',
    immunity: '45-60 min',
    decision: '30 min',
    feedback: '45 min',
    retro: '30 min',
    stakeholders: '30 min',
    intake: '45-60 min',
    open: 'flexible',
    derailers: '30 min',
    '360': '30 min',
  };
  return durations[type] || '';
}

// ── Default (no args) ─────────────────────────────────────────────

if (process.argv.length <= 2) {
  banner();
  console.log(chalk.dim('  "All we have to decide is what to do with the time that is given us."'));
  console.log('');
  console.log(ORACLE_GOLD('  Sessions'));
  console.log('    oracle session          Interactive session chooser');
  console.log('    oracle tactical          Weekly check-in (20 min)');
  console.log('    oracle immunity          Deep change work (45-60 min)');
  console.log('    oracle decision [topic]  Decision coaching (30 min)');
  console.log('    oracle feedback          Process feedback (45 min)');
  console.log('    oracle retro [period]    Retrospective (30 min)');
  console.log('    oracle stakeholders      Relationship audit (30 min)');
  console.log('    oracle open              Whatever needs attention');
  console.log('');
  console.log(ORACLE_GOLD('  Daily'));
  console.log('    oracle daily             Active Questions (3 min)');
  console.log('    oracle accountability    Commitment check');
  console.log('');
  console.log(ORACLE_GOLD('  Analysis'));
  console.log('    oracle patterns          Cross-session patterns');
  console.log('    oracle derailers         20 Derailers assessment');
  console.log('    oracle 360 [area]        Self-administered 360');
  console.log('    oracle status            Show recent activity');
  console.log('');
  console.log(ORACLE_GOLD('  Tools'));  
  console.log('    web_search               Tavily-powered web search (needs API key)');  
  console.log('    vault_read/write          Live Obsidian read/write mid-session');  
  console.log('    memory_store/search       Persistent cross-session pattern memory');  
  console.log('    run_command               Shell execution for context');  
  console.log('    add_commitment            Structured commitment tracking');  
  console.log('');
  console.log(ORACLE_GOLD('  Setup'));
  console.log('    oracle init              First-time configuration');
  console.log('    oracle migrate           Import SAM/oracle data');
  console.log('');
  process.exit(0);
}

program.parse();
