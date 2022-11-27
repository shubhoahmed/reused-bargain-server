const express = require('express');
const jwt = require("jsonwebtoken")
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

//midleware...
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.snnxp9j.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('reused-bargain').collection('user');
        const categoryCollection = client.db('reused-bargain').collection('cars-category');
        const productCollection = client.db('reused-bargain').collection('products');

        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoryCollection.find(query).toArray();
            console.log(result);
            res.send(result);
        });

        app.get('/products/:categoryId', async (req, res) => {
            const query = { categoryId: req.params.categoryId };
            const result = await productCollection.find(query).toArray();
            console.log(result);
            res.send(result);
        })
        app.get('/user', async (req, res) => {
            const query = {};
            const options = await userCollection.find(query).toArray();
            res.send(options);
        })
        app.post("/user", async (req, res) => {
            const result = await userCollection.insertOne(req.body)
        })
    }
    finally {

    }
}
run().catch(console.log)



app.get('/', async (req, res) => {
    res.send('Reused Bargain server is running...')
})

app.listen(port, () => console.log(`Reused Bargain running on ${port}`));