const express =require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
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






app.listen(port,()=>{
    console.log(`assignment runing port ${port}`)
})