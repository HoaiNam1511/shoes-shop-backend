const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const middlewareController = require("../controllers/middlewareController");

router.get("/getAllCategoryGroup", categoryController.getALLCategoryGroup);
router.get("/get", categoryController.getAllCategory);
router.post(
    "/create",
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    categoryController.createCategory
);
router.put(
    "/update/:id",
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    categoryController.updateCategory
);
router.delete(
    "/delete/:id",
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    categoryController.deleteCategory
);
router.get("/categoryClient", categoryController.getCategoryClient);
router.get("/", categoryController.getAllCategory);

module.exports = router;
