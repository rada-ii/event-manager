import express from "express";
import { signup, login } from "../controllers/users.controller.js";

const router = express.Router();

// POST /users/signup - Register new user
router.post("/signup", signup);

// POST /users/login - Authenticate user
router.post("/login", login);

export default router;
