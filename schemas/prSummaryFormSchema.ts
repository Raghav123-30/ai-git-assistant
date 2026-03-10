import { z } from "zod";

export const prSummaryFormSchema = z.object({
  diff: z.string().min(1, "Git diff is required"),
  enableCustomization: z.boolean(),
  complexity: z.enum(["low", "medium", "high"]),
  detailLevel: z.enum(["concise", "expanded"]),
  includeBreakingChanges: z.boolean(),
  includeTestPlan: z.boolean(),
  ticketReference: z.string(),
  type: z.enum(["feat", "fix", "chore", "refactor", "docs", "perf"]),
  format: z.enum(["markdown", "slack", "plain"]),
  showCheckList: z.boolean(),
  maxTitleChars: z.number().int().min(50).max(120),
});
