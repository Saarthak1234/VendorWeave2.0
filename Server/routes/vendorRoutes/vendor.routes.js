import express from 'express';
import FirmRouter from '../firmRoutes/firm.Routes.js';
import { createVendor, updateVendor } from '../../contollers/VendorControllers/vendor.controller.js';


const vendorRouter = express.Router({mergeParams:true}); //Merges the incoming firmRoute params with the vendor params or route.

vendorRouter.post("/create-vendor", createVendor);
vendorRouter.patch('/update-vendor', updateVendor)

export default vendorRouter;