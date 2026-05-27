import express from "express";
import { evaluateVendorPerformance, getVendorQueries } from "../../contollers/QueryControllers/query.controller.js";

const queryRouter = express.Router({ mergeParams: true });

queryRouter.post("/evaluate", evaluateVendorPerformance);
queryRouter.get("/", getVendorQueries);

export default queryRouter;
