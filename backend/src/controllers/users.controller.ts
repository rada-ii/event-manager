import { Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  verifyUserCredentials,
} from "../models/user.model.js";
import { generateToken } from "../middleware/auth.middleware.js";
import { LoginRequest, SignupRequest } from "../types/index.js";

export async function signup(
  req: Request<{}, {}, SignupRequest>,
  res: Response
): Promise<void> {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email?.trim() || !password?.trim()) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }

    // Password validation
    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
      return;
    }

    // Check if email already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "Email is already registered" });
      return;
    }

    // Create user
    const newUser = await createUser({ email: email.trim(), password });
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Registration failed",
      message: error.message || "An error occurred during registration",
    });
  }
}

export async function login(
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<void> {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email?.trim() || !password?.trim()) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Verify credentials
    const user = await verifyUserCredentials(email.trim(), password);

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      message: error.message || "An error occurred during login",
    });
  }
}
