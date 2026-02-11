import React from "react";

type HalfYearTabProps = {
    goal: string;
    setState: (fn: any) => void;
    setInput?: (v: string) => void;
};

const HalfYearTab: React.FC<HalfYearTabProps> = ({ goal, setState }) => {
    // goalクリア
    const clearGoal = () => {
        setState((prev: any) => ({
            ...prev,
            halfYear: { goal: "" },
        }));
    };
    const updateGoal = (v: string) => {
        setState((prev: any) => ({
            ...prev,
            halfYear: { goal: v },
        }));
    };
    return (
        <div>
            <h1 className="text-2xl font-bold mb-2 text-blue-600">半年の目標</h1>
            <div className="flex gap-2 mb-2">
                <textarea
                    className="flex-1 border rounded-lg px-3 py-2 min-h-[80px]"
                    value={goal}
                    onChange={(e) => updateGoal(e.target.value)}
                />
                <button
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-lg h-fit"
                    onClick={clearGoal}
                >クリア</button>
            </div>
        </div>
    );
};

export default HalfYearTab;
