import { getDatabase } from "../database.js";
import bcrypt from "bcryptjs";
import { User } from "../types/index.js";

interface CreateUserData {
  email: string;
  password: string;
}

export async function createUser(
  userData: CreateUserData
): Promise<Omit<User, "password">> {
  const db = getDatabase();
  const { email, password } = userData;

  try {
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const query =
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email";
    const result = await db.query(query, [email, hashedPassword]);

    return result.rows[0] as Omit<User, "password">;
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle unique constraint violation for PostgreSQL
    if (error.code === "23505" && error.constraint === "users_email_key") {
      throw new Error("Email already exists");
    }

    throw new Error("Failed to create user");
  }
}

export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<Omit<User, "password"> | null> {
  const db = getDatabase();

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return null; // User not found
    }

    const user = result.rows[0] as User;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (isPasswordValid) {
      return { id: user.id, email: user.email };
    } else {
      return null; // Invalid password
    }
  } catch (error) {
    console.error("Error verifying user credentials:", error);
    throw new Error("Authentication failed");
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = getDatabase();

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await db.query(query, [email]);
    return result.rows.length > 0 ? (result.rows[0] as User) : null;
  } catch (error) {
    console.error("Error finding user:", error);
    throw new Error("Failed to find user");
  }
}

export async function findUserById(
  id: number
): Promise<Omit<User, "password"> | null> {
  const db = getDatabase();

  try {
    const query = "SELECT id, email FROM users WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows.length > 0
      ? (result.rows[0] as Omit<User, "password">)
      : null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw new Error("Failed to find user");
  }
}

export async function getAllUsers(): Promise<Omit<User, "password">[]> {
  const db = getDatabase();

  try {
    const query = "SELECT id, email FROM users ORDER BY id DESC";
    const result = await db.query(query);
    return result.rows as Omit<User, "password">[];
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Failed to get users");
  }
}
