const categories = [
  { value: "todos", label: "Todos" },
  { value: "perifericos", label: "Perifericos" },
  { value: "audio", label: "Audio" },
  { value: "monitores", label: "Monitores" },
  { value: "cameras", label: "Cameras" },
  { value: "acessorios", label: "Acessorios" }
];

export default function CategoryFilter({ currentCategory, onChange }) {
  return (
    <div className="filters" aria-label="Categorias">
      {categories.map((category) => (
        <button
          className={`filter-btn ${
            currentCategory === category.value ? "active" : ""
          }`}
          key={category.value}
          onClick={() => onChange(category.value)}
          type="button"
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
