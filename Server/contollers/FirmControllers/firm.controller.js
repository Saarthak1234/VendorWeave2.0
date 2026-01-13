import Firm from "../../models/firmModel/firmModel.js";
import dotenv from 'dotenv'

dotenv.config();

//Controllers to make: createFirm(done), getUsersFirm(), getfirmByID, updateFirm, deleteFirm


const createFirm = async(req,res)=>{
    try {
        const {name, admin_Id} = req.body;
        const checkFirmExists = await Firm.findOne({firmName:name})
        console.log(checkFirmExists);
        if(checkFirmExists !== null){
            console.log("Firm with same name exists")
            return res.status(400).json({message:"Firm already exists"})
        }

        const firm = new Firm({
            firmName: name,
            adminId: admin_Id,
        })

        const newFirm = await firm.save();
        return res.status(201).json({message: "Firm successfully created", newFirm})
    } catch (error) {
        console.error("Error in Firm creation", error)
        return res.status(500).json({message:"Internal Server Error: Error in Firm creation"})
    }
}

const getUserFirms = async(req,res) => {
    try{
        const {admin_Id} = req.body;
        const firmArr = await Firm.find({adminId: admin_Id})
        console.log(admin_Id, firmArr)

        if(firmArr.length == 0){
            console.log("No firm yet");
            return res.status(400).json({message:"No firms registered for this admin"})
        }

        for( let i = 0 ; i < firmArr.length ; i++){
            console.log(firmArr[i].firmName)
        }
        return res.status(201).json({message:"Firms successfully found and returned"})

    }catch(error){
        console.log("Error in getting firms", error)
        return res.status(500).json({message:"Internal server error: Error while getting firms"});
    }
}

const getFirmById = async (req,res) => {
    try {
        const {admin_Id} = req.body;
        const recievedFirmId = req.params;
        console.log("Firm and Admin ID's are:",recievedFirmId, admin_Id);
        const firmData = await Firm.findOne({ _id: recievedFirmId.firmId, adminId: admin_Id})

        if(!firmData){
            console.log("No firm with this ID for this admin exists")
            return res.status(400).json({message:"No firm with this ID for this admin exists"})
        }

        console.log(firmData);

        return res.status(200).json({message:"Firm returned successfully"})
        
    } catch (error) {
        console.log("Error in get firm by ID route", error)
        return res.status(500).json({message:"Internal server error : Error in getting firm by ID"})
    }
}

export {createFirm, getUserFirms, getFirmById}