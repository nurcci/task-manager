import { useEffect, useRef, useState } from "react";

const CATEGORIES = ["General", "Work", "Personal", "Study", "Health"];

export default function TaskForm({ onAdd }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    onAdd({
      text: value,
      priority,
      category,
      dueDate: dueDate || null,
    });

    setText("");
    setDueDate("");
    setPriority("medium");
    setCategory("General");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-main">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn-add" type="submit">
          Add
        </button>
      </div>

      <div className="task-form-meta">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          title="Priority"
        >
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          title="Category"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          title="Due date"
        />
      </div>
    </form>
  );
}