import { useState, useEffect } from "react";
import TabBar from "../components/TabBar";
import TodoList from "../components/TodoList";
import TodayTab from "../tabs/TodayTab";
import WeekTab from "../tabs/WeekTab";
import MonthTab from "../tabs/MonthTab";
import HalfYearTab from "../tabs/HalfYearTab";
import YearPlanTab from "../tabs/YearPlanTab";
import { AppState, EditingState } from "../types";
import MemoTab from "../tabs/MemoTab";

// --- 初期データ・ユーティリティは必要なものだけ残す/移動 ---
function toISODateLocal(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
}
function addYearsToYm(baseDate: string, years: number): string {
    // baseDate: "YYYY-MM-DD"  years: number  => "YYYY-MM"
    const [y, m, d] = baseDate.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setFullYear(dt.getFullYear() + years);
    // 月はそのまま
    const ym = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}`;
    return ym;
}

const initialBaseDate = toISODateLocal(new Date());
const initialState: AppState = {
    today: [
        { id: 1, title: "英語を10分やる", completed: true },
        { id: 2, title: "筋トレする", completed: false },
        { id: 3, title: "日記を書く", completed: true },
    ],
    week: {
        goal: "今週の目標を入力",
        todos: [],
    },
    month: {
        goal: "今月の目標を入力",
        todos: [],
    },
    halfYear: {
        goal: "半年の目標を入力",
    },
    yearPlans: {
        list: [
            {
                id: Date.now(),
                years: 1,
                goalText: "1年後の自分の目標を書こう",
                order: 0,
                targetYm: "",
                isTargetCustom: false,
            },
        ],
        activeId: Date.now(),
        baseDate: initialBaseDate,
    },
    memo: { text: "" }, // 追加: AppState型の'memo'プロパティを初期化
};


// --- localStorage Key ---
const STORAGE_KEY = "goal_app_v2";

const IndexPage = () => {
    // --- State管理 ---
    const [state, setState] = useState<AppState>(initialState);
    const [activeTab, setActiveTab] = useState<string>("today");
    // 入力用
    const [input, setInput] = useState({
        today: "",
        weekTodo: "",
        weekGoal: "",
        monthTodo: "",
        monthGoal: "",
        halfYearGoal: "",
        yearPlanAddYears: 1 as 1|2|3|5|7|10|20|30|40|50,
    });

    // --- 編集状態（トップレベル） ---
    const [editing, setEditing] = useState({
        today: { id: null as number | null, text: "" },
        week: { id: null as number | null, text: "" },
        month: { id: null as number | null, text: "" },
    });

    // --- localStorage 読み込み ---
    useEffect(() => {
    const saved = localStorage.getItem("goal_app_v2");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);

            // ⭐ memoが無い古いデータを救済
            if (!parsed.memo) {
                parsed.memo = { text: "" };
            }

            // ⭐ yearPlans無い古いデータも救済（保険）
            if (!parsed.yearPlans) {
                parsed.yearPlans = initialState.yearPlans;
            }

            setState(parsed);
        } catch (e) {
            console.error("Failed to parse localStorage data:", e);
        }
    }
}, []);
    // --- localStorage 保存 ---
    useEffect(() => {
        localStorage.setItem("goal_app_v2", JSON.stringify(state));
    }, [state]);

    // --- メイン ---
    return (
        <div className="min-h-screen bg-gray-50 p-2">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
                <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div>
                    {activeTab === "today" && (
                        <TodayTab
                            todos={state.today}
                            setState={setState}
                            input={input.today}
                            setInput={v => setInput(i => ({ ...i, today: v }))}
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
                            setInput={v => setInput(i => ({ ...i, weekTodo: v }))}
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
                            setInput={v => setInput(i => ({ ...i, monthTodo: v }))}
                            editing={editing.month}
                            setEditing={setEditing}
                        />
                    )}
                    {activeTab === "halfYear" && (
                        <HalfYearTab
                            goal={state.halfYear.goal}
                            setState={setState}
                        />
                    )}
                    {activeTab === "yearPlan" && (
                        <YearPlanTab
                            yearPlans={state.yearPlans}
                            setState={setState}
                        />
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



