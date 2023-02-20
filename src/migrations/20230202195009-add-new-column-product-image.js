"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("product_images", "priority", {
            type: Sequelize.INTEGER(10),
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("product_images");
    },
};
