import Firm from "../../models/firmModel/firmModel.js";
import Vendor from "../../models/vendorModel/vendorModel.js";
import dotenv from 'dotenv'

dotenv.config();

//Vendor routes to create: createVendor(done), updateVendor(done), deleteVendor(done), getVendorByFirmId, getVendorsByFirmId

const createVendor = async (req, res) => {
    try {
        const { name, healthScore, points } = req.body;
        const parentFirmId = req.params.firmId

        //Optional : Check if this firm exists or not?

        const checkFirmExists = await Firm.findById(parentFirmId);
        if (!checkFirmExists) {
            console.log("Please provide a valid firm")
            return res.status(400).json({ message: "Error creating vendor: Invalid firm" });
        }

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

        if (checkVendorExists.vendorName == updatedName) {
            console.log("Cannot enter the same name for the vendor")
            return res.status(400).json({ message: "Error updating vendor : Cannot enter the same name" })
        }

        if (updatedHealthScore < 0 || updatedHealthScore > 100) {
            console.log("Please enter a valid health score")
            return res.status(400).json({ message: "Error updating vendor : Please enter a valid healthscore" })
        }

        if (updatedPoints < 0) {
            console.log("Please enter valid points")
            return res.status(400).json({ message: "Error updating vendor : Please enter valid points" })
        }

        //Check for null values because updating all fields is not necessary

        if (updatedName) {
            checkVendorExists.vendorName = updatedName
        }
        if (updatedHealthScore) {
            checkVendorExists.healthScore = updatedHealthScore
        }
        if (updatedPoints) {
            checkVendorExists.points = updatedPoints
        }

        const updateVendorDetails = await checkVendorExists.save()

        console.log("Vendor updated Successfully", updateVendorDetails)

        return res.status(200).json({ message: "Vendor details updated successfully" })


    } catch (error) {
        console.log("Error in updating vendor", error);
        return res.status(500).json({ message: "Internal server error : Error while updating vendor" })
    }

}

const deleteVendor = async function (req, res) {
    try {
        const { name, vendor_id } = req.body
        const FirmId = req.params

        console.log(name, vendor_id, FirmId.firmId)

        const checkVendorExists = await Vendor.findOne({ vendorName: name, firmId: FirmId.firmId, _id: vendor_id })

        if (!checkVendorExists) {
            console.log("Vendor not found")
            return res.status(400).json({ message: "Vendor not found" })
        }

        const deleteVendor = await checkVendorExists.deleteOne();

        console.log(deleteVendor)

        console.log("Vendor successfully deleted")
        return res.status(200).json({ message: "Vendor successfully deleted" })

    } catch (error) {
        console.log("Error in deleting vendor");
        return res.status(500).json({ message: "Internal Server error : Error while deleting firm" })
    }
}

const getVendorByFirmId = async (req, res) => {
    try {
        const { name } = req.body
        const firmId = req.params.firmId

        const checkVendorExists = await Vendor.findOne({ vendorName: name, firmId: firmId })

        if (!checkVendorExists) {
            console.log("Vendor with these details for this firm does not exist")
            return res.status(400).json({ message: "Vendor not found" })
        }

        const vendorObj = {
            name: checkVendorExists.vendorName,
            healthScore: checkVendorExists.healthScore,
            points: checkVendorExists.points
        }

        console.log(vendorObj);
        return res.status(200).json({
            message: "Vendor found and returned", vendorObj
        })


    } catch (error) {
        console.log("Error in get Vendor By ID")
        return res.status(500).json({ message: "Internal Server Error : Error while fetching details of this vendor for this firm" })
    }
}

const getVendorsByFirmId = async (req, res) => {
    try {
        const recievedFirmId = req.params

        // Add a check if that firm exists or not

        // const checkFirmExists = await Firm.findById(recievedFirmId.firmId)
        // console.log(recievedFirmId, recievedFirmId.firmId)

        // console.log(checkFirmExists)

        // if(!checkFirmExists){
        //     console.log("Please enter a valid firm")
        //     return res.status(400).json({message : "Invalid firm"})
        // }

        const getAllVendors = await Vendor.find(recievedFirmId)
        console.log(getAllVendors)

        if(getAllVendors === null || getAllVendors.length === 0){
            console.log("No vendor exists")
            return res.status(400).json("No vendor for this firm exists")
        }

        console.log("Vendors returned successfully")

        return res.status(200).json({ message: "Vendors successfully found and returned" })

    } catch (error) {
        console.log("Error in getting all the vendors of a particular firm",error)
        return res.status(500).json({ message: "Internal Server error : Error while getting vendors of that particular firm" })
    }
}

export { createVendor, updateVendor, deleteVendor, getVendorByFirmId, getVendorsByFirmId}