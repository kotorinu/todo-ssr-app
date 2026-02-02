import { useState } from "react";

// 1. 今日のToDoを管理するための state を用意する
//    - ToDoは配列
//    - 1つ1つに id / title / completed を持たせる

type Todo = {
    id: number;
    title: string;
    completed: boolean
}
// 2. 仮のToDoデータを用意する（最初は3つくらい）
//    - 「英語を10分やる」
//    - 「筋トレする」
//    - 「日記を書く」など

const todoData: Todo[] = [
    { id: 1, title: "英語を10分やる", completed: true },
    { id: 2, title: "筋トレする", completed: false },
    { id: 3, title: "日記を書く", completed: true }
];

const TodoApp = () => {
    const [todos, setTodos] = useState<Todo[]>(todoData);
    const [newTitle, setNewTitle] = useState("");

    // 3. 画面の上に「今日のToDo」というタイトルを表示する
    // 4. ToDoの配列を map して一覧表示する
    //    - チェックボックスを表示
    //    - タイトルを表示
    // 5. チェックボックスをクリックしたら
    //    - 対応するToDoの completed を true / false に切り替える

    // 6. 全てのToDoが completed === true になったら
    //    - 「今日は完了しました 🎉」というメッセージを表示する

    const addTitle = () => {
        const a: number = todos.length;
        const newTodos=({ id: a+1, title: newTitle, completed: false });
        setTodos([...todos, newTodos])
        setNewTitle("");
    }

    return (
        <>
            <h1>今日のToDo</h1>
            <ul>
                {todos.map((todo) => {
                    return (
                        <li key={todo.id}>
                            <input type="checkbox" checked={todo.completed} onChange={() => {
                                setTodos(
                                    todos.map((t) => {
                                        if (t.id === todo.id) {
                                            return { ...t, completed: !t.completed };
                                        }
                                        return t;
                                    })
                                )
                            }}></input>
                            {todo.id}.{todo.title}
                        </li>
                    )

                })
                }
            </ul>
            <input value={newTitle} onChange={(e) => { setNewTitle(e.target.value) }}></input>
            <button onClick={addTitle}>追加</button>
            <div>
                {todos.every((todo) => { return todo.completed }
                ) && <p>今日は完了しました 🎉</p>}
            </div>
        </>
    )
}

export default TodoApp;



