const { loginSchema } = require("../schema");
const { sendResponse } = require("../helper/helper");

const loginMiddleware = async (req, res, next) => {
    try {
        const data = await loginSchema.validateAsync(req.body);
        res.locals.body = data;
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};

module.exports = loginMiddleware;
