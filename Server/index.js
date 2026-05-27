import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import connectDB from './utils/db.connect.js';
import FirmRouter from './routes/firmRoutes/firm.routes.js';
import vendorRouter from './routes/vendorRoutes/vendor.routes.js';
import authRouter from './routes/authRoutes/auth.routes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello world");
})

app.use('/auth', authRouter);
app.use('/firm', FirmRouter);

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`)
})