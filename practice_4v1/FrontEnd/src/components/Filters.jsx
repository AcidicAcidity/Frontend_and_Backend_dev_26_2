import React from "react";

export default function Filters({ categories, filters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange({
      [name]: type === "checkbox" ? checked : value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: "all",
      search: "",
      minPrice: "",
      maxPrice: "",
      inStock: false
    });
  };

  return (
    <div className="filters">
      <div className="filters__row">
        <div className="filters__group">
          <label className="filters__label">Поиск</label>
          <input
            type="text"
            name="search"
            className="filters__input"
            placeholder="Название или описание..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <div className="filters__group">
          <label className="filters__label">Категория</label>
          <select
            name="category"
            className="filters__select"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="all">Все категории</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filters__group">
          <label className="filters__label">Цена от</label>
          <input
            type="number"
            name="minPrice"
            className="filters__input"
            placeholder="0"
            min="0"
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>

        <div className="filters__group">
          <label className="filters__label">Цена до</label>
          <input
            type="number"
            name="maxPrice"
            className="filters__input"
            placeholder="10000"
            min="0"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>

        <button className="filters__clear" onClick={clearFilters}>
          Сбросить
        </button>
      </div>

      <label className="filters__checkbox">
        <input
          type="checkbox"
          name="inStock"
          checked={filters.inStock}
          onChange={handleChange}
        />
        Только в наличии
      </label>
    </div>
  );
}
