import React, { useMemo, useState } from "react";
import { YearPlan } from "../types";

type YearPlanTabProps = {
  yearPlans: { list: YearPlan[]; activeId: number | null; baseDate?: string };
  setState: (fn: any) => void;
};

function addYearsToYm(baseDate: string, years: number): string {
  const [y, m, d] = baseDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setFullYear(dt.getFullYear() + years);
  return `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}`;
}

function todayIso(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 表示用（YYYY-MM → 2027年02月）
function formatYmLabel(ym?: string): string {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  if (!y || !m) return ym;
  return `${y}年${m}月`;
}

const QUICK_YEARS = [1, 2, 3, 5, 10];

const YearPlanTab: React.FC<YearPlanTabProps> = ({ yearPlans, setState }) => {
  const { list, activeId, baseDate } = yearPlans;
  const bd = baseDate || todayIso();

  const sorted = useMemo(
    () => [...list].sort((a, b) => a.years - b.years),
    [list]
  );

  const active = list.find((p) => p.id === activeId) || null;

  const [customYears, setCustomYears] = useState<string>("");

  const setActiveId = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      yearPlans: { ...prev.yearPlans, activeId: id },
    }));
  };

  const upsertPlanByYears = (years: number) => {
    if (!Number.isFinite(years) || years <= 0) return;

    const existing = list.find((p) => p.years === years);
    if (existing) {
      setActiveId(existing.id);
      return;
    }

    const newPlan: YearPlan = {
      id: Date.now(),
      years,
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

  const handleBaseDate = (v: string) => {
    setState((prev: any) => {
      const newList = prev.yearPlans.list.map((p: YearPlan) => {
        if (p.isTargetCustom) return p;
        return { ...p, targetYm: addYearsToYm(v, p.years) };
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

  const handleDelete = () => {
    if (!active) return;
    const filtered = list.filter((p) => p.id !== active.id);
    const newActive = filtered.length > 0 ? filtered[0].id : null;

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
      <h1 className="h-title">年間計画</h1>

      {/* 基準日（枠あり・コンパクト） */}
      <div className="mb-3 flex items-center gap-2">
        <div className="text-sm font-extrabold text-slate-600 shrink-0">基準日</div>
        <div className="field-compact">
          <input
            type="date"
            className="field-compact__input"
            value={bd}
            onChange={(e) => handleBaseDate(e.target.value)}
          />
        </div>
      </div>

      {/* 既存プラン（主役：ここを上に） */}
      <div className="section-label">既存プラン</div>
      <div className="chip-row">
        {sorted.map((p) => (
          <button
            key={p.id}
            className={`chip ${active?.id === p.id ? "chip--active" : ""}`}
            onClick={() => setActiveId(p.id)}
            title="切り替え"
          >
            {p.years}年
          </button>
        ))}
      </div>

      {/* 編集エリア（真ん中＝目標内容） */}
      {active && (
        <div className="mt-4">

          <textarea
            className="input-main min-h-[140px]"
            value={active.goalText}
            onChange={(e) => handleGoalText(e.target.value)}
            placeholder={`${active.years}年後の目標を書く`}
          />

          <div className="mt-3 flex items-center gap-2">
            <div className="text-sm font-extrabold text-slate-600 shrink-0">目標年月</div>
            <div className="field-compact">
              <input
                type="month"
                className="field-compact__input"
                value={active.targetYm || ""}
                onChange={(e) => handleTargetYm(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <button className="btn-danger" onClick={handleDelete}>
              このプランを削除
            </button>
          </div>
        </div>
      )}

      {/* 追加UI（主役を邪魔しないように下へ＆コンパクト） */}
      <div className="mt-5">
        <div className="section-label">クイック追加</div>
        <div className="chip-row">
          {QUICK_YEARS.map((y) => (
            <button
              key={y}
              className="chip"
              onClick={() => upsertPlanByYears(y)}
              title="追加/切り替え"
            >
              {y}年+
            </button>
          ))}
        </div>

        <div className="section-label">任意の年数（例: 25）</div>
        <div className="flex gap-2 items-stretch">
          <input
            className="input-main"
            style={{ maxWidth: 220 }}  /* ★小さくする */
            inputMode="numeric"
            placeholder="例）25"
            value={customYears}
            onChange={(e) => setCustomYears(e.target.value)}
          />
          <button
            className="btn-primary min-w-[96px]" /* ★縦文字化防止 */
            onClick={() => {
              const n = Number(customYears);
              if (!Number.isFinite(n) || n <= 0) return;
              upsertPlanByYears(n);
              setCustomYears("");
            }}
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearPlanTab;
