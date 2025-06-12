export function authorize(requiredPermission) {
    return (req, res, next) => {
        const customer = req.customer;
        if (!customer || !customer.role || !Array.isArray(customer.role.permissions) ||
            !(customer.role.permissions.includes(requiredPermission))) {
            res.status(403).json({ error: 'forbidden no permission' });
            return;
        }
        next();
    };
}
