const { Sequelize } = require("sequelize");

const db = new Sequelize(
    "bwtoqmzgexrvhjabebam",
    "u3sf2cvjbiergoun",
    "eaFDpHobTbGF95OeH105",
    {
        host: "bwtoqmzgexrvhjabebam-mysql.services.clever-cloud.com",
        dialect: "mysql",
        //An query
        define: {
            timestamps: false,
        },
        logging: false,
    }
);

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
