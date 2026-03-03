import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    rating: "",
    image: ""
  });

  useEffect(() => {
    if (!open) return;
    
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || "",
        category: initialProduct.category || "",
        description: initialProduct.description || "",
        price: initialProduct.price || "",
        stock: initialProduct.stock || "",
        rating: initialProduct.rating || "",
        image: initialProduct.image || ""
      });
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        rating: "",
        image: ""
      });
    }
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === "edit" ? "Редактирование товара" : "Добавление товара";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      price: formData.price ? Number(formData.price) : 0,
      stock: formData.stock ? Number(formData.stock) : 0,
      rating: formData.rating ? Number(formData.rating) : 0,
      image: formData.image.trim()
    };

    // Валидация
    if (!trimmed.name) {
      alert("Введите название товара");
      return;
    }

    if (!trimmed.category) {
      alert("Введите категорию");
      return;
    }

    if (!trimmed.description) {
      alert("Введите описание");
      return;
    }

    if (!trimmed.price || trimmed.price <= 0) {
      alert("Введите корректную цену");
      return;
    }

    if (trimmed.stock < 0) {
      alert("Введите корректное количество");
      return;
    }

    if (trimmed.rating < 0 || trimmed.rating > 5) {
      alert("Рейтинг должен быть от 0 до 5");
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      ...trimmed
    });
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название *
            <input
              className="input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Например, MacBook Pro"
              autoFocus
            />
          </label>

          <label className="label">
            Категория *
            <input
              className="input"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Например, Ноутбуки"
            />
          </label>

          <label className="label">
            Описание *
            <textarea
              className="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Краткое описание товара..."
              rows="3"
            />
          </label>

          <div className="form__row">
            <label className="label">
              Цена ($) *
              <input
                className="input"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="199.99"
              />
            </label>

            <label className="label">
              Количество *
              <input
                className="input"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
              />
            </label>
          </div>

          <div className="form__row">
            <label className="label">
              Рейтинг (0-5)
              <input
                className="input"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                placeholder="4.5"
              />
            </label>

            <label className="label">
              URL изображения
              <input
                className="input"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>
          </div>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === "edit" ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
