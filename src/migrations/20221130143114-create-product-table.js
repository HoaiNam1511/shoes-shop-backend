"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("products", {
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
            createAt: Sequelize.DATE,
            updateAt: Sequelize.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("products");
    },
};
