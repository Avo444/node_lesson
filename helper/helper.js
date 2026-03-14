const path = require("path");
const fs = require("fs").promises;

const createPath = (...arr) => path.join(path.resolve(), ...arr);

const database = async () =>
    JSON.parse(await readFile(createPath("db", "users.json")));

const updateDatabase = async (data) =>
    await fs.writeFile(createPath("db", "users.json"), JSON.stringify(data));

const readFile = async (path) => {
    try {
        const file = await fs.readFile(path, "utf-8");
        return file;
    } catch (error) {
        return error.message;
    }
};

const capitalizeName = (name) => {
    const trim = name.trim();
    const first = trim[0].toUpperCase();
    return first + trim.slice(1);
};

const sendResponse = (
    response,
    data,
    statusCode = 200,
    extension = "application/json",
) => {
    response.set({
        "content-type": extension,
    });
    response.status(statusCode);
    extension === "application/json"
        ? response.json(data)
        : response.send(data);
};

module.exports = {
    readFile,
    database,
    createPath,
    sendResponse,
    capitalizeName,
    updateDatabase,
};
