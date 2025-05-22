import {ActionLogModel, ErrorLogModel} from "../models/LogEntry.js";

export class LoggerService {
    static async logAction(message:string,context?:any){
        await ActionLogModel.create({message,context})
    }
    static async logError(message:string,context?:any){
        await ErrorLogModel.create({message,context})
    }
}