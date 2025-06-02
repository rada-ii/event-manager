import { getDatabase } from "../database.js";
import fs from "fs";
import path from "path";
import { Event, CreateEventData, UpdateEventData } from "../types/index.js";

export function createEvent(eventData: CreateEventData): Event {
  const db = getDatabase();
  const { title, description, address, date, image, userId } = eventData;

  try {
    const stmt = db.prepare(
      "INSERT INTO events (title, description, address, date, image, user_id) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const result = stmt.run(title, description, address, date, image, userId);

    return {
      id: result.lastInsertRowid as number,
      title,
      description,
      address,
      date,
      image,
      user_id: userId,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event");
  }
}

export function updateEvent(
  id: number,
  eventData: UpdateEventData
): Event | null {
  const db = getDatabase();
  const { title, description, address, date, image } = eventData;

  try {
    const stmt = db.prepare(
      "UPDATE events SET title = ?, description = ?, address = ?, date = ?, image = ? WHERE id = ?"
    );
    const result = stmt.run(title, description, address, date, image, id);

    if (result.changes > 0) {
      return {
        id,
        title,
        description,
        address,
        date,
        image,
        user_id: 0, // Will be filled by getEventById if needed
      };
    }
    return null;
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Failed to update event");
  }
}

export function deleteEvent(id: number): boolean {
  const db = getDatabase();

  console.log(`🗑️ Deleting event with ID: ${id}`);

  try {
    // First get the event to find the image filename
    const event = getEventById(id);
    console.log(`📸 Event found:`, event);

    // Delete the event from database
    const deleteEventStmt = db.prepare("DELETE FROM events WHERE id = ?");
    const result = deleteEventStmt.run(id);
    console.log(`🗄️ Database delete result:`, result);

    // If event was deleted and has an image, delete the image file
    if (result.changes > 0 && event?.image) {
      try {
        const imagePath = path.join(
          process.cwd(),
          "public",
          "images",
          event.image
        );
        console.log(`🖼️ Trying to delete image at: ${imagePath}`);

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`✅ Successfully deleted image: ${event.image}`);
        } else {
          console.log(`❌ Image file not found: ${imagePath}`);
        }
      } catch (error) {
        console.error(`💥 Failed to delete image ${event.image}:`, error);
      }
    }

    return result.changes > 0;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Failed to delete event");
  }
}

export function getAllEvents(): Event[] {
  const db = getDatabase();

  try {
    const stmt = db.prepare("SELECT * FROM events ORDER BY id DESC");
    return stmt.all() as Event[];
  } catch (error) {
    console.error("Error getting all events:", error);
    throw new Error("Failed to get events");
  }
}

export function getEventById(id: number): Event | null {
  const db = getDatabase();

  try {
    const stmt = db.prepare("SELECT * FROM events WHERE id = ?");
    const event = stmt.get(id) as Event | undefined;
    return event || null;
  } catch (error) {
    console.error("Error getting event by ID:", error);
    throw new Error("Failed to get event");
  }
}

export function getEventsByUserId(userId: number): Event[] {
  const db = getDatabase();

  try {
    const stmt = db.prepare(
      "SELECT * FROM events WHERE user_id = ? ORDER BY id DESC"
    );
    return stmt.all(userId) as Event[];
  } catch (error) {
    console.error("Error getting events by user ID:", error);
    throw new Error("Failed to get user events");
  }
}

export function searchEvents(query: string): Event[] {
  const db = getDatabase();

  try {
    const searchTerm = `%${query}%`;
    const stmt = db.prepare(`
      SELECT * FROM events 
      WHERE title LIKE ? OR description LIKE ? OR address LIKE ?
      ORDER BY id DESC
    `);
    return stmt.all(searchTerm, searchTerm, searchTerm) as Event[];
  } catch (error) {
    console.error("Error searching events:", error);
    throw new Error("Failed to search events");
  }
}
