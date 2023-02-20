const Sequelize = require("sequelize");
const db = require("../config/connectDB");

const Product_image = db.define(
    "product_image",
    {
        // Model attributes are defined here
        id: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        fk_product_id: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
        },
        image: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        priority: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
        },
    },
    {}
);

module.exports = Product_image;
