import React from "react";
import { Todo } from "../types";

type TodoListProps = {
    todos: Todo[];
    onToggle: (id: number) => void;
    onEdit: (id: number, text: string) => void;
    onDelete: (id: number) => void;
    editingId: number | null;
    editingText: string;
    setEditing: (fn: any) => void;
    editingKey: "today" | "week" | "month";
};

const TodoList: React.FC<TodoListProps> = ({
    todos,
    onToggle,
    onEdit,
    onDelete,
    editingId,
    editingText,
    setEditing,
    editingKey,
}) => (
    <ul className="space-y-2">
        {todos.map((todo) => (
            <li
                key={todo.id}
                className={`w-full min-w-0 overflow-hidden flex items-center gap-2 border rounded-lg p-3 ${todo.completed ? "bg-gray-100" : ""
                    }`}
            >
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    className="w-5 h-5 accent-blue-500"
                />
                {editingId === todo.id ? (
                    <input
                        className="flex-1 min-w-0 border rounded-lg px-2 py-1 text-lg"
                        value={editingText}
                        onChange={e => setEditing((prev: any) => ({
                            ...prev,
                            [editingKey]: { id: todo.id, text: e.target.value }
                        }))}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                onEdit(todo.id, editingText.trim());
                                setEditing((prev: any) => ({ ...prev, [editingKey]: { id: null, text: "" } }));
                            } else if (e.key === "Escape") {
                                setEditing((prev: any) => ({ ...prev, [editingKey]: { id: null, text: "" } }));
                            }
                        }}
                    />
                ) : (
                    <span
                        className={`flex-1 text-lg ${todo.completed ? "line-through text-gray-400" : ""
                            }`}
                    >
                        {todo.title}
                    </span>
                )}
                {editingId === todo.id ? (
                    <div className="flex items-center gap-2 shrink-0">

                        <button
                            className="px-2 py-1 bg-blue-100 text-white rounded-lg"
                            onClick={() => {
                                onEdit(todo.id, editingText.trim());
                                setEditing((prev: any) => ({ ...prev, [editingKey]: { id: null, text: "" } }));
                            }}
                        >✅</button>
                        <button
                            className="px-2 py-1 bg-gray-300 text-gray-700 rounded-lg"
                            onClick={() => setEditing((prev: any) => ({ ...prev, [editingKey]: { id: null, text: "" } }))}
                        >❌</button>
                    </div>
                ) : (
                    <>
                        <button
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg"
                            onClick={() => setEditing((prev: any) => ({ ...prev, [editingKey]: { id: todo.id, text: todo.title } }))}
                        >🖋</button>
                        <button
                            className="px-2 py-1 bg-red-100 text-red-600 rounded-lg"
                            onClick={() => {
                                if (window.confirm("本当に削除しますか？")) onDelete(todo.id);
                            }}
                        >🗑</button>
                    </>
                )}
            </li>
        ))}
    </ul>
);

export default TodoList;
