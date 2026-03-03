const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechStore API',
      version: '1.0.0',
      description: 'API для интернет-магазина электроники',
      contact: {
        name: 'TechStore Support',
        url: 'http://localhost:3001',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'http://localhost:3000/api',
        description: 'API server',
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'Управление товарами',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'category', 'description', 'price', 'stock'],
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор товара',
              example: 'abc12345',
            },
            name: {
              type: 'string',
              description: 'Название товара',
              example: 'MacBook Pro 16',
            },
            category: {
              type: 'string',
              description: 'Категория товара',
              example: 'Ноутбуки',
            },
            description: {
              type: 'string',
              description: 'Описание товара',
              example: 'Apple M2 Pro, 16 ГБ RAM, 512 ГБ SSD',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Цена товара',
              example: 2499.99,
            },
            stock: {
              type: 'integer',
              description: 'Количество на складе',
              example: 15,
            },
            rating: {
              type: 'number',
              format: 'float',
              description: 'Рейтинг товара (0-5)',
              example: 4.8,
            },
            image: {
              type: 'string',
              description: 'URL изображения товара',
              example: 'https://via.placeholder.com/300x200?text=Product',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Сообщение об ошибке',
              example: 'Product not found',
            },
          },
        },
      },
    },
  },
  // Путь к файлам с API маршрутами для чтения JSDoc комментариев
  apis: ['./app.js'], // указываем, где искать JSDoc комментарии
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;