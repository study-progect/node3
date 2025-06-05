import {Router} from "express";
import {} from "../controllers/CarController.js";
import {carService, customerService} from "../config/appConfig.js";
import {asyncHandler} from "../middlewares/asyncHandler.js";
import {param} from "express-validator";
import {validateRequest} from "../middlewares/validateRequest.js";
import {validateWithSchema} from "../middlewares/validateWithSchema.js";
import {carSchema} from "../schemas/carSchema.js";
import {CustomerController} from "../controllers/CustomerController.js";
import {authenticate} from "../middlewares/authenticate.js";
import {authorize} from "../middlewares/authorize.js";
const router = Router();

const controller = new CustomerController(customerService);
// router.get("/", controller.getAllCars)
router.get("/",
    authenticate,
    authorize('user:manage'),
    asyncHandler(controller.getAllCustomers))
// router.get("/:id", controller.getCarById)
// router.get("/:id",[param("id").isInt({min:1}).withMessage("Invalid id")],
//     asyncHandler(
//         controller.getById))
router.get(
    "/:id",
    authenticate,
    authorize('user:manage'),
    [param("id").isInt({min:1}).withMessage("Invalid customer ID")],
    asyncHandler(controller.getById)
);
router.post("/", asyncHandler(controller.addCustomer))
// router.delete("/:id", controller.deleteCar)

router.delete(
    "/:id",
    authenticate,
    authorize('user:manage'),
    [param("id").isInt({min:1}).withMessage("Invalid customer ID")],
    validateRequest,
    asyncHandler(controller.deleteCustomer)
);
router.patch("/:id/profile",
    authenticate,
    authorize('user:updateProfile'),
    [param("id").isInt({min:1}).withMessage("ID must be positive integer")],
    validateRequest,
    asyncHandler(controller.updateCustomerProfile))
router.patch("/:id/role",
    authenticate,
    authorize('user:changeRole'),
    [param("id").isInt({min:1}).withMessage("ID must be positive integer")],
    validateRequest,
    asyncHandler(controller.changeCustomerRole)
)
export const customerRoutes = router

