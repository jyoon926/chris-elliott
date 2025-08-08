import { useEffect, useRef } from "react";

interface AutoResizeTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const AutoResizeTextarea = ({
  value,
  onChange,
  className = "",
}: AutoResizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const { scrollTop } = document.documentElement;
      textarea.style.height = "0";
      textarea.style.height = textarea.scrollHeight + "px";
      document.documentElement.scrollTop = scrollTop;
    }
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={`${className} resize-none`}
      value={value}
      onChange={onChange}
      onInput={autoResize}
    />
  );
};

export default AutoResizeTextarea;
