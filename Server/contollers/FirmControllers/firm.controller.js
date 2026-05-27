import Firm from "../../models/firmModel/firmModel.js";
import Vendor from "../../models/vendorModel/vendorModel.js";
import Query from "../../models/queryModel/queryModel.js";
import dotenv from 'dotenv'

dotenv.config();

//Controllers to make: createFirm(done), getUsersFirm(done), getfirmByID(done), updateFirm(done), deleteFirm()


const createFirm = async(req,res)=>{
    try {
        const {name} = req.body;
        const checkFirmExists = await Firm.findOne({firmName:name})
        console.log(checkFirmExists);
        if(checkFirmExists !== null){
            console.log("Firm with same name exists")
            return res.status(400).json({message:"Firm already exists"})
        }

        const firm = new Firm({
            firmName: name,
            adminId: req.user.id,
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
        const adminId = req.user.id;
        const firmArr = await Firm.find({adminId: adminId})
        console.log(adminId, firmArr)

        if(firmArr.length == 0){
            console.log("No firm yet");
            return res.status(400).json({message:"No firms registered for this admin"})
        }

        for( let i = 0 ; i < firmArr.length ; i++){
            console.log(firmArr[i].firmName)
        }
        return res.status(200).json({message:"Firms successfully found and returned", firms: firmArr})

    }catch(error){
        console.log("Error in getting firms", error)
        return res.status(500).json({message:"Internal server error: Error while getting firms"});
    }
}

const getFirmById = async (req,res) => {
    try {
        const adminId = req.user.id;
        const recievedFirmId = req.params;
        console.log("Firm and Admin ID's are:",recievedFirmId, adminId);
        const firmData = await Firm.findOne({ _id: recievedFirmId.firmId, adminId: adminId})

        if(!firmData){
            console.log("No firm with this ID for this admin exists")
            return res.status(400).json({message:"No firm with this ID for this admin exists"})
        }

        console.log(firmData);

        return res.status(200).json({message:"Firm returned successfully", firm: firmData})
        
    } catch (error) {
        console.log("Error in get firm by ID route", error)
        return res.status(500).json({message:"Internal server error : Error in getting firm by ID"})
    }
}

const updateFirm = async (req,res) => {
    try {
        const adminId = req.user.id;
        const {updatedName} = req.body
        const recievedFirmId = req.params;
        const firmData = await Firm.findOne({_id:recievedFirmId.firmId, adminId:adminId})

        if(!firmData){
            console.log("No firm with same details found")
            return res.status(400).json({message:"Error in finding firm"})
        }

        if(firmData.firmName == updatedName){
            console.log("Firm has the same name")
            return res.status(400).json({message:"Firm has the same name: Please enter a different name to update the name"})
        }

        console.log(firmData.firmName)

        firmData.firmName = updatedName

        const updatedFirm = await firmData.save()

        console.log("Firm updated", updatedFirm)
        return res.status(200).json({message:"Successfully updated firm details", firm: updatedFirm})
        
    } catch (error) {
        console.log("Error while updating firm",error)
        return res.status(500).json({message:"Internal Server Error : Error while updating firm"})
    }
}

const deleteFirm = async function(req,res){
    try {
        const adminId = req.user.id;
        const recievedFirmId = req.params
        console.log(recievedFirmId)
        const firmData = await Firm.findOne({_id:recievedFirmId.firmId, adminId:adminId})

        console.log(firmData)

        const deleteFirm = await Firm.deleteOne({_id:recievedFirmId.firmId, adminId:adminId})

        // Cascading Deletes: Clean up all vendors and queries associated with this firm
        await Vendor.deleteMany({ firmId: recievedFirmId.firmId });
        await Query.deleteMany({ firmId: recievedFirmId.firmId });

        console.log("Firm and associated data deleted", deleteFirm)

        return res.status(200).json({message: "Successfully deleted firm"})

    } catch (error) {
        console.log("Error while deleting firm", error)
        return res.status(500).json({message:"Internal server error : Error while deling firm"})
    }
}

export {createFirm, getUserFirms, getFirmById, updateFirm, deleteFirm}