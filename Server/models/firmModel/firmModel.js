import mongoose, { Schema } from "mongoose";

const FirmSchema = new mongoose.Schema({
    firmName:{ 
        type: String,
        required: true,
        trim:true,
    },
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
        // select: false, //Hides field from query results
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

const Firm = mongoose.model("Firm", FirmSchema);
export default Firm;