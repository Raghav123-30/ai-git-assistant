"use client";

import generatePRSummaryAction, {
  type PRSummaryState,
} from "@/actions/generatePrSummaryAction";
import { prSummaryFormSchema } from "@/schemas/prSummaryFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof prSummaryFormSchema>;

const initialState: PRSummaryState = {
  error: false,
  text: "",
};

const PrSummaryPanel = () => {
  const [formState, setFormState] = useState<PRSummaryState>(initialState);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(prSummaryFormSchema),
    defaultValues: {
      diff: "",
      enableCustomization: false,
      complexity: "medium",
      detailLevel: "concise",
      includeBreakingChanges: false,
      includeTestPlan: true,
      ticketReference: "",
      type: "feat",
      format: "markdown",
      showCheckList: true,
      maxTitleChars: 72,
    },
  });

  const enableCustomization = useWatch({
    control,
    name: "enableCustomization",
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await generatePRSummaryAction(initialState, values);
    setFormState(result);
  });

  return (
    <section className="grid gap-6 md:grid-cols-2">
      <form
        onSubmit={onSubmit}
        className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900">PR Summary</h2>

        <label
          htmlFor="pr-diff"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Git diff
        </label>
        <textarea
          id="pr-diff"
          placeholder="Paste PR diff here..."
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="complexity"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Complexity
                </label>
                <select
                  id="complexity"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  {...register("complexity")}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="detailLevel"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Detail level
                </label>
                <select
                  id="detailLevel"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  {...register("detailLevel")}
                >
                  <option value="concise">Concise</option>
                  <option value="expanded">Expanded</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="type"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  PR type
                </label>
                <select
                  id="type"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  {...register("type")}
                >
                  <option value="feat">feat</option>
                  <option value="fix">fix</option>
                  <option value="chore">chore</option>
                  <option value="refactor">refactor</option>
                  <option value="docs">docs</option>
                  <option value="perf">perf</option>
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
                  <option value="markdown">Markdown</option>
                  <option value="slack">Slack</option>
                  <option value="plain">Plain</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="ticketReference"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Ticket reference
              </label>
              <input
                id="ticketReference"
                type="text"
                placeholder="e.g. PROJ-142"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                {...register("ticketReference")}
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="size-4"
                  {...register("includeBreakingChanges")}
                />
                Include breaking changes
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="size-4"
                  {...register("includeTestPlan")}
                />
                Include test plan
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="size-4"
                  {...register("showCheckList")}
                />
                Include checklist
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting ? "Generating..." : "Generate PR summary"}
        </button>
      </form>

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
            Generated PR summary will appear here.
          </p>
        )}
      </div>
    </section>
  );
};

export default PrSummaryPanel;
