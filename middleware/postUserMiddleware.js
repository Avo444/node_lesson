const { captializeName } = require("../helper/helper");

const postUserMiddleware = async (req, res, next) => {
    try {
        const body = req.body;
        if (!body.name || !body.gender || !body.age) {
            throw new Error("Invalid data");
        }

        if (body.age < 18 || body.age > 65) {
            throw new Error("You can't register on this website");
        }

        body.name = captializeName(body.name);

        res.locals.body = body;
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};

module.exports = postUserMiddleware;