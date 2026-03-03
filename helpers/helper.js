const path = require("path");
const fs = require("fs").promises;

const createPath = (...list) => path.join(path.resolve(__dirname, ".."), ...list);

const fileRead = async (file) => {
    try {
        const page = await fs.readFile(file, "utf-8");
        return page;
    } catch (err) {
        return err.code;
    }
};

const getExtension = (file) => {
    const ext = path.extname(file);
    switch (ext) {
        case ".html": {
            return "text/html";
        }
        case ".json": {
            return "application/json";
        }
        default: {
            return "text/plain";
        }
    }
};
const getResponseCode = (file) => (file === "ENOENT" ? 404 : 200);

exports.fileRead = fileRead;
exports.createPath = createPath;
exports.getExtension = getExtension;
exports.getResponseCode = getResponseCode;
