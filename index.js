const express =require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
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
// jwt fun
 function veryfiyJwt(req,res,next){
    const authHaders = req.headers.authorization;
    if(!authHaders){
       return res.status(401).send({message:'not authorized'})
    }
    const token = authHaders.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(error,decoded){
        if(error){
           return res.status(403).send({message:'forbidden access'})
        }
        req.decoded = decoded;
        next();
    })
    
 }
async function run(){
    try{
        const serviceCollection = client.db("doctorA11").collection("services");
        const reviewCollection = client.db("doctorA11").collection("review");
        const orderServiceCollection = client.db("doctorA11").collection('orderedService')
        app.post('/jwt',(req,res)=>{
            const user=req.body;
            console.log(user)
            const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
            res.send({token})
        })
        app.get('/services',async(req,res)=>{
            const query= {}
            const cursor = serviceCollection.find(query)
            const services=await cursor.toArray();
            res.send(services)
        })
        // limit api
        app.get('/service',async(req,res)=>{
            const query= {}
            const cursor = serviceCollection.find(query)
            const services=await cursor.limit(3).toArray();
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



app.get('/addServices',async(req,res)=>{
    const query={}
   
    const cursor = orderServiceCollection.find(query)
    const orderService = await cursor.toArray()
    res.send(orderService)
})



// limit addervice api
app.get('/addService',async(req,res)=>{
    let query={}
    if(req.query.email){
         query={
            email:req.query.email
         }
    }
    const cursor = orderServiceCollection.find(query)
    const orderService = await cursor.limit(3).toArray()
    res.send(orderService)
})


 // all reviews=======
 app.get('/reviews',async(req,res)=>{
   
    let query={ }
        
     cursor = reviewCollection.find(query)
       
    const review = await cursor.sort({date : -1}) .toArray()
    res.send(review)
})

// get particular review id
app.get('/reviews/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)}
    const result = await reviewCollection.findOne(query)
    res.send(result);
})

        // get specific user review from database
        app.get('/review',veryfiyJwt,async(req,res)=>{
            const decoded=req.decoded;
            console.log('inside review api',decoded)
            if(decoded.email !==req.query.email){
                res.status(403).send({message: 'unauthorized access'})
            }
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




        



        // create review delete api
        app.delete('/review/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result);
        })
        // updater review

        app.put('/reviews/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id)
            console.log(req.body)
            const filter= {_id:ObjectId(id)}
            const options = { upsert: true };
            const updatedReviw = {
                $set:{
                    message:req.body.message
                 }
            }
            
            // console.log(updatedReviw)
            const result = await reviewCollection.updateOne(filter,updatedReviw,options)
            res.send(result)
        })        
    }
    finally{
       
    }    
}
run().catch(error=>console.log(error))




app.listen(port,()=>{
    console.log(`assignment runing port ${port}`)
})


