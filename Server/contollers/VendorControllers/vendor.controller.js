import Vendor from "../../models/vendorModel/vendorModel.js";
import dotenv from 'dotenv'

dotenv.config();

const createVendor = async(req,res) => {
    try {
        const {name, healthScore, points} = req.body;
        const parentFirmId = req.params.firmId
        console.log(name,healthScore,points,parentFirmId);

        //Add validations for creating vendor

        const vendor = new Vendor({
            firmId: parentFirmId,
            vendorName: name,
            healthScore: healthScore,
            points: points
        })

        const newVendor = await vendor.save()

        return res.status(200).json({message:"Vendor successfully created", vendor})
    } catch (error) {
        console.log("Error in creating vendor: ",error);
        return res.status(500).json({message:"Internal Server error: Error while creating vendor"});
    }
}

export default createVendor;