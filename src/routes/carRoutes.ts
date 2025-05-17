import {Router} from "express";
import {CarController} from "../controllers/CarController.js";
import {carService} from "../config/appConfig.js";
import {asyncHandler} from "../middlewares/asyncHandler.js";
import {param} from "express-validator";
import {validateRequest} from "../middlewares/validateRequest.js";
import {validateWithSchema} from "../middlewares/validateWithSchema.js";
import {carSchema} from "../schemas/carSchema.js";
const router = Router();

const controller = new CarController(carService);
// router.get("/", controller.getAllCars)
router.get("/", asyncHandler(controller.getAllCars))
// router.get("/:id", controller.getCarById)
router.get("/:id",[param("id").isMongoId().withMessage("Invalid id")],
    asyncHandler(
        controller.getCarById))
router.get(
    "/:id",
    [param("id").isMongoId().withMessage("Invalid car ID")],
    validateRequest,
    asyncHandler(controller.getCarById)
);
router.post("/", validateWithSchema(carSchema), asyncHandler(controller.addCar))
// router.delete("/:id", controller.deleteCar)
router.delete(
    "/:id",
    [param("id").isMongoId().withMessage("Invalid car ID")],
    validateRequest,
    asyncHandler(controller.deleteCar)
);
router.patch("/:id/availability",[param("id").isMongoId().withMessage("Invalid car ID")],
    validateRequest,
    asyncHandler(controller.updateAvailability))
export const carRoutes = router

