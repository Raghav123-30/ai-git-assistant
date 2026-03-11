"use client";

import CommitMessagePanel from "@/components/features/CommitMessagePanel";
import PrSummaryPanel from "@/components/features/PrSummaryPanel";
import { useState } from "react";

const tabs = [
  { id: "commit", label: "Commit Message" },
  { id: "pr", label: "PR Summary" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Home = () => {
  const [activeTab, setActiveTab] = useState<TabId>("commit");

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          AI GIT ASSISTANT
        </h1>

        <div className="mb-6 flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "commit" && <CommitMessagePanel />}
        {activeTab === "pr" && <PrSummaryPanel />}

        {activeTab !== "commit" && activeTab !== "pr" && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
            This panel will be implemented next.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
