var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ActionLogModel, ErrorLogModel } from "../models/LogEntry.js";
export class LoggerService {
    static logAction(message, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ActionLogModel.create({ message, context });
        });
    }
    static logError(message, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ErrorLogModel.create({ message, context });
        });
    }
}
