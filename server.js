const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8080;
const cors = require("cors");
const route = require("./src/routers/index");
// app.use(cors());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            "https://ananas-shoe-shop.vercel.app",
            "https://shoes-shop-admin-ten.vercel.app",
            process.env.CORS_URL1,
            process.env.CORS_URL2,
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded());
app.use("/images", express.static("images"));

route(app);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
