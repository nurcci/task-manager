import { useEffect, useMemo, useState } from "react";
import { isPast, isToday, parseISO } from "date-fns";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterTabs from "./components/FilterTabs";
import "./App.css";

const STORAGE_KEY = "task-manager-tasks-v2";
const THEME_KEY = "task-manager-theme";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const addTask = (data) => {
    const newTask = {
      id: crypto.randomUUID(),
      text: data.text,
      completed: false,
      priority: data.priority,
      category: data.category,
      dueDate: data.dueDate,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const editTask = (id, changes) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...changes } : task))
    );
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filter === "active") result = result.filter((t) => !t.completed);
    if (filter === "completed") result = result.filter((t) => t.completed);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === "priority") {
      result.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      );
    } else if (sortBy === "alphabet") {
      result.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortBy === "dueDate") {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [tasks, filter, search, sortBy]);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter(
    (t) =>
      !t.completed &&
      t.dueDate &&
      isPast(parseISO(t.dueDate)) &&
      !isToday(parseISO(t.dueDate))
  ).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <h1>Tasks</h1>
          <p>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          title="Toggle theme"
        >
          {theme === "light" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value success">{completed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overdue</div>
          <div className={`stat-value ${overdue > 0 ? "warning" : ""}`}>
            {overdue}
          </div>
        </div>
      </div>

      <div className="progress-wrap">
        <div className="progress-header">
          <span>Daily progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <TaskForm onAdd={addTask} />

      <div className="toolbar">
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search tasks... (⌘K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Newest first</option>
          <option value="priority">By priority</option>
          <option value="dueDate">By due date</option>
          <option value="alphabet">A-Z</option>
        </select>
      </div>

      <FilterTabs current={filter} onChange={setFilter} />

      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
      />
    </div>
  );
}