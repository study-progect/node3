import path from "path";
import fs from "fs";
import {ActionLogModel} from "../models/LogEntry.js";
import morgan from "morgan";

// const logDired =  path.join(__dirname, '../logs')
// if(!fs.existsSync(logDired)) {
//     fs.mkdirSync(logDired)
// }
// const logStream = fs.createWriteStream(path.join('../logs', 'access.log'), {flags: 'a'})
const mongoStream =  {write: async (message:string) => {await ActionLogModel.create({message})} }
// export const fileLogger = morgan('combined', {stream: logStream})
export const mongoLogger = morgan('combined', {stream: mongoStream as any,})