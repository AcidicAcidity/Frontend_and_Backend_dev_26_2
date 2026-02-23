const express = require('express');
const app = express();
const port = 3000;

let products = [
    {id: 1, name: 'Предмет1', cost: 2400},
    {id: 2, name: 'Предмет2', cost: 4200},
    {id: 3, name: 'Предмет3', cost: 1300},
]

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Главная страница');
    console.log("Открыта Главная Страница");
});

app.post('/products', (res, req) => {
    const { name, cost } = req.body;

    const newProduct = {
        id: Date.now(),
        name,
        cost
    };

    user.push(newProduct);
    res.statusCode(201).json(newProduct);
});

app.get('/products', (res, req) => {
    res.send(JSON.stringify(products));
});

app.get('/products/:id', (res, req) => {
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

app.delete('/users/:id', (res, req) => {
    products = products.filter(p => p.id != req.params.id);
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

