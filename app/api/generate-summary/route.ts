import { NextRequest } from "next/server";
import { model } from "@/ai/model";
import { streamObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const commitSummarySchema = z.object({
  title: z.string().describe("Short title for the changes"),
  breakingChanges: z
    .string()
    .nullable()
    .describe("Set to null if there are no breaking changes"),
  summaryPoints: z
    .array(z.string())
    .describe("Up to 10 summary points and at least 3 points"),
});

export async function POST(request: NextRequest) {
  const { diff } = await request.json();

  const result = streamObject({
    model,
    prompt: diff,
    system:
      "You are a helpful AI assistant that generates concise summaries of git diffs and pr diffs. Always include breakingChanges and set it to null when there are none.",
    schema: commitSummarySchema,
  });

  return result.toTextStreamResponse();
}
