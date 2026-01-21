import { Action, ActionPanel, Form, showToast, Toast, popToRoot } from "@raycast/api";
import { useState } from "react";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

const INBOX_PATH = path.join(process.env.HOME || "", "watchtower", "inbox", "dumps");

export default function BrainDump() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!content.trim()) {
      await showToast({ style: Toast.Style.Failure, title: "Empty dump", message: "Write something first" });
      return;
    }

    setIsLoading(true);

    try {
      // Ensure directory exists
      if (!fs.existsSync(INBOX_PATH)) {
        fs.mkdirSync(INBOX_PATH, { recursive: true });
      }

      // Create timestamped filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `dump-${timestamp}.md`;
      const filepath = path.join(INBOX_PATH, filename);

      // Write the dump
      const header = `# Brain Dump\n**Captured**: ${new Date().toLocaleString()}\n\n---\n\n`;
      fs.writeFileSync(filepath, header + content.trim());

      // Git commit if in watchtower repo
      try {
        await execAsync(`cd ~/watchtower && git add . && git commit -m "Add brain dump ${timestamp}" && git push`, {
          timeout: 30000,
        });
      } catch {
        // Git operations are optional - file is saved locally regardless
      }

      await showToast({ style: Toast.Style.Success, title: "Captured", message: "Dump saved to inbox" });
      popToRoot();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Capture" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="content"
        title="Brain Dump"
        placeholder="Get it out of your head..."
        value={content}
        onChange={setContent}
        enableMarkdown
      />
      <Form.Description text="This will be saved to ~/watchtower/inbox/dumps/ for later processing." />
    </Form>
  );
}
