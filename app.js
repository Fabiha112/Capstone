import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import connectDB from './config/connectdb.js'
import userRoutes from './routes/userRoutes.js'
//import mongoose from 'mongoose';
import mongoose from 'mongoose';
const app = express()
const port = process.env.PORT ||8000;
const DATABASE_URL = process.env.DATABASE_URL

//cors Policy
app.use(cors())


//Database Connection
connectDB(DATABASE_URL)

//JSON
app.use(express.json())

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.log('MongoDB connection error:',err))

//Load Routes
app.use("/api/user", userRoutes);
console.log("User routes loaded"); // Debugging purpose


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
}) 