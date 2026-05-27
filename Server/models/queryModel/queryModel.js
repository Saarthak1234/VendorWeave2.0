import mongoose, { Schema } from "mongoose";

const querySchema = new mongoose.Schema({
    firmId: {
        type: Schema.Types.ObjectId,
        ref: "Firm",
        required: true
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },

    rawData: {
        deliveryMetrics: {
            totalDeliveries: { type: Number, default: 0 },
            onTimeDeliveries: { type: Number, default: 0 },
            slaBreachedDeliveries: { type: Number, default: 0 },
            averageDelay: { type: Number, default: 0 },
            onTimePercentage: { type: Number, default: 0 },
        },
        qualityMetrics: {
            averageQualityVariance: { type: Number, default: 0 },
            qualityScore: { type: Number, default: 0 },
        },
        complaintMetrics: {
            totalComplaints: { type: Number, default: 0 },
            averageResolutionTime: { type: Number, default: 0 },
            complaintRate: { type: Number, default: 0 },
        },
        healthScoreBreakdown: {
            baseScore: { type: Number, default: 0 },
            onTimeBonus: { type: Number, default: 0 },
            slaBreachPenalty: { type: Number, default: 0 },
            qualityPenalty: { type: Number, default: 0 },
            complaintPenalty: { type: Number, default: 0 },
            finalScore: { type: Number, default: 0 },
        },
        deliveryRecords: [
            {
                deliveryDate: String,
                actualDeliveryDate: String,
                promisedSLA: Number,
                qualityVariance: Number,
                hasComplaint: Boolean,
                resolutionTime: Number,
                deliveryDelay: Number,
                slaBreached: Boolean,
            }
        ],
        queryType: {
            type: String,
            enum: ["performance", "healthScore", "slaCompliance"],
        },
        filteredBy: {
            type: Object,
            default: {}
        }
    },

    score: {
        type: Number,
        required: true,
        default: 0
    }

}, { timestamps: true });

querySchema.index({ firmId: 1, vendorId: 1 });

const Query = mongoose.model("Query", querySchema);

export default Query;
