const express = require("express");
const app = express();
const PORT = 3000;
const {
    fileRead,
    userFinder,
    createPath,
    sendResponse,
    getUsersData
} = require("./helper/helper");

app.get("/", async (request, response) => {
    try {
        const data = await fileRead(createPath("pages", "index.html"));
        sendResponse(response, data, 200, "text/html");
    } catch (err) {
        const error = JSON.stringify({ error: err.message });
        sendResponse(response, error, 404, "application/json");
    }
});

app.get("/api/users", async (request, response) => {
    try {
        const data = await getUsersData(request.query);
        sendResponse(response, data);
    } catch (err) {
        const error = JSON.stringify({ error: err.message });
        sendResponse(response, error, 404, "application/json");
    }
});

app.get("/api/users/:id", async (request, response) => {
    try {
        const user = await userFinder(request);
        sendResponse(response, user)
    } catch (err) {
        const error = JSON.stringify({ error: err.message });
        sendResponse(response, error, 404, "application/json");
    }
});


app.listen(PORT, (err) => {
    console.log(err ? err : `Server is connected in ${PORT} port`);
});
