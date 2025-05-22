import {initApp} from "./config/appConfig.js";
import express, {json} from "express";
import {apiRouter} from "./routes/apiRoutes.js";
import {PORT, SOCKED} from "./config/myConfig.js";
import {errorHandler} from "./middlewares/errorHandler.js";
import { mongoLogger} from "./middlewares/reqestLogger.js";

export const launchServer = async () => {

    // await loadAllDada()
    await initApp()
    const app = express()
    app.use(json())
    // app.use(fileLogger)
    app.use(mongoLogger)

    app.use("/api", apiRouter)
    app.use((req: express.Request, res: express.Response) => {
        res.status(404).send("Not Found")
    })
    app.use(errorHandler)
    const server = app.listen(PORT, () => {
        console.log(`Car rental started on ${SOCKED}` )
    })
    process.on('SIGINT', async () => {
        console.log(`saving add showdown`)
        // await saveAllDada()
        server.close(() => process.exit(0))
    })
}