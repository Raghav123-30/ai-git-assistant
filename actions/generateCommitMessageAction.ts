"use server";

import { z } from "zod";
import generateCommitMessage, {
  type CommitMessageOptions,
} from "../ai/generateCommitMessage";
import { commitMessageFormSchema } from "@/schemas/commitMessageFormSchema";

export type CommitMessageState = {
  error: boolean;
  text?: string;
};

const generateCommitMessageAction = async (
  _state: CommitMessageState,
  formData: z.infer<typeof commitMessageFormSchema>,
): Promise<CommitMessageState> => {
  const {
    diff,
    enableCustomization,
    style,
    format,
    conventional,
    maxTitleChars,
  } = formData;
  const options: CommitMessageOptions = enableCustomization
    ? {
        style,
        format,
        conventional,
        maxTitleChars,
      }
    : {};

  try {
    const text = await generateCommitMessage(diff, options);
    return { error: false, text };
  } catch {
    return { error: true, text: "Failed to generate commit message" };
  }
};

export default generateCommitMessageAction;
