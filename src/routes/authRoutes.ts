import {Router} from "express";
import {AuthController} from "../controllers/AuthController.js";
import {customerService} from "../config/appConfig.js";
import {asyncHandler} from "../middlewares/asyncHandler.js";

const router = Router()

const authController = new AuthController(customerService);

router.post('/login', asyncHandler(authController.login))

export const authRoutes = router;
