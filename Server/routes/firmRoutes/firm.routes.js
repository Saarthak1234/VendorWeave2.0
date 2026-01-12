import express from "express";
import { createFirm } from "../../contollers/FirmControllers/firm.Controller.js";
// import auth from "../middlewares/auth.js";

const router = express.Router();

// router.post("/", auth, firmController.createFirm);
// router.get("/", auth, firmController.getUserFirms);
// router.get("/:firmId", auth, firmController.getFirmById);
// router.patch("/:firmId", auth, firmController.updateFirm);
// router.delete("/:firmId", auth, firmController.deleteFirm);

//Using without auth for testing purpose
router.post("/create", createFirm);
// router.get("/", firmController.getUserFirms);
// router.get("/:firmId", firmController.getFirmById);
// router.patch("/:firmId", firmController.updateFirm);
// router.delete("/:firmId", firmController.deleteFirm);

export default router;