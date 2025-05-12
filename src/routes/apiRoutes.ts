import {Router} from "express";
import {carRoutes} from "./carRoutes.js";

export const apiRouter = Router()
apiRouter.use('/cars', carRoutes)