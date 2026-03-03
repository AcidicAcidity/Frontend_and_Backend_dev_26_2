import React from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
  const getStockClass = () => {
    if (product.stock === 0) return "productCard__stock--out";
    if (product.stock < 5) return "productCard__stock--low";
    return "productCard__stock--in";
  };

  const getStockText = () => {
    if (product.stock === 0) return "Нет в наличии";
    if (product.stock < 5) return `Осталось ${product.stock} шт.`;
    return `В наличии: ${product.stock} шт.`;
  };

  const renderRating = () => {
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }
    if (halfStar) {
      stars.push("½");
    }
    while (stars.length < 5) {
      stars.push("☆");
    }

    return stars.join("");
  };

  return (
    <div className="productCard">
      <div className="productCard__content">
        <div className="productCard__header">
          <h3 className="productCard__name">{product.name}</h3>
          <span className="productCard__category">{product.category}</span>
        </div>

        <p className="productCard__description">{product.description}</p>

        <div className="productCard__rating">
          <span className="stars">{renderRating()}</span>
          <span>({product.rating})</span>
        </div>

        <div className="productCard__details">
          <span className="productCard__price">${product.price}</span>
          <span className={`productCard__stock ${getStockClass()}`}>
            {getStockText()}
          </span>
        </div>

        <div className="productCard__actions">
          <button className="btn" onClick={() => onEdit(product)}>
            ✏️ Редактировать
          </button>
          <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
            🗑️ Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
