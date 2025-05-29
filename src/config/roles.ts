import {Role} from "../types/Role.js";

export const roles: Record<string, Role> = {
    ROOT_ADMIN: {name:'ROOT_ADMIN',permissions:['user:changeRole','user:manage','system:config']},
    ADMIN:{name:'ADMIN',permissions:['user:manage','car:archive','log:view','user:changeRole','user:updateProfile']},
    MANAGER:{name:'MANAGER',permissions:['car:view','car:add','car:update','rental:create','rental:update','rental:view','rental:cancel'],},
    ACCOUNTANT:{name:'ACCOUNTANT',permissions:['payment:view','payment:process']},
    CUSTOMER:{name:'CUSTOMER',permissions:['car:view','rental:create','rental:cancel','rental:update','user:updateProfile'],},
    GUEST:{name:'GUEST',permissions:['car:view']}
}