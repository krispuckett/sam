import { Action, ActionPanel, Color, Icon, List, LocalStorage, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";

type EnergyZone = "green" | "yellow" | "red";

interface EnergyState {
  zone: EnergyZone;
  setAt: string;
}

const ENERGY_KEY = "watchtower-energy-zone";

const energyConfig = {
  green: {
    title: "Green",
    subtitle: "Full capacity",
    description: "Load up with important work. Hard conversations. Deep critique. Relationship building.",
    icon: Icon.CircleFilled,
    color: Color.Green,
  },
  yellow: {
    title: "Yellow",
    subtitle: "Moderate capacity",
    description: "Protect ONE Thing fiercely. Keep conversations shorter. Okay to be quieter.",
    icon: Icon.CircleFilled,
    color: Color.Yellow,
  },
  red: {
    title: "Red",
    subtitle: "Low capacity",
    description: "Required meetings only. No feedback delivery. No hard conversations. Triage mode.",
    icon: Icon.CircleFilled,
    color: Color.Red,
  },
};

export default function SetEnergy() {
  const [currentEnergy, setCurrentEnergy] = useState<EnergyState | null>(null);

  useEffect(() => {
    async function loadEnergy() {
      const stored = await LocalStorage.getItem<string>(ENERGY_KEY);
      if (stored) {
        setCurrentEnergy(JSON.parse(stored));
      }
    }
    loadEnergy();
  }, []);

  async function setEnergyZone(zone: EnergyZone) {
    const state: EnergyState = {
      zone,
      setAt: new Date().toISOString(),
    };
    await LocalStorage.setItem(ENERGY_KEY, JSON.stringify(state));
    setCurrentEnergy(state);
    await showToast({
      style: Toast.Style.Success,
      title: `Energy Zone: ${energyConfig[zone].title}`,
      message: energyConfig[zone].subtitle,
    });
  }

  const currentZone = currentEnergy?.zone;
  const setTime = currentEnergy?.setAt
    ? new Date(currentEnergy.setAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <List>
      <List.Section title={currentZone ? `Current: ${energyConfig[currentZone].title} (set at ${setTime})` : "Set Energy Zone"}>
        {(["green", "yellow", "red"] as EnergyZone[]).map((zone) => {
          const config = energyConfig[zone];
          const isCurrent = currentZone === zone;
          return (
            <List.Item
              key={zone}
              title={config.title}
              subtitle={config.subtitle}
              accessories={isCurrent ? [{ icon: Icon.Checkmark, text: "Current" }] : []}
              icon={{ source: config.icon, tintColor: config.color }}
              actions={
                <ActionPanel>
                  <Action
                    title={`Set to ${config.title}`}
                    icon={{ source: config.icon, tintColor: config.color }}
                    onAction={() => setEnergyZone(zone)}
                  />
                </ActionPanel>
              }
            />
          );
        })}
      </List.Section>
      <List.Section title="Guidance">
        {currentZone && (
          <List.Item
            title={energyConfig[currentZone].description}
            icon={Icon.Info}
          />
        )}
      </List.Section>
    </List>
  );
}
