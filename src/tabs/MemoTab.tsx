import React, { useCallback } from "react";
import { AppState } from "../types";

type MemoTabProps = {
  memo: { text: string };
  setState: (fn: (prev: AppState) => AppState) => void;
};

const MemoTab: React.FC<MemoTabProps> = ({ memo, setState }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setState((prev) => ({ ...prev, memo: { text } }));
    },
    [setState]
  );

  return (
    <div className="p-4">
      <textarea
        className="w-full h-[60vh] p-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-base bg-white"
        placeholder="思いついたことを全部ここに書く"
        value={memo.text}
        onChange={handleChange}
        rows={12}
        style={{ minHeight: "300px" }}
      />
    </div>
  );
};

export default MemoTab;
