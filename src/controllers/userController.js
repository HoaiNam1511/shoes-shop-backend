require("dotenv").config();
const { User, User_role, Role } = require("../models/users");

const ITEM_PER_PAGE = 10;

const getUSer = async (req, res) => {
    let { page, orderBy, sortBy } = req.query;
    if (page) {
        let offSet = (page - 1) * ITEM_PER_PAGE;
        try {
            const result = await User.findAndCountAll({
                attributes: ["id", "email", "user_name", "password", "status"],
                include: [
                    {
                        model: Role,
                        attributes: ["name", "description"],
                        as: "role",
                    },
                ],
                offset: offSet,
                limit: ITEM_PER_PAGE,
                required: false,
                order: [[sortBy || "id", orderBy || "DESC"]],
            });
            const totalPage = await Math.ceil(result.count / ITEM_PER_PAGE);
            res.send({
                totalPage: totalPage,
                data: result.rows,
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const result = await User.findAndCountAll({
                attributes: ["id", "email", "user_name", "password", "status"],
                include: [
                    {
                        model: Role,
                        attributes: ["name", "description"],
                        as: "role",
                    },
                ],
                required: false,
            });
            const totalPage = await Math.ceil(result.count / ITEM_PER_PAGE);
            res.send({
                totalPage: totalPage,
                data: result.rows,
            });
        } catch (error) {
            console.log(error);
        }
    }
};

const createUser = async (req, res, next) => {
    const { email, useName, password, status, role } = req.body;
    let user, checkAlreadyUser;
    try {
        checkAlreadyUser = await User.findOne({
            where: { user_name: useName },
        });
    } catch (error) {
        console.log(error);
    }

    if (checkAlreadyUser) {
        res.send({
            message: "User name had been already",
            action: "warning",
        });
    } else {
        try {
            await User.create({
                email: email,
                user_name: useName,
                password: password,
                status: status,
            });
        } catch (error) {
            console.log(error);
        }

        try {
            user = await User.findOne({
                attributes: ["id"],
                order: [["id", "DESC"]],
            });
        } catch (error) {
            console.log(error);
        }
        try {
            await User_role.create({
                UserId: user.id,
                RoleId: role,
            });
            res.send({
                message: "Add user success",
                action: "add",
            });
        } catch (error) {
            console.log(error);
        }
    }
};

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { userupdate, auth } = req.headers;
    const { email, useName, password, status, role } = req.body;

    try {
        //If user update are 'admin'
        if (userupdate === "admin") {
            //If user login are 'admin'
            if (auth === "admin") {
                //If user update not change name and status
                if (userupdate === useName && +status === 1) {
                    await User.update(
                        {
                            email: email,
                            password: password,
                        },
                        {
                            where: {
                                id: id,
                            },
                        }
                    );
                    res.send({
                        message: "Update user success",
                        action: "update",
                    });
                } else {
                    res.send({
                        message:
                            "Update fail, this account only can update email and password",
                        action: "warning",
                    });
                }
            } else {
                res.send({
                    message: "You are not authentication",
                    action: "warning",
                });
            }
        } else {
            await User.update(
                {
                    email: email,
                    user_name: useName,
                    password: password,
                    status: status,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            await User_role.update(
                {
                    RoleId: role,
                },
                {
                    where: {
                        UserId: id,
                    },
                }
            );
            res.send({
                message: "Update user success",
                action: "update",
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.headers;
    try {
        if (name === "admin") {
            res.send({
                message: "You cannot delete this user",
                action: "warning",
            });
        } else {
            await User.destroy({
                where: {
                    id: id,
                },
            });

            await User_role.destroy({
                where: {
                    UserId: id,
                },
            });
            res.send({
                message: "Delete user success",
                action: "delete",
            });
        }
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    createUser,
    getUSer,
    updateUser,
    deleteUser,
};
