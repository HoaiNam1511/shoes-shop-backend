const Sequelize = require("sequelize");
const db = require("../config/connectDB");
const Category = require("../models/categorys");

const Category_group = db.define(
    "category_group",
    {
        // Model attributes are defined here
        id: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        category_group_title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {}
);

// Category_group.hasMany(Category, {
//     foreignKey: "fk_category_group_id",
// });
// Category.belongsTo(Category_group, {
//     foreignKey: "fk_category_group_id",
// });

module.exports = Category_group;
