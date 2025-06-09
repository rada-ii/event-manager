import { getDatabase } from "../database.js";
import fs from "fs";
import path from "path";
import { Event, CreateEventData, UpdateEventData } from "../types/index.js";

export async function createEvent(eventData: CreateEventData): Promise<Event> {
  const db = getDatabase();
  const { title, description, address, date, image, userId } = eventData;

  try {
    const query = `
      INSERT INTO events (title, description, address, date, image, user_id) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    const result = await db.query(query, [
      title,
      description,
      address,
      date,
      image,
      userId,
    ]);

    return result.rows[0] as Event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event");
  }
}

export async function updateEvent(
  id: number,
  eventData: UpdateEventData
): Promise<Event | null> {
  const db = getDatabase();
  const { title, description, address, date, image } = eventData;

  try {
    const query = `
      UPDATE events 
      SET title = $1, description = $2, address = $3, date = $4, image = $5 
      WHERE id = $6 
      RETURNING *
    `;
    const result = await db.query(query, [
      title,
      description,
      address,
      date,
      image,
      id,
    ]);

    if (result.rows.length > 0) {
      return result.rows[0] as Event;
    }
    return null;
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Failed to update event");
  }
}

export async function deleteEvent(id: number): Promise<boolean> {
  const db = getDatabase();

  console.log(`Deleting event with ID: ${id}`);

  try {
    // First get the event to find the image filename
    const event = await getEventById(id);
    console.log(`Event found:`, event);

    // Delete the event from database
    const query = "DELETE FROM events WHERE id = $1";
    const result = await db.query(query, [id]);
    console.log(`Database delete result:`, result);

    // If event was deleted and has an image, delete the image file
    if (result.rowCount && result.rowCount > 0 && event?.image) {
      try {
        const imagePath = path.join(
          process.cwd(),
          "public",
          "images",
          event.image
        );
        console.log(`Trying to delete image at: ${imagePath}`);

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Successfully deleted image: ${event.image}`);
        } else {
          console.log(`Image file not found: ${imagePath}`);
        }
      } catch (error) {
        console.error(`💥 Failed to delete image ${event.image}:`, error);
      }
    }

    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Failed to delete event");
  }
}

export async function getAllEvents(): Promise<Event[]> {
  const db = getDatabase();

  try {
    const query = "SELECT * FROM events ORDER BY id DESC";
    const result = await db.query(query);
    return result.rows as Event[];
  } catch (error) {
    console.error("Error getting all events:", error);
    throw new Error("Failed to get events");
  }
}

export async function getEventById(id: number): Promise<Event | null> {
  const db = getDatabase();

  try {
    const query = "SELECT * FROM events WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? (result.rows[0] as Event) : null;
  } catch (error) {
    console.error("Error getting event by ID:", error);
    throw new Error("Failed to get event");
  }
}

export async function getEventsByUserId(userId: number): Promise<Event[]> {
  const db = getDatabase();

  try {
    const query = "SELECT * FROM events WHERE user_id = $1 ORDER BY id DESC";
    const result = await db.query(query, [userId]);
    return result.rows as Event[];
  } catch (error) {
    console.error("Error getting events by user ID:", error);
    throw new Error("Failed to get user events");
  }
}

export async function searchEvents(query: string): Promise<Event[]> {
  const db = getDatabase();

  try {
    const searchTerm = `%${query}%`;
    const sqlQuery = `
      SELECT * FROM events 
      WHERE title ILIKE $1 OR description ILIKE $2 OR address ILIKE $3
      ORDER BY id DESC
    `;
    const result = await db.query(sqlQuery, [
      searchTerm,
      searchTerm,
      searchTerm,
    ]);
    return result.rows as Event[];
  } catch (error) {
    console.error("Error searching events:", error);
    throw new Error("Failed to search events");
  }
}
