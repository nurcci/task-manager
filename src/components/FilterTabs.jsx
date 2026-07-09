const filters = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Done" },
];

export default function FilterTabs({ current, onChange }) {
  return (
    <div className="filter-tabs">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={current === filter.id ? "active" : ""}
          onClick={() => onChange(filter.id)}
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}