const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const middlewareController = require("../controllers/middlewareController");

router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.get("/role", authController.getRole);
router.post("/logout", middlewareController.verifyToken, authController.logout);

module.exports = router;
