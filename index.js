const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json());

console.log(process.env.DB_User)
console.log(process.env.DB_Password)


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.jktjr9b.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('moment-factory').collection('services');
        const reviewCollection = client.db('moment-factory').collection('reviews');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/home-services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).sort({ _id: -1 });
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const single_service = await serviceCollection.findOne(query);
            res.send(single_service);

        });

        // add-services

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.get('/reviewsfactory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const single_review = await reviewCollection.findOne(query);
            res.send(single_review);

        });

        app.get('/reviewsfactory/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: ObjectId(email) };
            const single_review = await reviewCollection.findOne(query);
            res.send(single_review);

        });

        // reviews api
        app.get('/reviewsfactory', async (req, res) => {
            let query = {};

            if (req.query.service_id) {
                query = {
                    service_id: req.query.service_id
                }
            }

            // if (req.query.email) {
            //     query = {
            //         email: req.query.email
            //     }
            // }

            const cursor = reviewCollection.find(query).sort({ _id: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviewsfactory', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        // my - reviews api

        app.get('/myreviews', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query).sort({ _id: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/myreviews/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: ObjectId(email) };
            const single_review = await reviewCollection.findOne(query);
            res.send(single_review);

        });

        app.delete('/myreviews/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: ObjectId(email) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


        // app.patch('/myreviews/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const message = req.body.message
        //     const query = { message: ObjectId(id) }
        //     const updatedDoc = {
        //         $set: {
        //             message: message
        //         }
        //     }
        //     const result = await reviewCollection.updateOne(query, updatedDoc);
        //     res.send(result);
        // })


        // orders api
        app.get('/orders', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await reviewCollection.insertOne(order);
            res.send(result);
        });

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })



    }
    finally {

    }

}

run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('Moments factory server is running')
})

app.listen(port, () => {
    console.log(`Moments factory server running on ${port}`);
})