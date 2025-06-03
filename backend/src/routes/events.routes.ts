import express from "express";
import {
  create,
  edit,
  deleteItem,
  getAll,
  getSingle,
  getUserEvents,
} from "../controllers/events.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload, handleUploadError } from "../middleware/upload.middleware.js";

const router = express.Router();

// POST /events - Create new event
router.post(
  "/",
  authenticate as any,
  upload.single("image") as any,
  handleUploadError as any,
  create as any
);

// PUT /events/:id - Update event
router.put(
  "/:id",
  authenticate as any,
  upload.single("image") as any,
  handleUploadError as any,
  edit as any
);

// DELETE /events/:id - Delete event
router.delete("/:id", authenticate as any, deleteItem as any);

// GET /events - Get all events (public)
router.get("/", getAll);

// GET /events/my - Get current user's events
router.get("/my", authenticate as any, getUserEvents as any);

// GET /events/:id - Get single event (public)
router.get("/:id", getSingle);

export default router;
