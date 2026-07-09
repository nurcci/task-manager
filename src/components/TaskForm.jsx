import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    onAdd(value);
    setText("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Что нужно сделать?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">＋ Добавить</button>
    </form>
  );
}