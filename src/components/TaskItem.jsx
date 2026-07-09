import { useState } from "react";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.text);

  const save = () => {
    const next = value.trim();
    if (!next) return;
    onEdit(task.id, next);
    setIsEditing(false);
  };

  return (
    <li className="task-item">
      <div className="task-left">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />
          <span className="checkbox-mark"></span>
        </label>

        {isEditing ? (
          <input
            className="edit-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setValue(task.text);
                setIsEditing(false);
              }
            }}
            autoFocus
          />
        ) : (
          <span className={`task-text ${task.completed ? "done" : ""}`}>
            {task.text}
          </span>
        )}
      </div>

      <div className="task-actions">
        {isEditing ? (
          <button
            className="icon-btn save"
            type="button"
            onClick={save}
            title="Save"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        ) : (
          <button
            className="icon-btn"
            type="button"
            onClick={() => setIsEditing(true)}
            title="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        )}
        <button
          className="icon-btn delete"
          type="button"
          onClick={() => onDelete(task.id)}
          title="Delete"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </li>
  );
}