import {model, Schema} from "mongoose";

export interface LogEntry {
    message:string;
    context?:any;
    timestamp?:Date;
}
const logEntrySchema = new Schema<LogEntry>({
    message:{type:String, required:true},
    context:{type:Object},
    timestamp:{type:Date, default:Date.now}
})

export const ActionLogModel = model('ActionLog', logEntrySchema, 'actions');
export const ErrorLogModel = model('ErrorLog', logEntrySchema, 'errors');