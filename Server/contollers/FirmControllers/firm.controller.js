import Firm from "../../models/firmModel/firmModel";
import dotenv from 'dotenv'

dotenv.config();

//Controllers to make: createFirm, getUsersFirm, getfirmByID, updateFirm, deleteFirm

const createFirm = async(req,res)=>{
    try {
        const {name} = req.body; //Add userId in future
        const firm = new firmModel({
            name: name
        })

        const newFirm = await firm.save();
        return res.status(201).json({message: "Firm successfully created", newFirm})
    } catch (error) {
        console.error("Error in Firm creation", error)
        return res.status(500).json({message:"Internal Server Error: Error in Firm creation"})
    }
}

export {createFirm}