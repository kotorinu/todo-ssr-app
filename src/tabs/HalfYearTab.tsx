import React from "react";

type HalfYearTabProps = {
  goal: string;
  setState: (fn: any) => void;
};

const HalfYearTab: React.FC<HalfYearTabProps> = ({ goal, setState }) => {
  const updateGoal = (v: string) => {
    setState((prev: any) => ({
      ...prev,
      halfYear: { goal: v },
    }));
  };

  const clearGoal = () => {
    setState((prev: any) => ({
      ...prev,
      halfYear: { goal: "" },
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="h-title">半年の目標</h1>

        {/* 中央に出さず、右上に小さめ */}
        <button className="btn-ghost px-3 py-2" onClick={clearGoal}>
          クリア
        </button>
      </div>

      <textarea
        className="mt-2 input-main min-h-[180px]"
        placeholder="半年の目標を入力"
        value={goal}
        onChange={(e) => updateGoal(e.target.value)}
      />
    </div>
  );
};

export default HalfYearTab;
