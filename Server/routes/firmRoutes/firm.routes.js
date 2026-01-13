import express from "express";
import { createFirm, getUserFirms, getFirmById, updateFirm } from "../../contollers/FirmControllers/firm.Controller.js";
// import auth from "../middlewares/auth.js";

const FirmRouter = express.Router();

// router.post("/", auth, firmController.createFirm);
// router.get("/", auth, firmController.getUserFirms);
// router.get("/:firmId", auth, firmController.getFirmById);
// router.patch("/:firmId", auth, firmController.updateFirm);
// router.delete("/:firmId", auth, firmController.deleteFirm);

//Using without auth for testing purpose
FirmRouter.post("/create-firm", createFirm);
FirmRouter.get("/get-firms", getUserFirms);
FirmRouter.get("/:firmId", getFirmById);
FirmRouter.patch("/:firmId", updateFirm);
// FirmRouter.delete("/:firmId", firmController.deleteFirm);

export default FirmRouter;