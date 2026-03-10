const fs = require("fs").promises;
const path = require("path");

const createPath = (...arr) => path.join(path.resolve(), ...arr);
const fileRead = async (path) => {
    try {
        const file = await fs.readFile(path, "utf-8");
        return file;
    } catch (err) {
        return err.code;
    }
};

const sendResponse = (
    response,
    data,
    status = 200,
    extension = "application/json",
) => {
    response.set({
        "content-type": extension,
    });
    response.status(status).send(data);
};
const database = async () =>
    JSON.parse(await fileRead(createPath("db", "users.json")));

const userFinder = async (request) => {
    const users = await database();
    const id = request.params.id;
    const user = users.find((user) => user.id === +id);
    if (!user) {
        throw new Error("User is not found");
    }
    return user;
};

const getUsersData = async (query) => {
    let users = await database();
    const queries = Object.entries(query);

    if (queries.length > 0) {
        queries.forEach(([key, value]) => {
            if (key === "name") {
                users = users.filter((user) =>
                    user.name.toLowerCase().includes(value.toLowerCase()),
                );
                return;
            }
            if (key === "age" && (value === "asc" || value === "desc")) {
                users.sort((a, b) =>
                    value === "asc" ? a.age - b.age : b.age - a.age,
                );
                return;
            }
            users = users.filter(
                (user) =>
                    (typeof user[key] === "string" && user[key] === value) ||
                    (typeof user[key] === "number" && user[key] === +value),
            );
        });
    }

    return users;
};

exports.fileRead = fileRead;
exports.createPath = createPath;
exports.userFinder = userFinder;
exports.getUsersData = getUsersData;
exports.sendResponse = sendResponse;
