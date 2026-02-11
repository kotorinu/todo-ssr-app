import React from "react";
import TodoList from "../components/TodoList";
import TextInputWithClear from "../components/TextInputWithClear";
import { Todo, EditingState } from "../types";

type WeekTabProps = {
  todos: Todo[];
  goal: string;
  setState: (fn: any) => void;
  input: string;
  setInput: (v: string) => void;
  editing: EditingState["week"];
  setEditing: (fn: any) => void;
};

const WeekTab: React.FC<WeekTabProps> = ({
  todos,
  goal,
  setState,
  input,
  setInput,
  editing,
  setEditing,
}) => {
  const allDone = todos.length > 0 && todos.every((t) => t.completed);

  const setGoal = (v: string) => {
    setState((prev: any) => ({
      ...prev,
      week: { ...prev.week, goal: v },
    }));
  };

  const addTodo = () => {
    const title = input.trim();
    if (!title) return;
    setState((prev: any) => ({
      ...prev,
      week: {
        ...prev.week,
        todos: [...prev.week.todos, { id: Date.now(), title, completed: false }],
      },
    }));
    setInput("");
  };

  const toggle = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      week: {
        ...prev.week,
        todos: prev.week.todos.map((t: Todo) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      },
    }));
  };

  const edit = (id: number, text: string) => {
    if (!text) return;
    setState((prev: any) => ({
      ...prev,
      week: {
        ...prev.week,
        todos: prev.week.todos.map((t: Todo) =>
          t.id === id ? { ...t, title: text } : t
        ),
      },
    }));
  };

  const del = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      week: {
        ...prev.week,
        todos: prev.week.todos.filter((t: Todo) => t.id !== id),
      },
    }));
  };

  return (
    <div>
      <h1 className="h-title">今週の目標</h1>

      {/* 目標：×でクリア */}
      <TextInputWithClear
        value={goal}
        onChange={setGoal}
        placeholder="今週の目標を入力"
        ariaLabel="今週の目標"
      />

      <div className="mt-4">
        <TodoList
          todos={todos}
          onToggle={toggle}
          onEdit={edit}
          onDelete={del}
          editingId={editing.id}
          editingText={editing.text}
          setEditing={setEditing}
          editingKey="week"
        />
      </div>

      <div className="flex gap-2 mt-4 items-stretch">
        <input
          className="input-main"
          placeholder="週のToDoを追加"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
        />
        <button className="btn-primary min-w-[92px]" onClick={addTodo}>
          追加
        </button>
      </div>

      {allDone && (
        <div className="mt-4 text-center text-green-600 font-bold">
          今週のToDoは完了！
        </div>
      )}
    </div>
  );
};

export default WeekTab;
