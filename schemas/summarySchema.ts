import { z } from "zod";

export const summarySchema = z.object({
  title: z.string(),
  breakingChanges: z.string().nullable(),
  summaryPoints: z.array(z.string()),
});
