const init = require("./init");

init.initMongoose();
const app = init.initExpress(),
    port = 5000;

app.get("/", (_req, res) => {
    res.send("Backend is up!");
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
