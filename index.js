const http = require("http");

const {
    fileRead,
    createPath,
    deleteUser,
    putUsersData,
    postUserData,
    sendResponse,
    patchUserData,
    getRequestData,
    filterByGetter,
} = require("./helpers/helper");
const { PORT } = require("./constants/constant");

http.createServer(async (request, response) => {
    //  GET
    if (request.url === "/" && request.method === "GET") {
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
        const allData = JSON.parse(
            await fileRead(createPath("db", "users.json")),
        );
        const id = request.url.split("/").at(-1);
        const find = allData.find((user) => user.id == id);
        const data = JSON.stringify(find ? find : {});
        return sendResponse(response, data);
    }
    if (request.url.includes("?") && request.method === "GET") {
        const data = JSON.stringify(await filterByGetter(request.url));
        return sendResponse(response, data);
    }

    // POST
    if (request.url === "/api/users" && request.method === "POST") {
        try {
            const body = JSON.parse(await getRequestData(request));
            const user = await postUserData(body);

            sendResponse(response, JSON.stringify(user), 201);
        } catch (err) {
            const error = JSON.stringify({ error: err.message });
            sendResponse(response, error, 400);
        }
        return;
    }
    // PUT
    if (request.url === "/api/users" && request.method === "PUT") {
        try {
            const body = JSON.parse(await getRequestData(request));
            const user = await putUsersData(body);

            sendResponse(response, JSON.stringify(user), 201);
        } catch (err) {
            const error = JSON.stringify({ error: err.message });
            sendResponse(response, error, 400);
        }
        return;
    }
    // PATCH
    if (
        request.url.match(/\/api\/users\/([0-9]+)/) &&
        request.method === "PATCH"
    ) {
        try {
            const id = +request.url.split("/").at(-1);
            const body = JSON.parse(await getRequestData(request));
            const data = await patchUserData(id, body);
            const getStatus = data.error ? 404 : 201;
            sendResponse(response, JSON.stringify(data), getStatus);
        } catch (err) {
            const error = JSON.stringify({ error: err.message });
            sendResponse(response, error, 400);
        }

        return;
    }
    // DELETE
    if (
        request.url.match(/\/api\/users\/([0-9]+)/) &&
        request.method === "DELETE"
    ) {
        try {
            const id = +request.url.split("/").at(-1);
            const data = await deleteUser(id);
            sendResponse(response, JSON.stringify(data));
        } catch (err) {
            const error = JSON.stringify({ error: err.message });
            sendResponse(response, error, 404);
        }
        return;
    }
    const errorPage = await fileRead(createPath("pages", "error.html"));
    sendResponse(response, errorPage, 404, "text/html");
}).listen(PORT, (err) => {
    console.log(err ? err : `Server is running 3000 port`);
});

//  fetch("http://localhost:3000/api/users", {
//     method: "POST",
//     headers: {
//         "content-type": "application/json",
//     },
//     body: JSON.stringify({
//         name: "Gago",
//         age: 24
//     })
// })
// .then(res => res.json())
// .then(data => console.log("Added:", data))
// .catch(err => console.error("Error:", err));
