export interface Rental {
    id: string;
    carId: string;
    customerId: string;
    startDate: string;
    endDate: string;
    totalCost: number;
    status: "active" | "completed" | "cancelled";
}