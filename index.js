const express =require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();
// middle ware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('assingment server runing')
})

// monogo db confi


const uri = `mongodb+srv://${process.env.DV_USER_NAME}:${process.env.USER_PASSWORD}@cluster0.4jfewjr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

async function run(){
    try{
        const serviceCollection = client.db("doctorA11").collection("services");
        const reviewCollection = client.db("doctorA11").collection("review");

        app.get('/services',async(req,res)=>{
            const query= {}
            const cursor = serviceCollection.find(query)
            const services=await cursor.toArray();
            res.send(services)
        })
        
        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id
            const query= {_id:ObjectId(id)}
            const services= await serviceCollection.findOne(query)
            
            res.send(services)
        })

        app.post('/review',async(req,res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })
    }
    finally{
       
    }    
}
run().catch(error=>consol.log(error))




app.listen(port,()=>{
    console.log(`assignment runing port ${port}`)
})