export const validateWithSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            res.status(400).json({
                errors: error.details.map(detail => ({
                    message: detail.message,
                    path: detail.path.join("."),
                })),
            });
            return;
        }
        next();
    };
};
