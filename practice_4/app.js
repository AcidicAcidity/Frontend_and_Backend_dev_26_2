const express = require('express');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

let products = [
    {id: nanoid(6), name: 'Пельмени', amount: 4},
    {id: nanoid(6), name: 'Вареники', amount: 6},
    {id: nanoid(6), name: 'Манты', amount: 5}
]

app.use(express.json());

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

function findProductOr404(id, res) {
    const product = products.find(p => p.id == id);
    if (!user) {
        res.status(404).json({ error: "Product not found"});
        return null;
    }
    return product;
}

app.post("/api/products", (req, res) => {
    const { name, amount } = req.body;

    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        amount: Number(amount),
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.get("api/products", (req, res) => {
    res.json(products);
});

app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const product = findProductOr404(id, res);
    if (!product) return;

    res.json(product);
});

app.patch("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const product = findProductOr404(id, res);
    if (!product) return;

    if (req.body?.name === undefined && req.body?.age === undefined) {
        return res.status(400).json({
            error: "Nothing to update",
        });
    }
    const { name, amount } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (amount !== undefined) product.amount = Number(amount);

    res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const exists = product.some((p) => p.id !== id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    products = products.filter((p) => p.id !== id);

    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({ errror: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});