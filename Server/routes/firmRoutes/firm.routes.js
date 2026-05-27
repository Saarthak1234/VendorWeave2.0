import express from "express";
import { createFirm, getUserFirms, getFirmById, updateFirm, deleteFirm } from "../../contollers/FirmControllers/firm.controller.js";
import { bulkEvaluateVendors } from "../../contollers/QueryControllers/query.controller.js";
import vendorRouter from "../vendorRoutes/vendor.routes.js";
import protect from "../../middlewares/auth.js";

const FirmRouter = express.Router();

// Apply JWT authentication protection middleware to all firm routes
FirmRouter.use(protect);

//Using without auth middleware for testing purpose
FirmRouter.post("/create-firm", createFirm);
FirmRouter.get("/get-firms", getUserFirms);
FirmRouter.get("/:firmId", getFirmById);
FirmRouter.patch("/:firmId", updateFirm);
FirmRouter.delete("/:firmId", deleteFirm);
FirmRouter.post("/:firmId/bulk-evaluate", bulkEvaluateVendors);

//Connecting vendors under firm
FirmRouter.use('/:firmId',vendorRouter)

export default FirmRouter;