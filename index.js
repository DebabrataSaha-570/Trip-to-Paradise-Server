const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.imkxn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db("TripToParadiseNew");
        const serviceCollection = database.collection("services");
        const bookingCollection = database.collection("bookings");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.json(services)
        })
        app.get('/service/:id', async (req, res) => {
            const serviceId = req.params.id;
            const query = { _id: ObjectId(serviceId) }
            const service = await serviceCollection.findOne(query)
            res.json(service)
        })
        app.get('/bookings', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = bookingCollection.find(query)
            console.log('cursor', cursor)
            const bookings = await cursor.toArray()
            console.log('bookings', bookings)
            res.json(bookings)

        })
        app.get('/allBookings', async (req, res) => {
            const cursor = bookingCollection.find({})
            const bookings = await cursor.toArray()
            res.json(bookings)
        })
        //POST API
        app.post('/addService', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })

        app.post('/addBooking', async (req, res) => {
            const bookings = req.body;
            const result = await bookingCollection.insertOne(bookings);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)

        })
        //UPDATE API
        app.put('/approveOrder/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const body = req.body;
            console.log(body)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    status: body.status
                }
            }
            const result = await bookingCollection.updateOne(filter, updateDoc, options)
            console.log(result)
            res.json(result)

        })
        // DELETE API
        app.delete('/cancelService/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            console.log(result)
            res.json(result)

        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Trip to paradise Server')
})


app.listen(port, () => {
    console.log('Trip to paradise server listening at', port)
})