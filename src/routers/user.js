const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const middlewareController = require("../controllers/middlewareController");
router.post(
    "/create",
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    userController.createUser
);
router.get("/get", middlewareController.verifyToken, userController.getUSer);
router.put(
    "/update/:id",
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    userController.updateUser
);
router.delete(
    "/delete/:id",
    middlewareController.verifyToken,
    middlewareController.checkAdminAuth,
    userController.deleteUser
);
router.get("/", userController.getUSer);

module.exports = router;
