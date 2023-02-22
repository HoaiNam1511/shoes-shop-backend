const { Sequelize } = require("sequelize");

const db = new Sequelize("shoes_shop", "root", null, {
    host: "127.0.0.1",
    dialect: "mysql",
    //An query
    define: {
        timestamps: false,
    },
    logging: false,
});
let connectDB = async () => {
    try {
        await db.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
connectDB();
module.exports = db;
