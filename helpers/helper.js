const { validation } = require("./validation");
const fs = require("fs").promises;
const path = require("path");

const createPath = (...arr) => path.join(path.resolve(__dirname, ".."), ...arr);

const database = async () =>
    JSON.parse(await fileRead(createPath("db", "users.json")));

const capitalizeText = (str) => {
    const text = str.split("");
    text[0] = text[0].toUpperCase();
    return text.join("");
};

const fileRead = async (path) => {
    try {
        const file = await fs.readFile(path, "utf8");
        return file;
    } catch (err) {
        return err.message;
    }
};

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

const getUserData = async (id) => {
    const db = await database();
    const user = db.find((user) => user.id == id);
    if (!user) {
        throw new Error("User is not found");
    }
    return user;
};

const getter = async (url) => {
    let data = await database();
    const index = url.indexOf("?");
    const slice = url.slice(index + 1);
    const urlSplit = slice.split("&");

    urlSplit.forEach((item) => {
        const [key, value] = item.split("=");
        if (key === "age") {
            if (value === "asc") {
                data.sort((a, b) => a.age - b.age);
            } else if (value === "desc") {
                data.sort((a, b) => b.age - a.age);
            } else {
                throw new Error("Unknown age property");
            }
            return;
        }
        if (key === "gender") {
            data = data.filter((user) => user.gender === value);
            return;
        }
        data = data.filter((user) => {
            if (
                (typeof user[key] === "string" &&
                    user[key].toLowerCase().indexOf(value.toLowerCase()) >
                        -1) ||
                (key !== "age" &&
                    typeof user[key] === "number" &&
                    user[key] == value)
            ) {
                return user;
            }
        });
    });
    return data;
};

const getRequestData = (request) => {
    return new Promise((resolve, reject) => {
        let body = "";

        request.on("data", (chunk) => {
            body = chunk.toString();
        });
        request.on("end", async () => {
            resolve(body);
        });
        request.on("error", (err) => {
            reject(err.message);
        });
    });
};

const postUserData = async (data) => {
    checkUserValidation(data, "POST");
    const db = await database();
    const newUser = {
        id: db.at(-1).id + 1,
        ...data,
        name: capitalizeText(data.name),
    };

    db.push(newUser);
    await fs.writeFile(createPath("db", "users.json"), JSON.stringify(db));
    return newUser;
};

const putUsersData = async (data) => {
    if (!data.length) throw new Error("Data is empty");
    await fs.writeFile(createPath("db", "users.json"), JSON.stringify(data));
    return data;
};

const patchUserData = async (id, data) => {
    validation(data);
    const db = await database();
    const userIndex = db.findIndex((user) => user.id === +id);

    db[userIndex] = {
        ...db[userIndex],
        ...data,
    };
    await fs.writeFile(createPath("db", "users.json"), JSON.stringify(db));
    return db[userIndex];
};

const deleteUserData = async (id) => {
    const db = await database();
    const user = db.find((user) => user.id === +id);
    if (!user) {
        throw new Error("User is not found");
    }
    const filtered = db.filter((user) => user.id !== +id);

    await fs.writeFile(
        createPath("db", "users.json"),
        JSON.stringify(filtered),
    );
    return "success";
};

exports.getter = getter;
exports.fileRead = fileRead;
exports.createPath = createPath;
exports.getUserData = getUserData;
exports.postUserData = postUserData;
exports.putUsersData = putUsersData;
exports.sendResponse = sendResponse;
exports.patchUserData = patchUserData;
exports.getRequestData = getRequestData;
exports.deleteUserData = deleteUserData;
