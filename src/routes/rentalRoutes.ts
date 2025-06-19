import {Router} from "express";
import {RentalController} from "../controllers/RentalController.js";
import {rentalService} from "../config/appConfig.js";
import {asyncHandler} from "../middlewares/asyncHandler.js";
import {authenticate} from "../middlewares/authenticate.js";
import {authorize} from "../middlewares/authorize.js";
import {validateWithSchema} from "../middlewares/validateWithSchema.js";
import {customerSchema} from "../schemas/customerSchema.js";
import {rentalSchema} from "../schemas/rentalSchema.js";
import {param} from "express-validator";
import {validateRequest} from "../middlewares/validateRequest.js";

export const router = Router();

const controller = new RentalController(rentalService);

router.post("/",
    authenticate,
    authorize("rental:create"),
    // validateWithSchema(rentalSchema),
    asyncHandler(controller.createRental))
router.get('/',
    authenticate,
    authorize('rental:view'),
    asyncHandler(controller.getAllRentals))
router.get('/:id',
    authenticate,
    authorize('rental:view'),
    [param('id').isInt({min:1}).withMessage('rental id must be a positive integer')],
    validateRequest,
    asyncHandler(controller.getRentalById)
    )
router.patch('/:id/cancel',
    authenticate,
    authorize('rental:cancel'),
    [param('id').isInt({min:1}).withMessage('rental id must be a positive integer')],
    validateRequest,
    asyncHandler(controller.cancelRental)
)



export const rentalRoutes = router