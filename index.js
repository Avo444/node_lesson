const {
    postUserMiddleware,
    putUsersMiddleware,
    patchUserMiddleware,
    getUserByIdMiddleware,
    getQueriesOperationMiddleware,
    deleteUserMiddleware,
} = require("./middleware/middleware");
const { sendResponse } = require("./helper/helper");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    const data = "<h1>Hello</h1>";
    sendResponse(res, data, 200, "text/html");
});

app.get("/api/users", getQueriesOperationMiddleware, async (req, res) => {
    sendResponse(res, res.locals.users);
});

app.get("/api/users/:id", getUserByIdMiddleware, async (req, res) => {
    sendResponse(res, res.locals.user);
});

app.post("/api/users", postUserMiddleware, async (req, res) => {
    sendResponse(res, res.locals.newUser)
});

app.put("/api/users", putUsersMiddleware, async (req, res) => {
    sendResponse(res, res.locals.data)
});

app.patch("/api/users/:id", patchUserMiddleware, async (req, res) => {
    sendResponse(res, res.locals.user)
});


app.delete("/api/users/:id", deleteUserMiddleware, async (req, res) => {
    sendResponse(res, res.locals.users)
});

app.listen(3000, (err) => {
    console.log(err ? err : "Server is running");
});
