"use server";

import generatePRSummary, { PullRequestOptions } from "@/ai/generatePrSummary";
import { prSummaryFormSchema } from "@/schemas/prSummaryFormSchema";
import { z } from "zod";

export type PRSummaryState = {
  error: boolean;
  text?: string;
};

const generatePRSummaryAction = async (
  _state: PRSummaryState,
  formData: z.infer<typeof prSummaryFormSchema>,
): Promise<PRSummaryState> => {
  const {
    diff,
    complexity,
    detailLevel,
    format,
    includeBreakingChanges,
    includeTestPlan,
    showCheckList,
    ticketReference,
    type,
  } = formData;
  const options: PullRequestOptions = formData.enableCustomization
    ? {
        complexity,
        detailLevel,
        format,
        includeBreakingChanges,
        includeTestPlan,
        showCheckList,
        ticketReference,
        type,
      }
    : {};

  try {
    const text = await generatePRSummary(diff, options);
    return { error: false, text };
  } catch {
    return { error: true };
  }
};

export default generatePRSummaryAction;
