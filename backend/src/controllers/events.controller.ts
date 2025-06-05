import { Request, Response } from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getEventsByUserId,
} from "../models/event.model.js";
import { deleteCloudinaryImage } from "../middleware/upload.middleware.js";

// Extend Request interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
  file?: Express.Multer.File & {
    path: string; // Cloudinary URL
    filename: string; // Cloudinary public_id
  };
}

export async function create(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { title, description, address, date } = req.body;
    const image = req.file;

    console.log("📝 Creating event with data:", {
      title,
      description,
      address,
      date,
      image: image?.path || "no image",
    });

    if (
      !title?.trim() ||
      !description?.trim() ||
      !address?.trim() ||
      !date ||
      !image
    ) {
      res
        .status(400)
        .json({ error: "All fields are required including image" });
      return;
    }

    if (isNaN(Date.parse(date))) {
      res.status(400).json({ error: "Invalid date format" });
      return;
    }

    const event = await createEvent({
      title: title.trim(),
      description: description.trim(),
      address: address.trim(),
      date,
      image: image.path, // Cloudinary URL
      userId: req.user.id,
    });

    console.log("✅ Event created successfully:", event);
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error: any) {
    console.error("❌ Create event error:", error);
    res
      .status(500)
      .json({ error: "Failed to create event", message: error.message });
  }
}

export async function edit(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { title, description, address, date } = req.body;
    const image = req.file;

    console.log("✏️ Editing event with ID:", id);

    if (!title?.trim() || !description?.trim() || !address?.trim() || !date) {
      res
        .status(400)
        .json({ error: "Title, description, address and date are required" });
      return;
    }

    if (isNaN(Date.parse(date))) {
      res.status(400).json({ error: "Invalid date format" });
      return;
    }

    const existingEvent = await getEventById(Number(id));
    if (!existingEvent) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (existingEvent.user_id !== req.user.id) {
      res.status(403).json({ error: "You can only edit your own events" });
      return;
    }

    // If new image is uploaded, delete old image from Cloudinary
    let imageUrl = existingEvent.image;
    if (image) {
      imageUrl = image.path;

      // Delete old image (extract public_id from URL)
      if (
        existingEvent.image &&
        existingEvent.image.includes("cloudinary.com")
      ) {
        try {
          const urlParts = existingEvent.image.split("/");
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split(".")[0];
          await deleteCloudinaryImage(`event-manager/${publicId}`);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
    }

    const updatedEvent = await updateEvent(Number(id), {
      title: title.trim(),
      description: description.trim(),
      address: address.trim(),
      date,
      image: imageUrl || "default.jpg",
    });

    if (updatedEvent) {
      console.log("✅ Event updated successfully:", updatedEvent);
      res.json({ message: "Event updated successfully", event: updatedEvent });
    } else {
      res.status(500).json({ error: "Failed to update event" });
    }
  } catch (error: any) {
    console.error("❌ Edit event error:", error);
    res
      .status(500)
      .json({ error: "Failed to update event", message: error.message });
  }
}

export async function deleteItem(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting event with ID:", id);

    const event = await getEventById(Number(id));
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (event.user_id !== req.user.id) {
      res.status(403).json({ error: "You can only delete your own events" });
      return;
    }

    // Delete image from Cloudinary before deleting event
    if (event.image && event.image.includes("cloudinary.com")) {
      try {
        const urlParts = event.image.split("/");
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split(".")[0];
        await deleteCloudinaryImage(`event-manager/${publicId}`);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    const success = await deleteEvent(Number(id));
    if (success) {
      console.log("✅ Event deleted successfully");
      res.json({ message: "Event deleted successfully" });
    } else {
      res.status(500).json({ error: "Failed to delete event" });
    }
  } catch (error: any) {
    console.error("❌ Delete event error:", error);
    res
      .status(500)
      .json({ error: "Failed to delete event", message: error.message });
  }
}

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    console.log("📋 Getting all events");
    const events = await getAllEvents();
    console.log(`✅ Found ${events.length} events`);
    res.json({ events, count: events.length });
  } catch (error: any) {
    console.error("❌ Get all events error:", error);
    res
      .status(500)
      .json({ error: "Failed to get events", message: error.message });
  }
}

export async function getSingle(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    console.log("🔍 Getting event with ID:", id);

    const event = await getEventById(Number(id));

    if (event) {
      console.log("✅ Event found:", event);
      res.json({ event });
    } else {
      console.log("❌ Event not found");
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error: any) {
    console.error("❌ Get single event error:", error);
    res
      .status(500)
      .json({ error: "Failed to get event", message: error.message });
  }
}

export async function getUserEvents(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    console.log("👤 Getting events for user ID:", req.user.id);
    const events = await getEventsByUserId(req.user.id);
    console.log(`✅ Found ${events.length} events for user`);
    res.json({ events, count: events.length });
  } catch (error: any) {
    console.error("❌ Get user events error:", error);
    res
      .status(500)
      .json({ error: "Failed to get user events", message: error.message });
  }
}
