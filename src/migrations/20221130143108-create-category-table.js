"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categorys", {
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
      createAt: Sequelize.DATE,
      updateAt: Sequelize.DATE,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("categorys");
  },
};
