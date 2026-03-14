const { sendResponse, database, updateDatabase } = require("./helper/helper");
const {
    postUserMiddleware,
    putUsersMiddleware,
    patchUserMiddleware,
} = require("./middleware");
const express = require("express");

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    const data = "<h1>Hello</h1>";
    sendResponse(res, data, 200, "text/html");
});

app.get("/api/users", async (req, res) => {
    const queries = Object.entries(req.query);
    let data = await database();

    queries.forEach(([key, value]) => {
        switch (key) {
            case "name": {
                data = data.filter((user) =>
                    user.name.toLowerCase().includes(value.toLowerCase()),
                );
                break;
            }
            case "age": {
                if (value === "asc") {
                    data.sort((a, b) => a.age - b.age);
                } else if (value === "desc") {
                    data.sort((a, b) => b.age - a.age);
                }
                break;
            }
            default: {
                data = data.filter(
                    (user) =>
                        (typeof user[key] === "string" &&
                            user[key] === value) ||
                        (typeof user[key] === "number" && user[key] === +value),
                );
            }
        }
    });
    sendResponse(res, data);
});

app.get("/api/users/:id", async (req, res) => {
    try {
        const id = +req.params.id;
        const users = await database();

        const user = users.find((user) => user.id === id);
        if (!user) {
            throw new Error("User is not found");
        }
        sendResponse(res, user);
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 404);
    }
});

app.post("/api/users", postUserMiddleware, async (req, res) => {
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
    } catch (error) {
        const err = { error: error.message };
        sendResponse(res, err, 404);
    }
});

app.put("/api/users", putUsersMiddleware, async (req, res) => {
    try {
        const { body } = res.locals;
        await updateDatabase(body);
        sendResponse(res, body);
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 404);
    }
});

app.patch("/api/users/:id", patchUserMiddleware, async (req, res) => {
    try {
        const { body } = res.locals;
        const id = +req.params.id;
        const users = await database();
        const user = users.findIndex((user) => user.id === id);
        if (user === -1) {
            throw new Error("User is not found");
        }
        users[user] = {
            ...users[user],
            ...body,
        };
        await updateDatabase(users);
        sendResponse(res, users[user]);
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
});

app.delete("/api/users/:id", async (req, res) => {
    try {
        const id = +req.params.id;
        let users = await database();
        const user = users.findIndex((user) => user.id === id);
        if (user === -1) {
            throw new Error("User is not found");
        }
        users.splice(user, 1);
        await updateDatabase(users);

        const message = { message: "Account is deleted successfully!" };
        sendResponse(res, message);
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
});

app.listen(3000, (err) => {
    console.log(err ? err : "Server is running");
});
