import { Action, ActionPanel, Form, showToast, Toast, popToRoot } from "@raycast/api";
import { useState } from "react";
import * as fs from "fs";
import * as path from "path";

const TOKEN_PATH = path.join(process.env.HOME || "", ".watchtower", "todoist-token");
const DEFAULT_PROJECT = "2365282199"; // Watchtower project

export default function Remind() {
  const [task, setTask] = useState("");
  const [dueString, setDueString] = useState("today");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!task.trim()) {
      await showToast({ style: Toast.Style.Failure, title: "Empty task", message: "Write something first" });
      return;
    }

    setIsLoading(true);

    try {
      // Read token
      if (!fs.existsSync(TOKEN_PATH)) {
        throw new Error("Todoist token not found at ~/.watchtower/todoist-token");
      }
      const token = fs.readFileSync(TOKEN_PATH, "utf-8").trim();

      // Create task
      const response = await fetch("https://api.todoist.com/rest/v2/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: task.trim(),
          due_string: dueString || "today",
          project_id: DEFAULT_PROJECT,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Todoist API error: ${error}`);
      }

      await showToast({
        style: Toast.Style.Success,
        title: "Reminder Created",
        message: `"${task.trim()}" due ${dueString}`,
      });
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
          <Action.SubmitForm title="Create Reminder" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="task"
        title="Reminder"
        placeholder="What do you need to remember?"
        value={task}
        onChange={setTask}
      />
      <Form.TextField
        id="due"
        title="When"
        placeholder="today, tomorrow, Friday, next week..."
        value={dueString}
        onChange={setDueString}
      />
      <Form.Description text="Creates a task in the Watchtower project in Todoist." />
    </Form>
  );
}
