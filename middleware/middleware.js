const { database, sendResponse, updateDatabase } = require("../helper/helper");

const getQueriesOperationMiddleware = async (req, res, next) => {
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

    res.locals.users = data;

    next();
};

const getUserByIdMiddleware = async (req, res, next) => {
    try {
        const id = +req.params.id;
        const users = await database();

        const user = users.find((user) => user.id === id);
        if (!user) {
            throw new Error("User is not found");
        }
        res.locals.user = user;
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 404);
    }
};

const postUserMiddleware = async (req, res, next) => {
    try {
        const body = req.body;
        const users = await database();
        if (!body.name || !body.gender || !body.age) {
            throw new Error("Invalid data");
        }

        if (body.age < 18 || body.age > 65) {
            throw new Error("You can't register on this website");
        }

        const newUser = {
            id: users.at(-1).id + 1,
            ...body,
        };
        users.push(newUser);

        await updateDatabase(users);
        res.locals.newUser = newUser;
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};

const putUsersMiddleware = async (req, res, next) => {
    try {
        const body = req.body;
        if (!body) {
            throw new Error("`Body is required!");
        }
        if (typeof body !== "object") {
            throw new Error("You can send only array or object!");
        }
        await updateDatabase(body);
        res.locals.data = body;
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};

const patchUserMiddleware = async (req, res, next) => {
    try {
        const body = req.body;
        const id = +req.params.id;
        const users = await database();
        const user = users.findIndex((user) => user.id === id);
        if (user === -1) {
            throw new Error("User is not found");
        }

        if (typeof body !== "object") {
            throw new Error("You can send properties only from object");
        }

        users[user] = {
            ...users[user],
            ...body,
        };
        await updateDatabase(users);
        res.locals.user = users[user];
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};

const deleteUserMiddleware = async (req, res, next) => {
    try {
        const id = +req.params.id;
        let users = await database();
        const user = users.findIndex((user) => user.id === id);
        if (user === -1) {
            throw new Error("User is not found");
        }
        users.splice(user, 1);
        await updateDatabase(users);
        res.locals.users = users;
        next();
    } catch (err) {
        const error = { error: err.message };
        sendResponse(res, error, 400);
    }
};
module.exports = {
    postUserMiddleware,
    putUsersMiddleware,
    patchUserMiddleware,
    deleteUserMiddleware,
    getUserByIdMiddleware,
    getQueriesOperationMiddleware,
};
