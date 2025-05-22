import {Router} from "express";
import {RentalController} from "../controllers/RentalController.js";
import {rentalService} from "../config/appConfig.js";
import {asyncHandler} from "../middlewares/asyncHandler.js";

export const router = Router();

const controller = new RentalController(rentalService);

router.post("/", asyncHandler(controller.createRental))
router.get('/',asyncHandler(controller.getAllRentals))
export const rentalRoutes = router