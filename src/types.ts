// --- 型定義 ---
export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type YearPlan = {
  id: number;
  years: number; // ★任意年数OK（25年など）
  goalText: string;
  order: number;
  targetYm?: string; // "YYYY-MM"
  isTargetCustom?: boolean;
};

export type AppState = {
  today: Todo[];
  week: {
    goal: string;
    todos: Todo[];
  };
  month: {
    goal: string;
    todos: Todo[];
  };
  halfYear: {
    goal: string;
  };
  yearPlans: {
    list: YearPlan[];
    activeId: number | null;
    baseDate?: string; // "YYYY-MM-DD"
  };
  memo: {
    text: string;
  };
};

export type EditingState = {
  today: { id: number | null; text: string };
  week: { id: number | null; text: string };
  month: { id: number | null; text: string };
};
