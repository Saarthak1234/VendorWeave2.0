import Firm from "../../models/firmModel/firmModel.js";
import Vendor from "../../models/vendorModel/vendorModel.js";
import Query from "../../models/queryModel/queryModel.js";

const evaluateVendorPerformance = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { firmId } = req.params;
        const { deliveryRecords, queryType } = req.body; 

        // 1. Verify Authorization
        const checkFirm = await Firm.findOne({ _id: firmId, adminId: req.user.id });
        if (!checkFirm) {
            return res.status(401).json({ message: "Unauthorized or Firm does not exist" });
        }

        // 2. Verify Vendor exists under this firm
        const vendor = await Vendor.findOne({ _id: vendorId, firmId: firmId });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found in this firm" });
        }

        if (!deliveryRecords || !Array.isArray(deliveryRecords) || deliveryRecords.length === 0) {
            return res.status(400).json({ message: "Please provide valid deliveryRecords array" });
        }

        // 3. Compute Metrics
        const totalDeliveries = deliveryRecords.length;
        let onTimeDeliveries = 0;
        let slaBreachedDeliveries = 0;
        let totalDelay = 0;
        let totalQualityVariance = 0;
        let totalComplaints = 0;
        let totalResolutionTime = 0;

        deliveryRecords.forEach(record => {
            if (record.slaBreached) slaBreachedDeliveries++;
            else onTimeDeliveries++;
            
            if (record.deliveryDelay && record.deliveryDelay > 0) totalDelay += record.deliveryDelay;
            if (record.qualityVariance) totalQualityVariance += record.qualityVariance;
            if (record.hasComplaint) {
                totalComplaints++;
                if (record.resolutionTime) totalResolutionTime += record.resolutionTime;
            }
        });

        const onTimePercentage = (onTimeDeliveries / totalDeliveries) * 100;
        const averageDelay = slaBreachedDeliveries > 0 ? (totalDelay / slaBreachedDeliveries) : 0;
        const averageQualityVariance = totalQualityVariance / totalDeliveries;
        const complaintRate = (totalComplaints / totalDeliveries) * 100;
        const averageResolutionTime = totalComplaints > 0 ? (totalResolutionTime / totalComplaints) : 0;

        // 4. Calculate Health Score Breakdown
        const baseScore = 100;
        
        // Penalties Algorithm
        const slaBreachPenalty = slaBreachedDeliveries * 2; 
        const qualityPenalty = averageQualityVariance * 5; 
        const complaintPenalty = totalComplaints * 3; 
        
        // Bonuses Algorithm
        const onTimeBonus = onTimePercentage === 100 ? 5 : 0; 

        let finalScore = baseScore + onTimeBonus - slaBreachPenalty - qualityPenalty - complaintPenalty;
        finalScore = Math.max(0, Math.min(100, Math.round(finalScore))); // Clamp between 0 and 100

        // 5. Construct the Query Document
        const queryData = new Query({
            firmId,
            vendorId,
            rawData: {
                deliveryMetrics: {
                    totalDeliveries,
                    onTimeDeliveries,
                    slaBreachedDeliveries,
                    averageDelay,
                    onTimePercentage
                },
                qualityMetrics: {
                    averageQualityVariance,
                    qualityScore: Math.max(0, 100 - qualityPenalty)
                },
                complaintMetrics: {
                    totalComplaints,
                    averageResolutionTime,
                    complaintRate
                },
                healthScoreBreakdown: {
                    baseScore,
                    onTimeBonus,
                    slaBreachPenalty,
                    qualityPenalty,
                    complaintPenalty,
                    finalScore
                },
                deliveryRecords,
                queryType: queryType || "performance"
            },
            score: finalScore
        });

        await queryData.save();

        // 6. Backpropagate logic to update Vendor
        // Adjust the overall healthScore using a moving average
        vendor.healthScore = Math.round((vendor.healthScore + finalScore) / 2);
        
        // Adjust points based on tier
        if (finalScore >= 90) vendor.points += 20;
        else if (finalScore >= 70) vendor.points += 10;
        else if (finalScore < 50) vendor.points = Math.max(0, vendor.points - 10);
        
        await vendor.save();

        return res.status(200).json({
            message: "Vendor performance evaluated and scores updated successfully",
            queryResult: queryData,
            updatedVendor: vendor
        });

    } catch (error) {
        console.error("Error in evaluateVendorPerformance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getVendorQueries = async (req, res) => {
    try {
        const { vendorId, firmId } = req.params;
        
        const checkFirm = await Firm.findOne({ _id: firmId, adminId: req.user.id });
        if (!checkFirm) {
            return res.status(401).json({ message: "Unauthorized or Firm does not exist" });
        }

        const queries = await Query.find({ firmId, vendorId }).sort({ createdAt: -1 });
        return res.status(200).json({ message: "Queries fetched successfully", queries });
    } catch (error) {
        console.error("Error in getVendorQueries:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const bulkEvaluateVendors = async (req, res) => {
    try {
        const { firmId } = req.params;
        const { bulkData, queryType } = req.body; 

        // 1. Verify Authorization
        const checkFirm = await Firm.findOne({ _id: firmId, adminId: req.user.id });
        if (!checkFirm) {
            return res.status(401).json({ message: "Unauthorized or Firm does not exist" });
        }

        if (!bulkData || !Array.isArray(bulkData) || bulkData.length === 0) {
            return res.status(400).json({ message: "Please provide valid bulkData array" });
        }

        const results = [];

        // 2. Process each vendor's data in the CSV/bulk payload
        for (const data of bulkData) {
            const { vendorName, deliveryRecords } = data;

            if (!vendorName || !deliveryRecords || !Array.isArray(deliveryRecords)) {
                results.push({ vendorName: vendorName || "Unknown", status: "Failed", reason: "Invalid data format" });
                continue;
            }

            // 🚨 FRONTEND TESTING NOTE: 
            // This block auto-creates missing vendors during CSV import.
            // When connecting to frontend, ensure the CSV parser passes "vendorName" correctly!
            let vendor = await Vendor.findOne({ vendorName, firmId });
            
            if (!vendor) {
                // Vendor doesn't exist, create them automatically with defaults
                vendor = new Vendor({
                    vendorName,
                    firmId,
                    healthScore: 100,
                    points: 0
                });
                await vendor.save();
            }

            // --- EVALUATION LOGIC ---
            const totalDeliveries = deliveryRecords.length;
            if (totalDeliveries === 0) {
                results.push({ vendorName, status: "Skipped", reason: "No delivery records" });
                continue;
            }

            let onTimeDeliveries = 0, slaBreachedDeliveries = 0, totalDelay = 0;
            let totalQualityVariance = 0, totalComplaints = 0, totalResolutionTime = 0;

            deliveryRecords.forEach(record => {
                if (record.slaBreached) slaBreachedDeliveries++;
                else onTimeDeliveries++;
                if (record.deliveryDelay && record.deliveryDelay > 0) totalDelay += record.deliveryDelay;
                if (record.qualityVariance) totalQualityVariance += record.qualityVariance;
                if (record.hasComplaint) {
                    totalComplaints++;
                    if (record.resolutionTime) totalResolutionTime += record.resolutionTime;
                }
            });

            const onTimePercentage = (onTimeDeliveries / totalDeliveries) * 100;
            const averageDelay = slaBreachedDeliveries > 0 ? (totalDelay / slaBreachedDeliveries) : 0;
            const averageQualityVariance = totalQualityVariance / totalDeliveries;
            const complaintRate = (totalComplaints / totalDeliveries) * 100;
            const averageResolutionTime = totalComplaints > 0 ? (totalResolutionTime / totalComplaints) : 0;

            const baseScore = 100;
            const slaBreachPenalty = slaBreachedDeliveries * 2; 
            const qualityPenalty = averageQualityVariance * 5; 
            const complaintPenalty = totalComplaints * 3; 
            const onTimeBonus = onTimePercentage === 100 ? 5 : 0; 

            let finalScore = baseScore + onTimeBonus - slaBreachPenalty - qualityPenalty - complaintPenalty;
            finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));

            const queryData = new Query({
                firmId,
                vendorId: vendor._id,
                rawData: {
                    deliveryMetrics: { totalDeliveries, onTimeDeliveries, slaBreachedDeliveries, averageDelay, onTimePercentage },
                    qualityMetrics: { averageQualityVariance, qualityScore: Math.max(0, 100 - qualityPenalty) },
                    complaintMetrics: { totalComplaints, averageResolutionTime, complaintRate },
                    healthScoreBreakdown: { baseScore, onTimeBonus, slaBreachPenalty, qualityPenalty, complaintPenalty, finalScore },
                    deliveryRecords,
                    queryType: queryType || "performance"
                },
                score: finalScore
            });

            await queryData.save();

            // Backpropagate logic to update Vendor
            vendor.healthScore = Math.round((vendor.healthScore + finalScore) / 2);
            if (finalScore >= 90) vendor.points += 20;
            else if (finalScore >= 70) vendor.points += 10;
            else if (finalScore < 50) vendor.points = Math.max(0, vendor.points - 10);
            await vendor.save();

            results.push({ vendorName, status: "Success", newHealthScore: vendor.healthScore });
        }

        return res.status(200).json({
            message: "Bulk evaluation completed",
            results
        });

    } catch (error) {
        console.error("Error in bulkEvaluateVendors:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { evaluateVendorPerformance, getVendorQueries, bulkEvaluateVendors };
