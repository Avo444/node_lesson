const putUsersMiddleware = async (req, res, next) => {
    try {
        const body = req.body;
        if (!body) {
            throw new Error("`Body is required!");
        }
        if (typeof body !== "object") {
            throw new Error("You can send only array or object!");
        }
        res.locals.body = body;
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};


module.exports = putUsersMiddleware;