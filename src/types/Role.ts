import {Permission} from "./Permission.js";

export interface Role {
    name: string;
    permissions: Permission[];
}