const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

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