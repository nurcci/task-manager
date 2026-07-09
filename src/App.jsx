import { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterTabs from "./components/FilterTabs";
import "./App.css";

const STORAGE_KEY = "task-manager-tasks";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const newTask = {
      id: crypto.randomUUID(),
      text,
      completed: false,
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

  const editTask = (id, text) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text } : task))
    );
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.length - activeCount;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="app">
      <header className="header">
        <h1>Task Manager</h1>
        <p>Organize your day, one task at a time</p>
      </header>

      <main className="card">
        <TaskForm onAdd={addTask} />
        <FilterTabs current={filter} onChange={setFilter} />

        <div className="progress-wrap">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span>
              {completedCount} из {tasks.length} выполнено
            </span>
            <span>{progress}%</span>
          </div>
        </div>

        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />

        {completedCount > 0 && (
          <button className="clear-btn" type="button" onClick={clearCompleted}>
            🗑 Очистить выполненные
          </button>
        )}
      </main>
    </div>
  );
}