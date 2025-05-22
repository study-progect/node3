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
export class RentalController {
    constructor(rentalService) {
        this.rentalService = rentalService;
        this.createRental = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const rental = yield this.rentalService.createRental(dto);
            if (!rental) {
                throw new AppError("Can't create rental", 400);
            }
            res.status(201).json(rental);
        });
        this.getAllRentals = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const rentals = yield this.rentalService.getAllRentals();
            res.status(200).json(rentals);
        });
    }
}
