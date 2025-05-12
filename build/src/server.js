var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadAllDada, saveAllDada } from "./config/appConfig.js";
import express, { json } from "express";
import { apiRouter } from "./routes/apiRoutes.js";
import { PORT, SOCKED } from "./config/myConfig.js";
import { errorHandler } from "./middlewares/errorHandler.js";
export const launchServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield loadAllDada();
    const app = express();
    app.use(json());
    app.use("/api", apiRouter);
    app.use((req, res) => {
        res.status(404).send("Not Found");
    });
    app.use(errorHandler);
    const server = app.listen(PORT, () => {
        console.log(`Car rental started on ${SOCKED}`);
    });
    process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`saving add showdown`);
        yield saveAllDada();
        server.close(() => process.exit(0));
    }));
});
