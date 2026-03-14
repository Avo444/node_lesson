const { usersRouter, authRouter } = require("./routes");
const express = require("express");
const app = express();

app.use(express.json());

app.use("/api", usersRouter);
app.use("/auth", authRouter);

app.listen(3000, (err) => {
    console.log(err ? err : "Server is connected");
});
