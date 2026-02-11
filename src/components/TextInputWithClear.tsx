import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
};

const TextInputWithClear: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  ariaLabel,
}) => {
  return (
    <div className="input-wrap">
      <input
        className="input-main pr-14"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
      />
      {value.trim().length > 0 && (
        <button
          type="button"
          className="input-clear"
          onClick={() => onChange("")}
          aria-label="クリア"
          title="クリア"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default TextInputWithClear;
