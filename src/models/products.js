const Sequelize = require("sequelize");
const db = require("../config/connectDB");
const Category = require("./categorys");
const Product_image = require("./product_images");

const Product = db.define(
    "product",
    {
        // Model attributes are defined here
        id: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        product_code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        product_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        product_price: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        product_sex: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        fk_category_status_id: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
        },
        fk_category_style_id: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
        },
        fk_category_line_id: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
        },
        fk_category_collection_id: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
        },
        fk_category_material_id: {
            type: Sequelize.INTEGER(10),
            allowNull: false,
        },
    },
    {}
);

Product.hasMany(Product_image, {
    foreignKey: "fk_product_id",
    as: "product_images",
});

Product_image.belongsTo(Product, {
    foreignKey: "fk_product_id",
    as: "product_images",
});

// Product.hasOne(Category, { foreignKey: "id" });
// Category.belongsTo(Product, { foreignKey: "id" });
//Status
Category.hasMany(Product, {
    foreignKey: "fk_category_material_id",
    as: "products",
});
Product.belongsTo(Category, {
    foreignKey: "fk_category_material_id",
    as: "products",
});
//Style
Category.hasMany(Product, {
    foreignKey: "fk_category_style_id",
    as: "productStyle",
});
Product.belongsTo(Category, {
    foreignKey: "fk_category_style_id",
    as: "productStyle",
});

module.exports = Product;
