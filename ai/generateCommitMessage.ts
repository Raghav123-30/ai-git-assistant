import { model } from "./model";
import { generateText } from "ai";

export type CommitMessageOptions = {
  style?: "short" | "long";
  format?: "plain" | "bullets" | "numbered";
  conventional?: boolean;
  maxTitleChars?: number;
};

const generateCommitMessage = async (
  diff: string,
  options: CommitMessageOptions = {},
) => {
  const {
    style = "short",
    format = "plain",
    conventional = true,
    maxTitleChars = 72,
  } = options;
  const instruction = [
    "Verify if the prompt is valid git diff. If not, respond with 'Invalid git diff'.",
    "You generate Git commit messages from git diff.",
    conventional
      ? "Use Conventional Commits format: type(scope): subject."
      : "Use a clear commit title and optional body.",
    `Style: ${style}.`,
    `Output format: ${format}.`,
    `Keep title <= ${maxTitleChars} characters.`,
    "Return only the commit message text.",
  ].join(" ");

  const { text } = await generateText({
    model,
    prompt: diff,
    system: instruction,
  });

  return text;
};

export default generateCommitMessage;
