const Sequelize = require("sequelize");
const db = require("../config/connectDB");
const Category_group = require("./category_groups");

const Category = db.define("categorys", {
    // Model attributes are defined here
    id: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    fk_category_group_id: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
    },
    category_title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

Category_group.hasMany(Category, {
    foreignKey: "fk_category_group_id",
    as: "category_group_client",
});

Category.belongsTo(Category_group, {
    foreignKey: "fk_category_group_id",
    as: "category_group_client",
});

Category_group.hasMany(Category, {
    foreignKey: "fk_category_group_id",
    as: "category_group",
});
Category.belongsTo(Category_group, {
    foreignKey: "fk_category_group_id",
    as: "category_group",
});

module.exports = Category;
