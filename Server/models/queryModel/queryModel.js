import mongoose, { Schema } from "mongoose";

const querySchema = new mongoose.Schema({
    firmId:{
        type:Schema.Types.ObjectId,
        ref:"Firm",
        required:true
    },
    vendorId:{
        type:Schema.Types.ObjectId,
        ref:"Vendor",
        required:true
    },
    // rawData:{

    // },
    score:{
        type:Number,
        required:true,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }

})

const Query = mongoose.model("query",querySchema)

export default Query
