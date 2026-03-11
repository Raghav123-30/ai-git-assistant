"use client";

type SummaryProps = {
  heading?: string;
  helperText?: string;
  title?: string;
  breakingChanges?: string;
  summaryPoints?: string[];
  isLoading?: boolean;
};

const DisplaySummary = ({
  heading = "Commit Summary",
  helperText,
  title,
  breakingChanges,
  summaryPoints,
  isLoading = false,
}: SummaryProps) => {
  const hasSummaryPoints = Boolean(summaryPoints?.length);
  const hasBreakingChanges = Boolean(breakingChanges?.trim());
  const hasTitle = Boolean(title?.trim());
  const hasData = hasTitle || hasSummaryPoints || hasBreakingChanges;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold text-gray-900">{heading}</h3>
      {helperText && <p className="mb-3 text-sm text-gray-500">{helperText}</p>}

      <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Title
        </p>
        <p className="mt-1 text-sm font-medium text-gray-900">
          {title?.trim() ||
            (isLoading ? "Generating title..." : "No title generated yet.")}
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          Summary
        </p>
        {hasSummaryPoints ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-800">
            {summaryPoints?.map((point, index) => (
              <li key={`${point}-${index}`}>{point}</li>
            ))}
          </ul>
        ) : isLoading ? (
          <p className="text-sm text-gray-500">Generating summary points...</p>
        ) : (
          <p className="text-sm text-gray-500">No summary points available.</p>
        )}
      </div>

      {hasBreakingChanges && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
            Breaking Changes
          </p>
          <p className="mt-1 text-sm text-amber-900">{breakingChanges}</p>
        </div>
      )}

      {!hasData && !isLoading && (
        <p className="mt-4 text-sm text-gray-500">
          Click Generate summary to stream a structured summary.
        </p>
      )}
    </div>
  );
};

export default DisplaySummary;
