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
    <div>
      <h1 className="h-title">メモ</h1>
      <textarea
        className="input-main min-h-[320px]"
        placeholder="思いついたことを全部ここに書く"
        value={memo.text}
        onChange={handleChange}
      />
    </div>
  );
};

export default MemoTab;
