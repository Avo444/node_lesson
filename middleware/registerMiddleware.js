const { registerSchema } = require("../schema");
const { capitalizeName, sendResponse } = require("../helper/helper");

const registerMiddleware = async (req, res, next) => {
    try {
        const data = await registerSchema.validateAsync(req.body);
        data.name = capitalizeName(data.name);

        res.locals.body = data;
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};

module.exports = registerMiddleware;
