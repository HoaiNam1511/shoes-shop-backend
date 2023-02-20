"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        //Add altering commands here.

        await queryInterface.createTable("user_roles", {
            fk_user_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
            },
            fk_role_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
            },
            createAt: Sequelize.DATE,
            updateAt: Sequelize.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("user_roles");
    },
};
