import React, { useState, useEffect } from "react";
import "./ProductsPage.scss";

import ProductsList from "../../components/ProductsList";
import ProductModal from "../../components/ProductModal";
import Filters from "../../components/Filters";
import { api } from "../../api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    minPrice: "",
    maxPrice: "",
    inStock: false
  });

  // Загрузка товаров
  useEffect(() => {
    loadProducts();
  }, []);

  // Фильтрация товаров
  useEffect(() => {
    filterProducts();
  }, [products, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      
      // Извлекаем уникальные категории
      const uniqueCategories = [...new Set(data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
      alert("Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Фильтр по категории
    if (filters.category !== "all") {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Фильтр по поиску
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Фильтр по цене (мин)
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    }

    // Фильтр по цене (макс)
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    }

    // Только в наличии
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const openCreate = () => {
    setModalMode("create");
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode("edit");
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Вы уверены, что хотите удалить товар?");
    if (!ok) return;

    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Ошибка удаления товара");
    }
  };

  const handleSubmitModal = async (payload) => {
    try {
      if (modalMode === "create") {
        const newProduct = await api.createProduct(payload);
        setProducts(prev => [...prev, newProduct]);
      } else {
        const updatedProduct = await api.updateProduct(payload.id, payload);
        setProducts(prev => prev.map(p => p.id === payload.id ? updatedProduct : p));
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения товара");
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="brand">🛒 TechStore</div>
          <div className="header__right">
            <span className="stats">Товаров: {products.length}</span>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="toolbar">
            <h1 className="title">Каталог товаров</h1>
            <button className="btn btn--primary" onClick={openCreate}>
              + Добавить товар
            </button>
          </div>

          <Filters 
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
            <div className="empty">Загрузка...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty">
              {products.length === 0 
                ? "Товаров пока нет" 
                : "Товары не найдены по выбранным фильтрам"}
            </div>
          ) : (
            <ProductsList 
              products={filteredProducts}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          © {new Date().getFullYear()} TechStore. Все права защищены.
        </div>
      </footer>

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}
