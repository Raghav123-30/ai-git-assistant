import { model } from "./model";
import { generateText } from "ai";

export type PullRequestOptions = {
  complexity?: "low" | "medium" | "high";
  detailLevel?: "concise" | "expanded";
  includeBreakingChanges?: boolean;
  includeTestPlan?: boolean;
  ticketReference?: string;
  type?: "feat" | "fix" | "chore" | "refactor" | "docs" | "perf";
  format?: "markdown" | "slack" | "plain";
  showCheckList?: boolean;
};

const generatePRSummary = async (
  diff: string,
  options: PullRequestOptions = {},
) => {
  const instruction = [
    "You are an assistant that generates pull request summaries from git diffs.Verify if the prompt is valid git diff. If not, respond with 'Invalid git diff'.",
    `Assess the PR's complexity as ${options.complexity}.`,
    options.detailLevel === "expanded"
      ? "Provide a detailed, line-by-line breakdown of changes."
      : "Summarize the overall intent and key changes.",
    options.includeBreakingChanges
      ? "Highlight any breaking changes introduced."
      : "No need to call out breaking changes.",
    options.includeTestPlan
      ? "Include a 'Test Plan' section with verification steps."
      : "Omit test plan details.",
    options.ticketReference
      ? `Reference related ticket: ${options.ticketReference}.`
      : "No ticket reference provided.",
    `Categorize this PR as a ${options.type} type.`,
    `Format the output in ${options.format || "markdown"}.`,
    options.showCheckList
      ? "Include a standard 'Definition of Done' checklist at the end."
      : "Do not include a checklist.",
  ].join(" ");

  const { text } = await generateText({
    model,
    prompt: diff,
    system: instruction,
  });

  return text;
};

export default generatePRSummary;
