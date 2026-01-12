import express from 'express';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.get('/',(req,res)=>{
    res.send("Hello world");
})

// app.use("/firm",firmRoutes)

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`)
})