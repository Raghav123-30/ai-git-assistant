"use client";

import { commitMessageFormSchema } from "@/schemas/commitMessageFormSchema";
import generateCommitMessageAction, {
  type CommitMessageState,
} from "@/actions/generateCommitMessageAction";
import DisplaySummary from "@/components/features/DisplaySummary";
import { zodResolver } from "@hookform/resolvers/zod";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { summarySchema } from "@/schemas/summarySchema";
type FormValues = z.infer<typeof commitMessageFormSchema>;

const initialState: CommitMessageState = {
  error: false,
  text: "",
};

const CommitMessagePanel = () => {
  const [formState, setFormState] = useState<CommitMessageState>(initialState);
  const {
    object: summaryObject,
    submit: generateSummary,
    isLoading: isGeneratingSummary,
    error: summaryError,
  } = useObject({
    api: "/api/generate-summary",
    schema: summarySchema,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(commitMessageFormSchema),
    defaultValues: {
      diff: "",
      enableCustomization: false,
      style: "short",
      format: "plain",
      conventional: true,
      maxTitleChars: 72,
    },
  });

  const enableCustomization = useWatch({
    control,
    name: "enableCustomization",
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await generateCommitMessageAction(initialState, values);
    setFormState(result);
  });

  const onGenerateSummary = handleSubmit(async (values) => {
    await generateSummary({ diff: values.diff });
  });

  const normalizedSummaryPoints = summaryObject?.summaryPoints?.filter(
    (point): point is string => Boolean(point),
  );

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <form
        onSubmit={onSubmit}
        className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Commit Message
        </h2>

        <label
          htmlFor="diff"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Git diff
        </label>
        <textarea
          id="diff"
          placeholder="Paste git diff here..."
          className="min-h-56 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm outline-none ring-blue-500 focus:ring"
          {...register("diff")}
        />
        {errors.diff && (
          <p className="mt-2 text-sm text-red-600">{errors.diff.message}</p>
        )}

        <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="size-4"
            {...register("enableCustomization")}
          />
          Enable customization
        </label>

        {enableCustomization && (
          <div className="mt-4 grid gap-4 rounded-md border border-gray-200 bg-gray-50 p-4">
            <div>
              <label
                htmlFor="style"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Style
              </label>
              <select
                id="style"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                {...register("style")}
              >
                <option value="short">Short</option>
                <option value="long">Long</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="format"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Output format
              </label>
              <select
                id="format"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                {...register("format")}
              >
                <option value="plain">Plain</option>
                <option value="bullets">Bullet points</option>
                <option value="numbered">Numbered points</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="size-4"
                {...register("conventional")}
              />
              Use conventional commit style
            </label>

            <div>
              <label
                htmlFor="maxTitleChars"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Max title chars
              </label>
              <input
                id="maxTitleChars"
                type="number"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                {...register("maxTitleChars", { valueAsNumber: true })}
              />
              {errors.maxTitleChars && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.maxTitleChars.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Generating..." : "Generate message"}
          </button>

          <button
            type="button"
            onClick={onGenerateSummary}
            disabled={isGeneratingSummary}
            className="rounded-md bg-emerald-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isGeneratingSummary ? "Generating summary..." : "Generate summary"}
          </button>
        </div>
      </form>

      <div className="grid gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-gray-900">Output</h3>
          {errors.root && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.root.message || "Something went wrong"}
            </p>
          )}
          {!formState.error && formState.text && (
            <pre className="whitespace-pre-wrap rounded-md border border-green-200 bg-green-50 p-3 text-sm text-gray-900">
              {formState.text}
            </pre>
          )}
          {!formState.text && !formState.error && (
            <p className="text-sm text-gray-500">
              Generated commit message will appear here.
            </p>
          )}
        </div>

        {summaryError && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {summaryError.message || "Failed to generate commit summary."}
          </p>
        )}

        <DisplaySummary
          title={summaryObject?.title}
          breakingChanges={summaryObject?.breakingChanges ?? undefined}
          summaryPoints={normalizedSummaryPoints}
          isLoading={isGeneratingSummary}
        />
      </div>
    </section>
  );
};

export default CommitMessagePanel;
