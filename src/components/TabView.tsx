import { useState, ReactNode } from "react";
import "../styles/TabView.css";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabViewProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const TabView = ({ tabs, defaultTab }: TabViewProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="tab-view">
      <div className="tab-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{activeTabContent}</div>
    </div>
  );
};
