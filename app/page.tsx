"use client";

import answerQuestion from "@/ai/answerQuestion";
import { useActionState } from "react";

const Home = () => {
  const [state, action, pending] = useActionState(answerQuestion, {
    error: false,
    text: "",
  });
  return (
    <div className="min-h-screen flex flex-col  justify-center items-center">
      <div className="max-w-6xl mx-auto w-full ">
        <h1 className="text-3xl bg-clip-text bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent mb-8">
          AI GIT ASSISTANT
        </h1>
        <form className="flex flex-col gap-2" action={action}>
          <textarea
            name="question"
            placeholder="Ask a git related question..."
            className="px-8 py-3 rounded-md border border-blue-100 ring ring-blue-100"
          ></textarea>
          <button
            disabled={pending}
            type="submit"
            className={`px-6 py-3 rounded-md text-white  w-fit ${pending ? "bg-blue-200 cursor-not-allowed" : "bg-blue-500"}`}
          >
            {pending ? "Answering..." : "Ask"}
          </button>
        </form>
        {state.error && (
          <p className="text-red-500 mt-4">
            An error occurred. Please try again.
          </p>
        )}
        {state.text && <p className="text-green-500 mt-4">{state.text}</p>}
      </div>
    </div>
  );
};

export default Home;
