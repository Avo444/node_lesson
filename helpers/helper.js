const path = require("path");
const fs = require("fs").promises;

const connectDatabase = async () =>
    JSON.parse(await fileRead(createPath("db", "users.json")));

const createPath = (...list) =>
    path.join(path.resolve(__dirname, ".."), ...list);

const sendResponse = (
    response,
    data,
    statusCode = 200,
    extension = "application/json",
) => {
    response.writeHead(statusCode, {
        "content-type": extension,
    });
    response.write(data);
    response.end();
};
const getRequestData = (request) => {
    return new Promise((resolve, reject) => {
        let data = "";

        request.on("data", (chunk) => {
            data = chunk.toString();
        });
        request.on("end", () => {
            resolve(data);
        });
        request.on("error", (error) => {
            reject(error);
        });
    });
};

const fileRead = async (file) => {
    try {
        const page = await fs.readFile(file, "utf-8");
        return page;
    } catch (err) {
        return err.code;
    }
};

const filterByGetter = async (url) => {
    const index = url.indexOf("?");
    const request = url.slice(index + 1);
    const split = request.split("&");
    const data = await connectDatabase();
    const filter = data.filter((user) => {
        return split.every((item) => {
            const [key, value] = item.split("=");
            if (
                (typeof user[key] === "string" &&
                    user[key].toLowerCase().indexOf(value.toLowerCase()) >
                        -1) ||
                (typeof user[key] === "number" && user[key] === +value)
            ) {
                return user;
            }
        });
    });
    return filter;
};

// CRUD
const postUserData = async (data) => {
    const db = await connectDatabase();
    const user = {
        id: db.at(-1).id + 1,
        ...data,
    };

    db.push(user);
    await fs.writeFile(createPath("db", "users.json"), JSON.stringify(db));
    return user;
};

const putUsersData = async (data) => {
    try {
        await fs.writeFile(
            createPath("db", "users.json"),
            JSON.stringify(data),
        );
        return data;
    } catch (err) {
        return { error: err.message };
    }
};
const patchUserData = async (id, data) => {
    try {
        const db = await connectDatabase();
        const index = db.findIndex((user) => user.id === id);

        if (index === -1) {
            throw new Error("User is not found");
        }

        db[index] = { ...db[index], ...data };

        await fs.writeFile(createPath("db", "users.json"), JSON.stringify(db));
        return db[index];
    } catch (err) {
        return { error: err.message };
    }
};

const deleteUser = async (id) => {
    try {
        const db = await connectDatabase();
        const user = db.find((user) => user.id === id);
        if (!user) {
            throw new Error("User is not found");
        }
        const filteredData = db.filter((user) => user.id !== id);
        await fs.writeFile(
            createPath("db", "users.json"),
            JSON.stringify(filteredData),
        );
        return true;
    } catch (err) {
        return { error: err.message };
    }
};

exports.fileRead = fileRead;
exports.createPath = createPath;
exports.deleteUser = deleteUser;
exports.putUsersData = putUsersData;
exports.postUserData = postUserData;
exports.sendResponse = sendResponse;
exports.patchUserData = patchUserData;
exports.getRequestData = getRequestData;
exports.filterByGetter = filterByGetter;
