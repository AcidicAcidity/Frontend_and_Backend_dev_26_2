const express = require('express');
const app = express();
const port = 3000;

let products = [
    {id: 1, name: 'Открывашка', cost: 2400},
    {id: 2, name: 'Закрывашка', cost: 4200},
    {id: 3, name: 'Разбивашка', cost: 1300},
]

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Главная страница');
    console.log("Открыта Главная Страница");
});

app.post('/products', (req, res) => {
    const { name, cost } = req.body;

    const newProduct = {
        id: Date.now(),
        name,
        cost
    };

    user.push(newProduct);
    res.statusCode(201).json(newProduct);
});

app.get('/products', (req, res) => {
    res.send(JSON.stringify(products));
});

app.get('/products/:id', (req, res) => {
    let product = products.find(p => p.id == req.params.id);
    res.send(JSON.stringify(product));
});

app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    const {name, cost } = req.body;

    if (name !== undefined) product.name = name;
    if (cost !== undefined) product.cost = cost;

    res.json(product);
});

app.delete('/users/:id', (req, res) => {
    products = products.filter(p => p.id != req.params.id);
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

