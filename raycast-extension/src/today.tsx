import { Detail, LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";
import * as fs from "fs";
import * as path from "path";

const ENERGY_KEY = "watchtower-energy-zone";

interface EnergyState {
  zone: "green" | "yellow" | "red";
  setAt: string;
}

function getCurrentPeak(): string {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour + minute / 60;

  if (time >= 9 && time < 13) {
    return "Peak 1 (9am-1pm) — Deep work, hard conversations, critiques";
  } else if (time >= 15.5 && time < 17.5) {
    return "Peak 2 (3:30-5:30pm) — 1:1s, team syncs, stakeholder meetings";
  } else if (time >= 17.5 && time < 19.5) {
    return "Danger Zone (5:30-7:30pm) — Avoid emotionally demanding work";
  } else if (time >= 20 && time < 22) {
    return "Evening Peak (8-10pm) — Light creative work if energy permits";
  } else {
    return "Off-peak — Administrative tasks, email, planning";
  }
}

function getTodayBriefingPath(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return path.join(process.env.HOME || "", "watchtower", "briefings", String(year), month, `${year}-${month}-${day}.md`);
}

export default function Today() {
  const [energy, setEnergy] = useState<EnergyState | null>(null);
  const [briefingExcerpt, setBriefingExcerpt] = useState<string>("");

  useEffect(() => {
    async function load() {
      // Load energy state
      const stored = await LocalStorage.getItem<string>(ENERGY_KEY);
      if (stored) {
        setEnergy(JSON.parse(stored));
      }

      // Try to read today's briefing
      const briefingPath = getTodayBriefingPath();
      if (fs.existsSync(briefingPath)) {
        const content = fs.readFileSync(briefingPath, "utf-8");
        // Extract first few sections
        const lines = content.split("\n").slice(0, 50);
        setBriefingExcerpt(lines.join("\n"));
      }
    }
    load();
  }, []);

  const peak = getCurrentPeak();
  const energyLabel = energy ? `${energy.zone.charAt(0).toUpperCase() + energy.zone.slice(1)}` : "Not set";
  const energyEmoji = energy?.zone === "green" ? "🟢" : energy?.zone === "yellow" ? "🟡" : energy?.zone === "red" ? "🔴" : "⚪";

  const markdown = `
# Today's Intelligence

## Current State
- **Energy Zone**: ${energyEmoji} ${energyLabel}
- **Peak Window**: ${peak}
- **Time**: ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}

---

${briefingExcerpt ? `## From Today's Briefing\n\n${briefingExcerpt}` : "*No briefing found for today*"}
`;

  return <Detail markdown={markdown} />;
}
