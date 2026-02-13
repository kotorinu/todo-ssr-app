import React from "react";
import TodoList from "../components/TodoList";
import { Todo, EditingState } from "../types";

type TodayTabProps = {
  todos: Todo[];
  setState: (fn: any) => void;
  input: string;
  setInput: (v: string) => void;
  editing: EditingState["today"];
  setEditing: (fn: any) => void;
};

const TodayTab: React.FC<TodayTabProps> = ({
  todos,
  setState,
  input,
  setInput,
  editing,
  setEditing,
}) => {
  const allDone = todos.length > 0 && todos.every((t) => t.completed);

  const addTodo = () => {
    const title = input.trim();
    if (!title) return;
    setState((prev: any) => ({
      ...prev,
      today: [...prev.today, { id: Date.now(), title, completed: false }],
    }));
    setInput("");
  };

  const toggle = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      today: prev.today.map((t: Todo) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  const edit = (id: number, text: string) => {
    if (!text) return;
    setState((prev: any) => ({
      ...prev,
      today: prev.today.map((t: Todo) => (t.id === id ? { ...t, title: text } : t)),
    }));
  };

  const del = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      today: prev.today.filter((t: Todo) => t.id !== id),
    }));
  };

  return (
    <div>
      <h1 className="section-title mb-4">今日のToDo</h1>

      <TodoList
        todos={todos}
        onToggle={toggle}
        onEdit={edit}
        onDelete={del}
        editingId={editing.id}
        editingText={editing.text}
        setEditing={setEditing}
        editingKey="today"
      />

      <div className="row mt-4">
        <input
          className="input-main"
          placeholder="新しいToDoを追加"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
        />
        <button className="mt-3 btn btn-primary" onClick={addTodo}>
          追加
        </button>
      </div>

      {allDone && (
        <div className="mt-4 text-center font-extrabold" style={{ color: "#16a34a" }}>
          今日は完了しました 🎉
        </div>
      )}
    </div>
  );
};

export default TodayTab;
