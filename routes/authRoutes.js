



const express = require("express");
const { signUp, signIn, getAllUsers } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);


router.get("/users", authMiddleware, getAllUsers);

module.exports = router;



