var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import { promises as fs } from "fs";
export class FileStorage {
    constructor(filePath) {
        this.filePath = filePath;
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dir = path.dirname(this.filePath);
            yield fs.mkdir(dir, { recursive: true });
            const json = JSON.stringify(data, null, 2);
            yield fs.writeFile(this.filePath, json, { encoding: 'utf8' });
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const json = yield fs.readFile(this.filePath, 'utf8');
                return JSON.parse(json);
            }
            catch (e) {
                return [];
            }
        });
    }
}
