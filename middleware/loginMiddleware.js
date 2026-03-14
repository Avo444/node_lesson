const { sendResponse } = require("../helper/helper");

const loginMiddleware = (req, res, next) => {
    try {
        const { body } = req;
        console.log(body)
        if (!body["login"] || !body["password"]) {
            throw new Error("Invalid username or password!");
        }
        res.locals.body = body;
        next()
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};

module.exports = loginMiddleware;
