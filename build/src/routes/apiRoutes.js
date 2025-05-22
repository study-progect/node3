import { Router } from "express";
import { carRoutes } from "./carRoutes.js";
import { customerRoutes } from "./customerRoutes.js";
import { rentalRoutes } from "./rentalRoutes.js";
export const apiRouter = Router();
apiRouter.use('/cars', carRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/rentals', rentalRoutes);
