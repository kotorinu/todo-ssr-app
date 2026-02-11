import { useState, useEffect } from "react";
import TabBar from "../components/TabBar";
import TodayTab from "../tabs/TodayTab";
import WeekTab from "../tabs/WeekTab";
import MonthTab from "../tabs/MonthTab";
import HalfYearTab from "../tabs/HalfYearTab";
import YearPlanTab from "../tabs/YearPlanTab";
import MemoTab from "../tabs/MemoTab";
import { AppState } from "../types";

function toISODateLocal(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const STORAGE_KEY = "goal_app_v2";

const makeInitialState = (): AppState => {
  const now = Date.now();
  const baseDate = toISODateLocal(new Date());

  return {
    today: [
      { id: 1, title: "英語を10分やる", completed: true },
      { id: 2, title: "筋トレする", completed: false },
      { id: 3, title: "日記を書く", completed: true },
    ],
    week: { goal: "今週の目標を入力", todos: [] },
    month: { goal: "今月の目標を入力", todos: [] },
    halfYear: { goal: "半年の目標を入力" },
    yearPlans: {
      list: [
        {
          id: now,
          years: 1,
          goalText: "1年後の自分の目標を書こう",
          order: 0,
          targetYm: "",
          isTargetCustom: false,
        },
      ],
      activeId: now,
      baseDate,
    },
    memo: { text: "" },
  };
};

/**
 * ★ここが重要
 * 既存localStorageに「新しく追加したキー」が無いと、
 * 画面上で入力しても保存されず “消える” 事故が起きる。
 * → 初期状態とマージして不足分を補完する。
 */
function migrateState(raw: any, initial: AppState): AppState {
  const merged: AppState = {
    ...initial,
    ...raw,
    week: { ...initial.week, ...(raw?.week ?? {}) },
    month: { ...initial.month, ...(raw?.month ?? {}) },
    halfYear: { ...initial.halfYear, ...(raw?.halfYear ?? {}) },
    yearPlans: { ...initial.yearPlans, ...(raw?.yearPlans ?? {}) },
    memo: { ...initial.memo, ...(raw?.memo ?? {}) },
  };

  // yearPlans.list が無い/壊れてる場合の保険
  if (!Array.isArray(merged.yearPlans.list)) {
    merged.yearPlans.list = initial.yearPlans.list;
  }

  // activeId が無い場合は先頭を選ぶ
  if (merged.yearPlans.activeId == null && merged.yearPlans.list.length > 0) {
    merged.yearPlans.activeId = merged.yearPlans.list[0].id;
  }

  // baseDate が無い場合は補完
  if (!merged.yearPlans.baseDate) {
    merged.yearPlans.baseDate = initial.yearPlans.baseDate;
  }

  // halfYear.goal が undefined にならないように
  if (typeof merged.halfYear.goal !== "string") {
    merged.halfYear.goal = initial.halfYear.goal;
  }

  if (typeof merged.memo.text !== "string") {
    merged.memo.text = "";
  }

  return merged;
}

const IndexPage = () => {
  const initial = makeInitialState();

  const [state, setState] = useState<AppState>(initial);
  const [activeTab, setActiveTab] = useState<string>("today");

  const [input, setInput] = useState({
    today: "",
    weekTodo: "",
    monthTodo: "",
  });

  const [editing, setEditing] = useState({
    today: { id: null as number | null, text: "" },
    week: { id: null as number | null, text: "" },
    month: { id: null as number | null, text: "" },
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      const next = migrateState(parsed, initial);
      setState(next);
    } catch {
      // 壊れてたら初期のまま
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <div className="min-h-screen p-3 bg-[var(--background)]">
      <div className="max-w-md mx-auto card p-5">
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-3">
          {activeTab === "today" && (
            <TodayTab
              todos={state.today}
              setState={setState}
              input={input.today}
              setInput={(v) => setInput((i) => ({ ...i, today: v }))}
              editing={editing.today}
              setEditing={setEditing}
            />
          )}

          {activeTab === "week" && (
            <WeekTab
              todos={state.week.todos}
              goal={state.week.goal}
              setState={setState}
              input={input.weekTodo}
              setInput={(v) => setInput((i) => ({ ...i, weekTodo: v }))}
              editing={editing.week}
              setEditing={setEditing}
            />
          )}

          {activeTab === "month" && (
            <MonthTab
              todos={state.month.todos}
              goal={state.month.goal}
              setState={setState}
              input={input.monthTodo}
              setInput={(v) => setInput((i) => ({ ...i, monthTodo: v }))}
              editing={editing.month}
              setEditing={setEditing}
            />
          )}

          {activeTab === "halfYear" && (
            <HalfYearTab goal={state.halfYear.goal} setState={setState} />
          )}

          {activeTab === "yearPlan" && (
            <YearPlanTab yearPlans={state.yearPlans} setState={setState} />
          )}

          {activeTab === "memo" && (
            <MemoTab memo={state.memo} setState={setState} />
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
