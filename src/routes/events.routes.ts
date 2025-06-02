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
  authenticate,
  upload.single("image"),
  handleUploadError,
  create
);

// PUT /events/:id - Update event
router.put(
  "/:id",
  authenticate,
  upload.single("image"),
  handleUploadError,
  edit
);

// DELETE /events/:id - Delete event
router.delete("/:id", authenticate, deleteItem);

// GET /events - Get all events (public)
router.get("/", getAll);

// GET /events/my - Get current user's events
router.get("/my", authenticate, getUserEvents);

// GET /events/:id - Get single event (public)
router.get("/:id", getSingle);

export default router;
