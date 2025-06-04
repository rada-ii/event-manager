import { Pool } from "pg";

let pool: Pool | null = null;

export function initializeDatabase(): Pool {
  if (pool) {
    return pool;
  }

  // Kreiraj connection pool
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  // Test konekcije
  pool
    .connect()
    .then((client) => {
      console.log("✅ PostgreSQL connected successfully");
      client.release();
    })
    .catch((err) => {
      console.error("❌ PostgreSQL connection failed:", err);
    });

  // Kreiraj tabele
  createTables();

  console.log("📊 Database initialization completed");
  return pool;
}

async function createTables(): Promise<void> {
  if (!pool) {
    throw new Error("Database pool not initialized");
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        address VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        image VARCHAR(255),
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
      CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
    `);

    console.log("📊 Database tables created/verified");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    throw error;
  }
}

export function getDatabase(): Pool {
  if (!pool) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return pool;
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("🔒 Database connection closed");
  }
}
