require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User, Role } = require("../models/users");

const secretKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;

let refreshTokenArr = [];

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        secretKey,
        { expiresIn: "60s" }
    );
};
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        refreshTokenKey,
        { expiresIn: "365d" }
    );
};

const login = async (req, res, next) => {
    const { userName, password } = req.body;
    console.log("come login");
    let message, accessToken, refreshToken, action;
    try {
        const user = await User.findOne({
            attributes: ["id", "email", "user_name", "status"],
            where: {
                user_name: userName,
                password: password,
            },
            include: [
                {
                    model: Role,
                    as: "role",
                },
            ],
        });

        if (user) {
            const infoCookies = { id: user.id, role: user.role[0].id };
            //If status = 1, account is disable
            if (user.status == 1) {
                accessToken = generateAccessToken(infoCookies);
                refreshToken = generateRefreshToken(infoCookies);

                //Save token in array -> should save in database
                refreshTokenArr.push(refreshToken);
                //Save token to cookies
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    //When deploy change: true
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                message = "Login success";
                action = "success";
            } else {
                message =
                    "Your account has been disable, please contact admin to active";
                action = "warning";
            }
        } else {
            message = "Your email or password is not correct";
            action = "error";
        }
        res.send({
            data: {
                user,
                token: accessToken,
                message,
                action,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const refreshToken = (req, res) => {
    // Get refresh token from cookies
    console.log("come refresh");
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.send("You are not authenticated");
    //Check refresh token
    if (!refreshTokenArr.includes(refreshToken)) {
        return res.send("Refresh token is not valid");
    }
    jwt.verify(refreshToken, refreshTokenKey, (err, user) => {
        if (err) {
            console.log(err);
        }
        refreshTokenArr = refreshTokenArr.filter(
            (token) => token !== refreshToken
        );
        let newAccessToken = generateAccessToken(user);
        let newRefreshToken = generateRefreshToken(user);
        refreshTokenArr.push(newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            //When deploy change: true
            secure: false,
            path: "/",
            sameSite: "strict",
        });
        res.send({
            token: newAccessToken,
        });
    });
};
const checkLogin = async (req, res, next) => {
    const token = req.cookies?.token;
    const { id } = jwt.verify(token, secretKey);
    const user = await User.findOne({
        where: {
            id: id,
        },
    });

    try {
        if (user.id) {
            req.data = user;
            next();
        } else {
            res.send("/login");
        }
    } catch (error) {
        console.log(error);
    }
};

const logout = (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokenArr = refreshTokenArr.filter(
        (token) => token !== req.cookies.refreshToken
    );
    res.send("Logout success");
};

const getRole = async (req, res, next) => {
    try {
        const result = await Role.findAll();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    login,
    checkLogin,
    getRole,
    refreshToken,
    logout,
};
