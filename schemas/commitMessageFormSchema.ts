import { z } from "zod";

export const commitMessageFormSchema = z.object({
  diff: z.string().trim().min(1, "Git diff is required"),
  enableCustomization: z.boolean(),
  style: z.enum(["short", "long"]),
  format: z.enum(["plain", "bullets", "numbered"]),
  conventional: z.boolean(),
  maxTitleChars: z.number().int().min(30).max(120),
});
