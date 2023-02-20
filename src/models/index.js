const User = require("./users");
const User_role = require("./userRoles");
const Role = require("./roles");

Product.hasMany(Product_image, { foreignKey: "fk_product_id" });
Product_image.belongsTo(Product, { foreignKey: "fk_product_id" });

Category_group.hasMany(Category, { foreignKey: "fk_category_group_id" });
Category.belongsTo(Category_group, { foreignKey: "fk_category_group_id" });
