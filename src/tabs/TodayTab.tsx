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

const TodayTab: React.FC<TodayTabProps> = ({ todos, setState, input, setInput, editing, setEditing }) => {
    const allDone = todos.length > 0 && todos.every((t) => t.completed);
    // 追加
    const addTodo = () => {
        const title = input.trim();
        if (!title) return;
        setState((prev: any) => ({
            ...prev,
            today: [
                ...prev.today,
                { id: Date.now(), title, completed: false },
            ],
        }));
        setInput("");
    };
    // チェック切替
    const toggle = (id: number) => {
        setState((prev: any) => ({
            ...prev,
            today: prev.today.map((t: Todo) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            ),
        }));
    };
    // 編集
    const edit = (id: number, text: string) => {
        if (!text) return;
        setState((prev: any) => ({
            ...prev,
            today: prev.today.map((t: Todo) =>
                t.id === id ? { ...t, title: text } : t
            ),
        }));
    };
    // 削除
    const del = (id: number) => {
        setState((prev: any) => ({
            ...prev,
            today: prev.today.filter((t: Todo) => t.id !== id),
        }));
    };
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-blue-600">今日のToDo</h1>
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
            <div className="flex gap-2 mt-4">
                <input
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="新しいToDoを追加"
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
                    今日は完了しました 🎉
                </div>
            )}
        </div>
    );
};

export default TodayTab;
