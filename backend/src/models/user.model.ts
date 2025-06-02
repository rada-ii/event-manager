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
    const stmt = db.prepare(
      "INSERT INTO users (email, password) VALUES (?, ?)"
    );
    const result = stmt.run(email, hashedPassword);

    return {
      id: result.lastInsertRowid as number,
      email,
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle unique constraint violation
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
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
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = stmt.get(email) as User | undefined;

    if (!user) {
      return null; // User not found
    }

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

export function findUserByEmail(email: string): User | null {
  const db = getDatabase();

  try {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = stmt.get(email) as User | undefined;
    return user || null;
  } catch (error) {
    console.error("Error finding user:", error);
    throw new Error("Failed to find user");
  }
}

export function findUserById(id: number): Omit<User, "password"> | null {
  const db = getDatabase();

  try {
    const stmt = db.prepare("SELECT id, email FROM users WHERE id = ?");
    const user = stmt.get(id) as Omit<User, "password"> | undefined;
    return user || null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw new Error("Failed to find user");
  }
}

export function getAllUsers(): Omit<User, "password">[] {
  const db = getDatabase();

  try {
    const stmt = db.prepare("SELECT id, email FROM users ORDER BY id DESC");
    return stmt.all() as Omit<User, "password">[];
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Failed to get users");
  }
}
