export function checkPermission(permission) {
    return (req, res, next) => {
        const customer = req.customer;
        if (!customer || !customer.role) {
            return res.status(403).json({ error: 'access denied no customer or role' });
        }
        const hasPermission = customer.role.permissions.includes(permission);
        if (!hasPermission) {
            return res.status(403).json({ error: 'access denied no permission' });
        }
        next();
    };
}
