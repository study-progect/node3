var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppError } from "../errors/AppError.js";
export class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
        this.getAllCustomers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const custom = yield this.customerService.getAllCustomers();
            res.json(custom);
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                throw new AppError("Invalid customer id", 400);
            }
            const custom = yield this.customerService.getCustomerById(id);
            if (!custom) {
                throw new AppError("Customer not found or invalid customer", 404);
            }
            res.json(custom);
        });
        this.addCustomer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const customer = yield this.customerService.addCustomer(dto);
            res.status(201).json(customer);
        });
        this.deleteCustomer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                throw new AppError("Invalid customer id", 400);
            }
            const custom = yield this.customerService.deleteCustomer(id);
            if (!custom) {
                throw new AppError("Customer not found or invalid customer", 404);
            }
            res.json(custom).sendStatus(204);
        });
    }
}
