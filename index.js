const { port } = require("./constants/constant");
const {
    getter,
    fileRead,
    createPath,
    getUserData,
    putUsersData,
    postUserData,
    sendResponse,
    patchUserData,
    getRequestData,
    deleteUserData,
} = require("./helpers/helper");
const http = require("http");

http.createServer(async (request, response) => {
    if (request.url === "/") {
        const data = await fileRead(createPath("pages", "index.html"));
        return sendResponse(response, data, 200, "text/html");
    }
    if (request.url === "/api/users" && request.method === "GET") {
        const data = await fileRead(createPath("db", "users.json"));
        return sendResponse(response, data);
    }
    if (
        request.url.match(/\/api\/users\/([0-9]+)/) &&
        request.method === "GET"
    ) {
        try {
            const id = request.url.split("/").at(-1);
            const data = await getUserData(id);
            sendResponse(response, JSON.stringify(data));
        } catch (err) {
            const error = JSON.stringify({ error: err.message });
            sendResponse(response, error);
        }
        return;
    }

    if (request.url.includes("?") && request.method === "GET") {
        try {
            const data = await getter(request.url);
            sendResponse(response, JSON.stringify(data));
        } catch (err) {
            const error = JSON.stringify({ error: err.message });
            sendResponse(response, error, 400);
        }
        return;
    }

    if (request.url === "/api/users" && request.method === "POST") {
        try {
            const requestData = JSON.parse(await getRequestData(request));
            const userData = await postUserData(requestData);
            sendResponse(response, JSON.stringify(userData), 201);
        } catch (err) {
            const error = JSON.stringify({ error: err.message });
            sendResponse(response, error, 400);
        }
        return;
    }

    if (request.url === "/api/users" && request.method === "PUT") {
        try {
            const requestData = JSON.parse(await getRequestData(request));
            const data = await putUsersData(requestData);
            sendResponse(response, JSON.stringify(data), 201);
        } catch (err) {
            const error = JSON.stringify({ error: err.message });
            sendResponse(response, error, 400);
        }
        return;
    }

    if (
        request.url.match(/\/api\/users\/([0-9]+)/) &&
        request.method === "PATCH"
    ) {
        try {
            const id = request.url.split("/").at(-1);
            const requestData = JSON.parse(await getRequestData(request));
            const data = await patchUserData(id, requestData);

            sendResponse(response, JSON.stringify(data), 201);
        } catch (err) {
            const error = JSON.stringify({ error: err.message });
            sendResponse(response, error, 400);
        }
        return;
    }

    if (
        request.url.match(/\/api\/users\/([0-9]+)/) &&
        request.method === "DELETE"
    ) {
        try {
            const id = request.url.split("/").at(-1);
            const message = await deleteUserData(id);
            sendResponse(response, JSON.stringify({ message: message }), 204);
        } catch (err) {
            const error = JSON.stringify({ error: err.message });
            sendResponse(response, error, 400);
        }
        return;
    }
    const errorPage = await fileRead(createPath("pages", "error.html"));
    sendResponse(response, errorPage, 404, "text/html");
}).listen(port, (err) => {
    console.log(err ? err : `Server is connected in ${port} port`);
});

fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: {
        "content-type": "application/json"
    },
    body: JSON.stringify({
        name: "qristik",
        age: 36,
         gender: "female"
    })
}).then(res => res.json()).then(res => console.log(res)).catch(err => console.log(err));
