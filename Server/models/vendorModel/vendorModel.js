// ```
// Vendor schema

// Vendor {
//   _id
//   firmId   // reference to Firm
//   name
//   healthScore
//   points
//   computedFields...
//   createdAt
//   updatedAt
// }

// ```

import mongoose, { Schema } from "mongoose"

const vendorSchema = new mongoose.Schema({
    firmId: {
        type: Schema.Types.ObjectId,
        ref: "Firm",
        required: true
    },
    vendorName: {
        type: String,
        required: true,
    },
    healthScore: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    // computeFields: {
    //     totalQueries: { type: Number, default: 0 },
    //     positiveQueries: { type: Number, default: 0 },
    //     negativeQueries: { type: Number, default: 0 },
    //     healthScore: { type: Number, default: 0 },
    //     points: { type: Number, default: 0 },
    //     lastQueryAt: { type: Date }
    // },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})

const Vendor = mongoose.model("Vendor",vendorSchema);

export default Vendor;