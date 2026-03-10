import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4o-mini");

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  const { text } = await generateText({
    model,
    prompt,
    system: "Answer only git related questions and deny all other questions.",
  });
  return NextResponse.json({ text });
}
