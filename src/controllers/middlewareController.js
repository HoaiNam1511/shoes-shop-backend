const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
            if (err) {
                res.send("Token is not valid");
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        console.log("You need login");
    }
};

const checkAdminAuth = (req, res, next) => {
    if (req.user.role < 2) {
        next();
    } else {
        res.send({
            message: "This feature only available to Admin account",
            action: "warning",
        });
    }
};

module.exports = { verifyToken, checkAdminAuth };
