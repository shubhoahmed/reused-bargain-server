const express = require('express');
const jwt = require("jsonwebtoken")
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();

//This is for middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.snnxp9j.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('reused-bargain').collection('users');
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
        });

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '2h' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
        });

        app.get('/users', async (req, res) => {
            const query = { email: req.query.email };
            const user = await usersCollection.findOne(query)
            res.send(user);
        });
        app.post("/users", async (req, res) => {
            const user = await usersCollection.findOne({ email: req.body.email });

            if (user) {
                console.log(user)
                return res.send(user);
            }
            const result = await usersCollection.insertOne(req.body)
            res.send(result)
        });
    }
    finally {

    }
}
run().catch(console.log)



app.get('/', async (req, res) => {
    res.send('Reused Bargain server is running...')
})

app.listen(port, () => console.log(`Reused Bargain running on ${port}`));