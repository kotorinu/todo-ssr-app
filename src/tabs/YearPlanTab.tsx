import React from "react";
import { YearPlan } from "../types";

type YearPlanTabProps = {
    yearPlans: { list: YearPlan[]; activeId: number | null; baseDate?: string };
    setState: (fn: any) => void;
    input?: any;
    setInput?: any;
};

function addYearsToYm(baseDate: string, years: number): string {
    const [y, m, d] = baseDate.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setFullYear(dt.getFullYear() + years);
    return `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}`;
}

const initialBaseDate = (() => {
    const date = new Date();
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
})();

const YearPlanTab: React.FC<YearPlanTabProps> = ({ yearPlans, setState }) => {
    const { list, activeId, baseDate } = yearPlans;
    const sorted = [...list].sort((a, b) => a.years - b.years);
    const active = list.find((p) => p.id === activeId) || null;
    const allYears: Array<1|2|3|5|7|10|20|30|40|50> = [1,2,3,5,7,10,20,30,40,50];
    const usedYears = list.map((p) => p.years);
    const addYearsOptions = allYears.filter(y => !usedYears.includes(y));

    // --- 基準日変更 ---
    const handleBaseDate = (v: string) => {
        setState((prev: any) => {
            const newList = prev.yearPlans.list.map((p: YearPlan) => {
                if (p.isTargetCustom) return p;
                return {
                    ...p,
                    targetYm: addYearsToYm(v, p.years),
                };
            });
            return {
                ...prev,
                yearPlans: {
                    ...prev.yearPlans,
                    baseDate: v,
                    list: newList,
                },
            };
        });
    };
    // 期間選択
    const handleSelect = (id: number) => {
        setState((prev: any) => ({
            ...prev,
            yearPlans: { ...prev.yearPlans, activeId: id },
        }));
    };
    // goalText編集
    const handleGoalText = (v: string) => {
        if (!active) return;
        setState((prev: any) => ({
            ...prev,
            yearPlans: {
                ...prev.yearPlans,
                list: prev.yearPlans.list.map((p: YearPlan) =>
                    p.id === active.id ? { ...p, goalText: v } : p
                ),
            },
        }));
    };
    // 目標年月編集
    const handleTargetYm = (v: string) => {
        if (!active) return;
        setState((prev: any) => ({
            ...prev,
            yearPlans: {
                ...prev.yearPlans,
                list: prev.yearPlans.list.map((p: YearPlan) =>
                    p.id === active.id ? { ...p, targetYm: v, isTargetCustom: true } : p
                ),
            },
        }));
    };
    // 追加
    const handleAdd = (years: number) => {
        if (usedYears.includes(years as 1|2|3|5|7|10|20|30|40|50)) return;
        const bd = baseDate || initialBaseDate;
        const newPlan: YearPlan = {
            id: Date.now(),
            years: years as any,
            goalText: `${years}年後の自分の目標を書こう`,
            order: list.length,
            targetYm: addYearsToYm(bd, years),
            isTargetCustom: false,
        };
        setState((prev: any) => ({
            ...prev,
            yearPlans: {
                ...prev.yearPlans,
                list: [...prev.yearPlans.list, newPlan],
                activeId: newPlan.id,
            },
        }));
    };
    // 削除
    const handleDelete = () => {
        if (!active) return;
        const filtered = list.filter((p) => p.id !== active.id);
        let newActive: number | null = null;
        if (filtered.length > 0) newActive = filtered[0].id;
        setState((prev: any) => ({
            ...prev,
            yearPlans: {
                ...prev.yearPlans,
                list: filtered.map((p, i) => ({ ...p, order: i })),
                activeId: newActive,
            },
        }));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-2 text-blue-600">年間計画</h1>
            {/* 基準日入力 */}
            <div className="mb-2 flex items-center gap-2">
                <label className="text-sm text-gray-600">基準日</label>
                <input
                    type="date"
                    className="border rounded-lg px-2 py-1"
                    value={baseDate || ""}
                    onChange={e => handleBaseDate(e.target.value)}
                />
            </div>
            {active && (
                <div className="text-xs text-blue-500 mb-2">いまは {active.years}年プラン編集してる</div>
            )}
            {/* 期間選択 */}
            <div className="mb-2">
                <select
                    className="border rounded-lg px-3 py-2"
                    value={active ? active.id : ""}
                    onChange={e => handleSelect(Number(e.target.value))}
                >
                    {sorted.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.years}年プラン</option>
                    ))}
                </select>
            </div>
            {/* goalText編集 */}
            {active && (
                <>
                    <textarea
                        className="w-full border rounded-lg px-3 py-2 min-h-[80px] mb-2"
                        value={active.goalText}
                        onChange={e => handleGoalText(e.target.value)}
                    />
                    {/* 目標年月入力 */}
                    <div className="mb-2 flex items-center gap-2">
                        <label className="text-sm text-gray-600">目標年月</label>
                        <input
                            type="month"
                            className="border rounded-lg px-2 py-1"
                            value={active.targetYm || ""}
                            onChange={e => handleTargetYm(e.target.value)}
                        />
                        {!active.isTargetCustom && (
                            <span className="text-xs text-gray-400">自動計算中</span>
                        )}
                    </div>
                </>
            )}
            {/* プラン追加 */}
            <div className="flex items-center gap-2 mb-2">
                <select
                    className="border rounded-lg px-2 py-1"
                    onChange={e => handleAdd(Number(e.target.value))}
                    defaultValue=""
                >
                    <option value="" disabled>追加する年数</option>
                    {addYearsOptions.map(y => (
                        <option key={y} value={y}>{y}年</option>
                    ))}
                </select>
            </div>
            {/* 削除 */}
            <button
                className="bg-red-500 text-white rounded-lg px-4 py-2 mb-2"
                onClick={handleDelete}
                disabled={!active}
            >このプランを削除</button>
        </div>
    );
};

export default YearPlanTab;
