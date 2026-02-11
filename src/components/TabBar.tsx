import React from "react";

const TABS = [
    { key: "today", label: "今日" },
    { key: "week", label: "今週" },
    { key: "month", label: "今月" },
    { key: "halfYear", label: "半年" },
    { key: "yearPlan", label: "年計画" },
    { key: "memo", label: "メモ" },
];

type TabBarProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab }) => (
    <div className="flex overflow-x-auto gap-2 pb-2 mb-4">
        {TABS.map((tab) => (
            <button
                key={tab.key}
                className={`flex-1 whitespace-nowrap px-4 py-2 rounded-lg font-bold transition-colors ${
                    activeTab === tab.key
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-700"
                }`}
                onClick={() => setActiveTab(tab.key)}
            >
                {tab.label}
            </button>
        ))}
    </div>
);

export default TabBar;
