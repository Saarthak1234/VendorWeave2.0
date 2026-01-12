import mongoose, { Schema } from "mongoose";

const FirmSchema = new mongoose.Schema({
    firmName:{ 
        type: String,
        required: true,
    },
    //Add owner/admin/user ID reference later
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

const Firm = mongoose.model("Firm", FirmSchema);
export default Firm