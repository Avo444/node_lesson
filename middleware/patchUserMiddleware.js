const patchUserMiddleware = (req, res, next) => {
    try {
        const body = req.body;

        if (typeof body !== "object") {
            throw new Error("You can send properties only from object");
        }

        res.locals.body = body;
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};

module.exports = patchUserMiddleware;
