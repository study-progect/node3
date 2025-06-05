import {Router} from "express";
import {RentalController} from "../controllers/RentalController.js";
import {rentalService} from "../config/appConfig.js";
import {asyncHandler} from "../middlewares/asyncHandler.js";
import {authenticate} from "../middlewares/authenticate.js";
import {authorize} from "../middlewares/authorize.js";

export const router = Router();

const controller = new RentalController(rentalService);

router.post("/",
    authenticate,
    authorize("rental:create"),
    asyncHandler(controller.createRental))
router.get('/',
    authenticate,
    authorize('rental:view'),
    asyncHandler(controller.getAllRentals))
export const rentalRoutes = router