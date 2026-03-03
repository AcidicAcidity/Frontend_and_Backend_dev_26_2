const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const port = 3000;

// Начальные данные магазина (10+ товаров)
let products = [
  {
    id: nanoid(8),
    name: "MacBook Pro 16",
    category: "Ноутбуки",
    description: "Apple M2 Pro, 16 ГБ RAM, 512 ГБ SSD",
    price: 2499.99,
    stock: 15,
    rating: 4.8,
    image: "https://via.placeholder.com/300x200?text=MacBook+Pro"
  },
  {
    id: nanoid(8),
    name: "iPhone 15 Pro",
    category: "Смартфоны",
    description: "6.1-дюймовый дисплей, A17 Pro, 256 ГБ",
    price: 1199.99,
    stock: 23,
    rating: 4.9,
    image: "https://via.placeholder.com/300x200?text=iPhone+15"
  },
  {
    id: nanoid(8),
    name: "Samsung Galaxy S24 Ultra",
    category: "Смартфоны",
    description: "200MP камера, S Pen, 512 ГБ",
    price: 1399.99,
    stock: 12,
    rating: 4.7,
    image: "https://via.placeholder.com/300x200?text=Galaxy+S24"
  },
  {
    id: nanoid(8),
    name: "Sony WH-1000XM5",
    category: "Наушники",
    description: "Беспроводные наушники с шумоподавлением",
    price: 399.99,
    stock: 8,
    rating: 4.9,
    image: "https://via.placeholder.com/300x200?text=Sony+Headphones"
  },
  {
    id: nanoid(8),
    name: "iPad Pro 12.9",
    category: "Планшеты",
    description: "M2 чип, 128 ГБ, Liquid Retina XDR дисплей",
    price: 1099.99,
    stock: 5,
    rating: 4.8,
    image: "https://via.placeholder.com/300x200?text=iPad+Pro"
  },
  {
    id: nanoid(8),
    name: "Logitech MX Master 3S",
    category: "Аксессуары",
    description: "Беспроводная мышь для продуктивности",
    price: 99.99,
    stock: 17,
    rating: 4.6,
    image: "https://via.placeholder.com/300x200?text=MX+Master"
  },
  {
    id: nanoid(8),
    name: "Dell XPS 15",
    category: "Ноутбуки",
    description: "Intel Core i7, 16 ГБ RAM, 512 ГБ SSD",
    price: 1899.99,
    stock: 3,
    rating: 4.5,
    image: "https://via.placeholder.com/300x200?text=Dell+XPS"
  },
  {
    id: nanoid(8),
    name: "Apple Watch Series 9",
    category: "Умные часы",
    description: "GPS + Cellular, 45 мм, алюминий",
    price: 499.99,
    stock: 11,
    rating: 4.7,
    image: "https://via.placeholder.com/300x200?text=Apple+Watch"
  },
  {
    id: nanoid(8),
    name: "Keychron K2",
    category: "Аксессуары",
    description: "Механическая клавиатура, RGB подсветка",
    price: 89.99,
    stock: 6,
    rating: 4.8,
    image: "https://via.placeholder.com/300x200?text=Keychron+K2"
  },
  {
    id: nanoid(8),
    name: "PlayStation 5",
    category: "Игровые консоли",
    description: "Цифровое издание, 825 ГБ SSD",
    price: 449.99,
    stock: 0,
    rating: 4.9,
    image: "https://via.placeholder.com/300x200?text=PS5"
  },
  {
    id: nanoid(8),
    name: "Xbox Series X",
    category: "Игровые консоли",
    description: "1 ТБ SSD, 4K гейминг",
    price: 499.99,
    stock: 2,
    rating: 4.8,
    image: "https://via.placeholder.com/300x200?text=Xbox+Series+X"
  },
  {
    id: nanoid(8),
    name: "DJI Mini 3 Pro",
    category: "Дроны",
    description: "4K камера, 34 мин полета",
    price: 759.99,
    stock: 4,
    rating: 4.7,
    image: "https://via.placeholder.com/300x200?text=DJI+Mini"
  }
];

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TechStore API Documentation',
}));

// Логирование запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

// Хелпер для поиска товара
function findProductOr404(id, res) {
  const product = products.find(p => p.id == id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/products", (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный идентификатор товара
 *         example: "abc12345"
 *     responses:
 *       200:
 *         description: Товар успешно найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название товара
 *                 example: "iPhone 15 Pro"
 *               category:
 *                 type: string
 *                 description: Категория товара
 *                 example: "Смартфоны"
 *               description:
 *                 type: string
 *                 description: Описание товара
 *                 example: "6.1-дюймовый дисплей, A17 Pro, 256 ГБ"
 *               price:
 *                 type: number
 *                 description: Цена товара
 *                 example: 1199.99
 *               stock:
 *                 type: integer
 *                 description: Количество на складе
 *                 example: 23
 *               rating:
 *                 type: number
 *                 description: Рейтинг (опционально)
 *                 example: 4.9
 *               image:
 *                 type: string
 *                 description: URL изображения (опционально)
 *                 example: "https://via.placeholder.com/300x200?text=iPhone"
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации (отсутствуют обязательные поля)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/api/products", (req, res) => {
  const { name, category, description, price, stock, rating, image } = req.body;

  if (!name || !category || !description || !price || stock === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newProduct = {
    id: nanoid(8),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
    rating: rating ? Number(rating) : 0,
    image: image || "https://via.placeholder.com/300x200?text=New+Product"
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить информацию о товаре
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара для обновления
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 description: Новое название
 *               category:
 *                 type: string
 *                 description: Новая категория
 *               description:
 *                 type: string
 *                 description: Новое описание
 *               price:
 *                 type: number
 *                 description: Новая цена
 *               stock:
 *                 type: integer
 *                 description: Новое количество
 *               rating:
 *                 type: number
 *                 description: Новый рейтинг
 *               image:
 *                 type: string
 *                 description: Новый URL изображения
 *     responses:
 *       200:
 *         description: Товар успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;

  if (req.body?.name === undefined && req.body?.category === undefined &&
      req.body?.description === undefined && req.body?.price === undefined &&
      req.body?.stock === undefined && req.body?.rating === undefined &&
      req.body?.image === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const { name, category, description, price, stock, rating, image } = req.body;

  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Number(rating);
  if (image !== undefined) product.image = image;

  res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара для удаления
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет содержимого)
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const exists = products.some(p => p.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Product not found" });
  }

  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
  console.log(`📚 Документация API: http://localhost:${port}/api-docs`);
  console.log(`📦 Всего товаров: ${products.length}`);
});