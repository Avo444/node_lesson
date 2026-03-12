const path = require("path");
const fs = require("fs").promises;

const fileRead = async (path) => await fs.readFile(path, "utf-8");

const createPath = (...arr) => path.join(path.resolve(), ...arr);

const database = async () =>
    JSON.parse(await fileRead(createPath("db", "users.json")));

const updateDatabase = async (data) =>
    await fs.writeFile(createPath("db", "users.json"), JSON.stringify(data),);
const sendResponse = (
    response,
    data,
    status = 200,
    extension = "application/json",
) => {
    response.set({
        "content-type": extension,
    });
    response.status(status);
    extension === "application/json"
        ? response.json(data)
        : response.send(data);
};

module.exports = {
    sendResponse,
    fileRead,
    createPath,
    database,
    updateDatabase,
};