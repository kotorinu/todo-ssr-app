import React from "react";
import TodoList from "../components/TodoList";
import { Todo, EditingState } from "../types";

type MonthTabProps = {
    todos: Todo[];
    goal: string;
    setState: (fn: any) => void;
    input: string;
    setInput: (v: string) => void;
    editing: EditingState["month"];
    setEditing: (fn: any) => void;
};

const MonthTab: React.FC<MonthTabProps> = ({ todos, goal, setState, input, setInput, editing, setEditing }) => {
    const allDone = todos.length > 0 && todos.every((t) => t.completed);
    // 目標テキスト
    const updateGoal = (v: string) => {
        setState((prev: any) => ({
            ...prev,
            month: { ...prev.month, goal: v },
        }));
    };
    // goalクリア
    const clearGoal = () => {
        setState((prev: any) => ({
            ...prev,
            month: { ...prev.month, goal: "" },
        }));
    };
    // ToDo追加
    const addTodo = () => {
        const title = input.trim();
        if (!title) return;
        setState((prev: any) => ({
            ...prev,
            month: {
                ...prev.month,
                todos: [
                    ...prev.month.todos,
                    { id: Date.now(), title, completed: false },
                ],
            },
        }));
        setInput("");
    };
    // チェック切替
    const toggle = (id: number) => {
        setState((prev: any) => ({
            ...prev,
            month: {
                ...prev.month,
                todos: prev.month.todos.map((t: Todo) =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                ),
            },
        }));
    };
    // 編集
    const edit = (id: number, text: string) => {
        if (!text) return;
        setState((prev: any) => ({
            ...prev,
            month: {
                ...prev.month,
                todos: prev.month.todos.map((t: Todo) =>
                    t.id === id ? { ...t, title: text } : t
                ),
            },
        }));
    };
    // 削除
    const del = (id: number) => {
        setState((prev: any) => ({
            ...prev,
            month: {
                ...prev.month,
                todos: prev.month.todos.filter((t: Todo) => t.id !== id),
            },
        }));
    };
    return (
        <div>
            <h1 className="text-2xl font-bold mb-2 text-blue-600">今月の目標</h1>
            <div className="flex gap-2 mb-4">
                <input
                    className="flex-1 border rounded-lg px-3 py-2"
                    value={goal}
                    onChange={(e) => updateGoal(e.target.value)}
                />
                <button
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-lg"
                    onClick={clearGoal}
                >クリア</button>
            </div>
            <TodoList
                todos={todos}
                onToggle={toggle}
                onEdit={edit}
                onDelete={del}
                editingId={editing.id}
                editingText={editing.text}
                setEditing={setEditing}
                editingKey="month"
            />
            <div className="flex gap-2 mt-4">
                <input
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="月のToDoを追加"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") addTodo();
                    }}
                />
                <button
                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                    onClick={addTodo}
                >追加</button>
            </div>
            {allDone && (
                <div className="mt-4 text-center text-green-600 font-bold">
                    今月のToDoは完了！
                </div>
            )}
        </div>
    );
};

export default MonthTab;
