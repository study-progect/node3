import {Router} from "express";
import {CarController} from "../controllers/CarController.js";
import {carService} from "../config/appConfig.js";
import {asyncHandler} from "../middlewares/asyncHandler.js";
import {param} from "express-validator";
import {validateRequest} from "../middlewares/validateRequest.js";
import {validateWithSchema} from "../middlewares/validateWithSchema.js";
import {carSchema} from "../schemas/carSchema.js";
import {authenticate} from "../middlewares/authenticate.js";
import {authorize} from "../middlewares/authorize.js";
const router = Router();

const controller = new CarController(carService);
// router.get("/", controller.getAllCars)
router.get("/", asyncHandler(controller.getAllCars))
// router.get("/:id", controller.getCarById)
// router.get("/:id",[param("id").isInt({min:1}).withMessage("Invalid id")],
//     asyncHandler(
//         controller.getCarById))
router.get(
    "/:id",
    [param("id").isInt({min:1}).withMessage("Invalid car ID")],
    validateRequest,
    asyncHandler(controller.getCarById)
);
router.post("/",
    authenticate,
    authorize("car:add"),
    validateWithSchema(carSchema), asyncHandler(controller.addCar))
// router.delete("/:id", controller.deleteCar)
router.delete(
    "/:id",
    authenticate,
    authorize("car:delete"),
    authorize("car:archive"),
    [param("id").isInt({min:1}).withMessage("Invalid car ID")],
    validateRequest,
    asyncHandler(controller.deleteCar)
);
router.patch("/:id/availability",
    authenticate,
    authorize("car:update"),
    [param("id").isInt({min:1}).withMessage("Invalid car ID")],
    validateRequest,
    asyncHandler(controller.updateAvailability))
export const carRoutes = router

