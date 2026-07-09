import { useState } from "react";
import { format, isPast, isToday, parseISO } from "date-fns";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.text);

  const save = () => {
    const next = value.trim();
    if (!next) return;
    onEdit(task.id, { text: next });
    setIsEditing(false);
  };

  const getDateLabel = () => {
    if (!task.dueDate) return null;
    const date = parseISO(task.dueDate);
    const isOverdue = isPast(date) && !isToday(date) && !task.completed;
    const isDueToday = isToday(date);

    let className = "task-date";
    if (isOverdue) className += " overdue";
    else if (isDueToday) className += " today";

    let label;
    if (isDueToday) label = "Today";
    else if (isOverdue) label = `Overdue · ${format(date, "MMM d")}`;
    else label = format(date, "MMM d");

    return (
      <span className={className}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        {label}
      </span>
    );
  };

  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <span className={`priority-dot ${task.priority}`} title={`Priority: ${task.priority}`}></span>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="checkbox-mark"></span>
      </label>

      <div className="task-content">
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
            onBlur={save}
            autoFocus
          />
        ) : (
          <span className="task-text">{task.text}</span>
        )}

        {(task.category !== "General" || task.dueDate) && (
          <div className="task-meta">
            {task.category !== "General" && (
              <span className="task-tag">{task.category}</span>
            )}
            {getDateLabel()}
          </div>
        )}
      </div>

      <div className="task-actions">
        <button
          className="icon-btn"
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button
          className="icon-btn delete"
          type="button"
          onClick={() => onDelete(task.id)}
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </li>
  );
}