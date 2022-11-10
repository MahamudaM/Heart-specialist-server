const express =require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
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

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

async function run(){
    try{
        const serviceCollection = client.db("doctorA11").collection("services");
        const reviewCollection = client.db("doctorA11").collection("review");
        const orderServiceCollection = client.db("doctorA11").collection('orderedService')
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
        // create api for add service
app.post('/addService',async(req,res)=>{
    const services = req.body;
    const result = await orderServiceCollection.insertOne(services)
    res.send(result)
})

// get specific user review from database
app.get('/addService',async(req,res)=>{
    let query={}
    if(req.query.email){
         query={
            email:req.query.email
         }
    }
    const cursor = orderServiceCollection.find(query)
    const orderService = await cursor.toArray()
    res.send(orderService)
})

        // get specific user review from database
        app.get('/review',async(req,res)=>{
            let query={}
            if(req.query.email){
                 query={
                    email:req.query.email
                 }
            }
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })

// create review api to send database
        app.post('/review',async(req,res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);           
            res.send( result);
        })




        // get all review by id
        // app.get('/review/:id',async(req,res)=>{
        //     const id=req.params.id
        //     const query= {_id:ObjectId(id)}
        //     const result= await reviewCollection.findOne(query)
            
        //     res.send(result)
        // })



        // create review delete api
        app.delete('/review/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result);
        })
        // updater review

        app.patch('/review/:id',async(req,res)=>{
            const id = req.params.id;
            // const status = req.body.message
            const query = {_id:ObjectId(id)}
            const updatedDoc = {
                $set:{message:req.body.message}
            }
            const result = await reviewCollection.updateOne(query,updatedDoc)
            res.send(result)
        })















        // app.patch('/review/:id',async(req,res)=>{
        //     const id = req.params.id;
        //     const status = req.body.status
        //     const query = {_id:ObjectId(id)}
        //     const updatedDoc = {
        //         $set:{
        //             status:status
        //         }
        //     }
        //     const result = await reviewCollection.updateOne(query,updatedDoc)
        //     res.send(result)
        // })
    }
    finally{
       
    }    
}
run().catch(error=>consol.log(error))




app.listen(port,()=>{
    console.log(`assignment runing port ${port}`)
})