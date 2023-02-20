"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //Add altering commands here.

    await queryInterface.createTable("product_images", {
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
      createAt: Sequelize.DATE,
      updateAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("product_images");
  },
};
