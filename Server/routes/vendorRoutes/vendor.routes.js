import express from 'express';
import createVendor from '../../contollers/VendorControllers/vendor.controller.js';
import FirmRouter from '../firmRoutes/firm.Routes.js';


const vendorRouter = express.Router({mergeParams:true}); //Merges the incoming firmRoute params with the vendor params or route.

vendorRouter.post("/create-vendor", createVendor);

export default vendorRouter;