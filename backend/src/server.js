const init = require("./init");

const login = require("./routes/api/login");

init.initMongoose();
const app = init.initExpress(),
    port = 5000;

/*
 * Routes
 */
app.get("/", (_req, res) => {
    res.send("Backend is up!");
});

app.use("/api/login", login);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
