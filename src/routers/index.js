const category = require("./category");
const product = require("./product");
const user = require("./user");
const auth = require("./auth");
function route(app) {
    app.use("/category", category);
    app.use("/product", product);
    app.use("/user", user);
    app.use("/auth", auth);
}

module.exports = route;
