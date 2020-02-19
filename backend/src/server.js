const init = require("./init");

const login = require("./routes/user"),
    product = require("./routes/product"),
    order = require("./routes/order");

init.initMongoose();
const app = init.initExpress(),
    port = 5000;

/*
 * Routes
 */
app.get("/", (_req, res) => {
    res.send("Backend is up!");
});

app.use("/user", login);
app.use("/product", product);
app.use("/order", order);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
