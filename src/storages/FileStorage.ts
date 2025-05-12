import path from "path";
import {promises as fs}  from "fs";

export class FileStorage<T> {
    constructor(private filePath:string ) {

    }
    async save(data:T[]) {
        const dir = path.dirname(this.filePath);
        await fs.mkdir(dir, { recursive: true });
        const json = JSON.stringify(data, null, 2);
        await fs.writeFile(this.filePath, json, { encoding: 'utf8' });
    }
    async load():Promise<T[]> {
        try {
            const json = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(json);
        } catch (e) {
            return [];
        }
    }
}