const http = require("http");

const {
    createPath,
    fileRead,
    getExtension,
    getResponseCode,
} = require("./helpers/helper");
const { PORT } = require("./constants/constant");

http.createServer(async (request, response) => {
    let file = null;
    let path = null;

    if (request.url === "/" && request.method === "GET") {
        path = createPath("pages", "index.html");
    } else if (request.url === "/api/users" && request.method === "GET") {
        path = createPath("db", "users.json");
    } else if (
        request.url.match(/\/api\/users\/([0-9]+)/) &&
        request.method === "GET"
    ) {
        path = createPath("db", "users.json");
        const data = JSON.parse(await fileRead(path));
        const id = request.url.match(/\/api\/users\/([0-9]+)/)[1];
        const find = data.find((user) => user.id === +id);

        file = JSON.stringify(find ? find : {});
    } else {
        path = createPath("pages", "error.html");
    }

    if (!file) {
        file = await fileRead(path);
    }
    response.writeHead(getResponseCode(file), {
        "content-type": getExtension(path),
    });

    response.write(file);
    response.end();
}).listen(PORT, (err) => {
    console.log(err ? err : `Server is running 3000 port`);
});
