import {Router} from "express";
import {} from "../controllers/CarController.js";
import {carService, customerService} from "../config/appConfig.js";
import {asyncHandler} from "../middlewares/asyncHandler.js";
import {param} from "express-validator";
import {validateRequest} from "../middlewares/validateRequest.js";
import {validateWithSchema} from "../middlewares/validateWithSchema.js";
import {carSchema} from "../schemas/carSchema.js";
import {CustomerController} from "../controllers/CustomerController.js";
const router = Router();

const controller = new CustomerController(customerService);
// router.get("/", controller.getAllCars)
router.get("/", asyncHandler(controller.getAllCustomers))
// router.get("/:id", controller.getCarById)
router.get("/:id",[param("id").isInt({min:1}).withMessage("Invalid id")],
    asyncHandler(
        controller.getById))
router.get(
    "/:id",
    [param("id").isInt({min:1}).withMessage("Invalid customer ID")],
    asyncHandler(controller.getById)
);
router.post("/", asyncHandler(controller.addCustomer))
// router.delete("/:id", controller.deleteCar)
router.delete(
    "/:id",
    [param("id").isInt({min:1}).withMessage("Invalid customer ID")],
    validateRequest,
    asyncHandler(controller.deleteCustomer)
);
export const customerRoutes = router

