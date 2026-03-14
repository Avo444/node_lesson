const { database, sendResponse, updateDatabase } = require("../helper/helper");
const { loginMiddleware, registerMiddleware } = require("../middleware");
const express = require("express");

const router = express.Router();

router.post("/login", loginMiddleware, async (req, res) => {
    try {
        const { body } = res.locals;
        const users = await database();
        const user = users.find(
            (user) =>
                user.login === body.login && user.password === body.password,
        );
        if (!user) {
            throw new Error("User is not found");
        }

        sendResponse(res, user);
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 404);
    }
});

router.post("/register", registerMiddleware, async (req, res) => {
    try {
        const { body } = res.locals;
        const users = await database();
        const newUser = {
            id: users.at(-1).id + 1,
            ...body,
        };
        users.push(newUser);
        await updateDatabase(users);
        sendResponse(res, newUser);
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 404);
    }
});

module.exports = router;
