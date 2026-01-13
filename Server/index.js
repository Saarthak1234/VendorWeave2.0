import express from 'express';
import dotenv from 'dotenv'
import connectDB from './utils/db.connect.js';
import FirmRouter from './routes/firmRoutes/firm.Routes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello world");
})

app.use('/firm',FirmRouter);

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`)
})