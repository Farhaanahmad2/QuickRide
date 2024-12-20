import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import userRoutes from './routes/userRoutes.js'
import { connectDB } from './db/connectDb.js';



const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())


app.use("/api/user", userRoutes)

app.listen(PORT,(req,res)=>{
  connectDB();
  console.log(`port listning at port ${PORT}`);

})