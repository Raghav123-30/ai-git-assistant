"use server";

import { generateText } from "ai";
import { model } from "./model";

const answerQuestion = async (
  state: AiResponse,
  formData: FormData,
): Promise<AiResponse> => {
  const question = formData.get("question") as string;
  try {
    const { text } = await generateText({
      model,
      prompt: question,
      system: "Answer only git related questions and deny all other questions.",
    });
    return { error: false, text };
  } catch (error) {
    return { error: true };
  }
};

export default answerQuestion;
