import { showHUD } from "@raycast/api";

function getCurrentPeak(): { name: string; guidance: string } {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour + minute / 60;

  if (time >= 9 && time < 13) {
    return {
      name: "Peak 1",
      guidance: "Deep work, hard conversations, critiques",
    };
  } else if (time >= 15.5 && time < 17.5) {
    return {
      name: "Peak 2",
      guidance: "1:1s, team syncs, stakeholder meetings",
    };
  } else if (time >= 17.5 && time < 19.5) {
    return {
      name: "Danger Zone",
      guidance: "Avoid emotionally demanding work",
    };
  } else if (time >= 20 && time < 22) {
    return {
      name: "Evening Peak",
      guidance: "Light creative work if energy permits",
    };
  } else {
    return {
      name: "Off-peak",
      guidance: "Admin, email, planning",
    };
  }
}

export default async function Now() {
  const peak = getCurrentPeak();
  await showHUD(`${peak.name}: ${peak.guidance}`);
}
