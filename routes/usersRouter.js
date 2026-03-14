const { database, sendResponse } = require("../helper/helper");
const express = require("express");

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const queries = Object.entries(req.query);
        let users = await database();

        queries.forEach(([key, value]) => {
            switch (key) {
                case "name": {
                    users = users.filter((user) =>
                        user.name.toLowerCase().includes(value.toLowerCase()),
                    );
                    break;
                }
                case "age": {
                    if (value === "asc") {
                        users.sort((a, b) => a.age - b.age);
                    } else if (value === "desc") {
                        users.sort((a, b) => b.age - a.age);
                    }
                    break;
                }
                default: {
                    users.filter((user) => {
                        const newValue =
                            typeof user[key] === "number" ? +value : value;

                        return user[key] === newValue;
                    });
                }
            }
        });
        sendResponse(res, users);
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 404);
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const users = await database();
        const user = users.find((user) => user.id === +id);

        if (!user) {
            throw new Error("User is not found");
        }

        sendResponse(res, user);
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 404);
    }
});

module.exports = router;
