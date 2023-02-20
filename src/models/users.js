const Sequelize = require("sequelize");
const db = require("../config/connectDB");
const { DataTypes } = require("sequelize");

const User = db.define("user", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});

const Role = db.define("role", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

const User_role = db.define("user_role", {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "id",
        },
    },
    RoleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: "id",
        },
    },
});

Role.belongsToMany(User, { through: User_role, as: "role" });
User.belongsToMany(Role, { through: User_role, as: "role" });

module.exports = {
    User,
    Role,
    User_role,
};
