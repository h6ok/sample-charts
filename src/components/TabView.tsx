import { useState, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabViewProps {
  tabs: Tab[];
  defaultTab?: string;
}

const baseButtonStyle =
  "bg-transparent cursor-pointer text-base font-medium text-[#666] transition-all ease-[ease] relative px-6 py-3 border-b-4 border-solid hover:bg-[#e8e8e8] hover:text-[#333] w-full ";
const activeButtonStyle = "text-primary-blue border-b-primary-blue bg-white";
const borderButtomTransparent = "border-b-transparent";

export const TabView = ({ tabs, defaultTab }: TabViewProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex bg-neutral-100 gap-0.5 shrink p-0 border-b-2 border-b-[#e0e0e0] border-solid h-15">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${baseButtonStyle}
              ${
                activeTab === tab.id
                  ? twMerge(baseButtonStyle, activeButtonStyle)
                  : twMerge(baseButtonStyle, borderButtomTransparent)
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-5 bg-white min-h-[calc(100vh-100px)]">
        {activeTabContent}
      </div>
    </div>
  );
};
