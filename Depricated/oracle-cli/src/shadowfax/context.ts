import * as fs from 'fs';
import * as path from 'path';
import { OracleConfig } from '../utils/config';

/**
 * Shadowfax context integration.
 * Reads health, energy, and life-os data to inject into coaching sessions.
 * 
 * Shadowfax data sources (from SAM system and personal skills):
 * - Energy zone (current energy level)
 * - Health baselines (HRV, ferritin, sleep metrics)
 * - Recent patterns from health-copilot
 * - Evening architect state
 * - Life-OS season awareness
 */

export interface ShadowfaxContext {
  energyZone: 'green' | 'yellow' | 'red' | 'unknown';
  healthSummary: string;
  recentBriefing: string;
  lifeContext: string;
  timeContext: string;
}

export class ShadowfaxConnector {
  private samPath: string;
  private config: OracleConfig;

  constructor(config: OracleConfig) {
    this.config = config;
    this.samPath = config.shadowfaxPath;
  }

  /**
   * Gather current context from Shadowfax system
   */
  gather(): ShadowfaxContext {
    return {
      energyZone: this.detectEnergyZone(),
      healthSummary: this.getHealthSummary(),
      recentBriefing: this.getRecentBriefing(),
      lifeContext: this.getLifeContext(),
      timeContext: this.getTimeContext(),
    };
  }

  /**
   * Format Shadowfax context as a string for the AI prompt
   */
  formatForPrompt(): string {
    const ctx = this.gather();
    const sections: string[] = [];

    sections.push(`## Current State`);
    sections.push(`**Time:** ${ctx.timeContext}`);
    sections.push(`**Energy Zone:** ${ctx.energyZone.toUpperCase()}`);

    if (ctx.healthSummary) {
      sections.push(`\n### Health Context\n${ctx.healthSummary}`);
    }

    if (ctx.recentBriefing) {
      sections.push(`\n### Recent Work Briefing\n${ctx.recentBriefing}`);
    }

    if (ctx.lifeContext) {
      sections.push(`\n### Life Context\n${ctx.lifeContext}`);
    }

    return sections.join('\n');
  }

  private detectEnergyZone(): 'green' | 'yellow' | 'red' | 'unknown' {
    const hour = new Date().getHours();

    // Time-based energy estimation from Kris's patterns
    if (hour >= 9 && hour < 13) return 'green';     // Peak 1
    if (hour >= 13 && hour < 15.5) return 'yellow';  // Crash
    if (hour >= 15.5 && hour < 17.5) return 'green'; // Peak 2
    if (hour >= 17.5 && hour < 19.5) return 'red';   // Danger zone (family)
    if (hour >= 20 && hour < 22) return 'yellow';     // Peak 3 (evening creative)
    if (hour >= 22) return 'red';                      // Should be winding down

    return 'unknown';
  }

  private getHealthSummary(): string {
    // Read health baselines from SAM oracle data
    const patternsPath = path.join(this.samPath, 'oracle', 'patterns.md');
    if (fs.existsSync(patternsPath)) {
      const content = fs.readFileSync(patternsPath, 'utf-8');
      const healthSection = this.extractSection(content, 'Health Baselines');
      const energySection = this.extractSection(content, 'Energy Rules');
      return [healthSection, energySection].filter(Boolean).join('\n');
    }

    return 'HRV baseline: ~28-31ms | Ferritin: 22 ng/mL (target 50+) | Sleep target: 7+ hrs';
  }

  private getRecentBriefing(): string {
    const briefingsDir = path.join(this.samPath, 'briefings');
    if (!fs.existsSync(briefingsDir)) return '';

    // Find most recent briefing
    try {
      const years = fs.readdirSync(briefingsDir).filter(d => /^\d{4}$/.test(d)).sort().reverse();
      for (const year of years) {
        const months = fs.readdirSync(path.join(briefingsDir, year))
          .filter(d => /^\d{2}$/.test(d)).sort().reverse();
        for (const month of months) {
          const files = fs.readdirSync(path.join(briefingsDir, year, month))
            .filter(f => f.endsWith('.md')).sort().reverse();
          if (files.length > 0) {
            const content = fs.readFileSync(
              path.join(briefingsDir, year, month, files[0]),
              'utf-8'
            );
            // Truncate to first 500 chars for context
            return content.slice(0, 500) + (content.length > 500 ? '\n...' : '');
          }
        }
      }
    } catch {
      return '';
    }

    return '';
  }

  private getLifeContext(): string {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const contexts: string[] = [];

    // Day of week context
    if (day === 0) contexts.push('Sunday — weekly review day');
    if (day === 1) contexts.push('Monday — planning day, manager 1:1');
    if (day === 5) contexts.push('Friday — weekly review, clear inbox');
    if (day === 6) contexts.push('Saturday — family time, recovery');

    // Time of day context
    if (hour >= 20 && hour < 22) {
      contexts.push('Evening creative window (8-10pm). Kids in bed. Guard this time.');
    }
    if (hour >= 22) {
      contexts.push('⚠️ After 10pm. Sleep is the highest-leverage health intervention. Consider winding down.');
    }
    if (hour >= 17.5 && hour < 19.5) {
      contexts.push('Family transition window. Not ideal for deep coaching work.');
    }

    return contexts.join('\n');
  }

  private getTimeContext(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    };
    return now.toLocaleDateString('en-US', options);
  }

  private extractSection(content: string, heading: string): string {
    const regex = new RegExp(`### ${heading}\\n([\\s\\S]*?)(?=\\n###|$)`);
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }
}
