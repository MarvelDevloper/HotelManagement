const express = require("express");

const router = express.Router();


const {

    registerUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser

} = require("../controllers/userController");



// REGISTER

router.post("/register",registerUser);



// LOGIN

router.post("/login",loginUser);



// GET USERS

router.get("/",getUsers);



// UPDATE USER

router.put("/:id",updateUser);



// DELETE USER

router.delete("/:id",deleteUser);



module.exports = router;