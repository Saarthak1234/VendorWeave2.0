import Vendor from "../../models/vendorModel/vendorModel.js";
import dotenv from 'dotenv'

dotenv.config();

//Vendor routes to create: createVendor, updateVendor, deleteVendor, getVendorByFirmId, getVendorsByFir mId

const createVendor = async (req, res) => {
    try {
        const { name, healthScore, points } = req.body;
        const parentFirmId = req.params.firmId

        //Optional : Check if this firm exists or not?

        //Add validations for creating vendor
        const checkVendorExists = await Vendor.findOne({ vendorName: name, firmId: parentFirmId });
        if (checkVendorExists !== null) {
            console.log("Vendor with same details already exists")
            return res.status(400).json({ message: "Error creating vendor: Vendor with same details already exists" });
        }

        console.log(healthScore)

        if (healthScore < 0 || healthScore > 100) {
            console.log("Please provide a valid healthScore")
            return res.status(400).json({ message: "Invalid health score" })
        }

        //Check and update the required bound for points in future

        if (points < 0) {
            console.log("Invalid points")
            return res.status(400).json({ message: "Invalid points" })
        }

        //Creating a new Vendor

        const vendor = new Vendor({
            firmId: parentFirmId,
            vendorName: name,
            healthScore: healthScore,
            points: points
        })

        //Saving the new vendor to the database

        const newVendor = await vendor.save()

        return res.status(200).json({ message: "Vendor successfully created", newVendor })
    } catch (error) {
        console.log("Error in creating vendor: ", error);
        return res.status(500).json({ message: "Internal Server error: Error while creating vendor" });
    }
}

const updateVendor = async (req, res) => {
    try {
        const { name, updatedName, updatedHealthScore, updatedPoints } = req.body;
        const parentFirmId = req.params.firmId
        const checkVendorExists = await Vendor.findOne({ vendorName: name, firmId: parentFirmId })
        if (!checkVendorExists) {
            console.log("Vendor does not exist in this firm");
            return res.status(400).json({ message: "Error updating vendor : Vendor does not exist" });
        }

        if(checkVendorExists.vendorName == updatedName){
            console.log("Cannot enter the same name for the vendor")
            return res.status(400).json({message:"Error updating vendor : Cannot enter the same name"})
        }

        if(updatedHealthScore < 0 || updatedHealthScore > 100){
            console.log("Please enter a valid health score")
            return res.status(400).json({message: "Error updating vendor : Please enter a valid healthscore"})
        }

        if(updatedPoints < 0){
            console.log("Please enter valid points")
            return res.status(400).json({message : "Error updating vendor : Please enter valid points"})
        }

        //Check for null values because updating all fields is not necessary

        if(updatedName){
            checkVendorExists.vendorName = updatedName
        }
        if(updatedHealthScore){
            checkVendorExists.healthScore = updatedHealthScore
        }
        if(updatedPoints){
            checkVendorExists.points = updatedPoints
        }

        const updateVendorDetails = await checkVendorExists.save()

        console.log("Vendor updated Successfully",updateVendorDetails)

        return res.status(200).json({message:"Vendor details updated successfully"})


    } catch (error) {
        console.log("Error in updating vendor", error);
        return res.status(500).json({ message: "Internal server error : Error while updating vendor" })
    }

}

export {createVendor, updateVendor}