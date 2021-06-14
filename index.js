const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const port = 5000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uqyqt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    const products = client.db('emaJhonDb').collection('items');
    const orders = client.db('emaJhonDb').collection('orders');

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        products.insertOne(product).then((result) => {
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        });
    });

    app.get('/products', (req, res) => {
        products.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });
    app.get('/product/:key', (req, res) => {
        products.find({ key: req.params.key }).toArray((err, documents) => {
            res.send(documents[0]);
        });
    });
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        products
            .find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orders.insertOne(order).then((result) => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });

    console.log('connected successfully ');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('connected');
});

app.listen(process.env.PORT || port);
