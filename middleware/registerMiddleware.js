const { capitalizeName, sendResponse } = require("../helper/helper");

const registerMiddleware = (req, res, next) => {
    try {
        const { body } = req;
        if (
            !body["name"] ||
            !body["age"] ||
            !body["gender"] ||
            !body["login"] ||
            !body["password"]
        ) {
            throw new Error("Please fill all fields!");
        }
        body.name = capitalizeName(body.name);

        res.locals.body = body;
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};

module.exports = registerMiddleware;
