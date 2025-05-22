import { model, Schema } from "mongoose";
const logEntrySchema = new Schema({
    message: { type: String, required: true },
    context: { type: Object },
    timestamp: { type: Date, default: Date.now }
});
export const ActionLogModel = model('ActionLog', logEntrySchema, 'actions');
export const ErrorLogModel = model('ErrorLog', logEntrySchema, 'errors');
