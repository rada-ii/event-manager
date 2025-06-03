import type {
  ApiEndpoints,
  AuthResponse,
  Event,
  EventResponse,
  EventListResponse,
  EventFormData,
} from "../types";

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// console.log("🔍 API_URL:", API_URL);
// console.log("🔍 VITE_API_URL:", import.meta.env.VITE_API_URL);

export const API_ENDPOINTS: ApiEndpoints = {
  LOGIN: `${API_URL}/users/login`,
  SIGNUP: `${API_URL}/users/signup`,
  EVENTS: `${API_URL}/events`,
  IMAGES: `${API_URL}/images`,
};

// Helper functions
export const getImageUrl = (imageName: string): string =>
  `${API_ENDPOINTS.IMAGES}/${imageName}`;

export const getEventUrl = (eventId: number, action: string = ""): string => {
  const base = `${API_ENDPOINTS.EVENTS}/${eventId}`;
  return action ? `${base}/${action}` : base;
};

// Auth API calls
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(API_ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
};

export const registerUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(API_ENDPOINTS.SIGNUP, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
};

// Event API calls
export const getAllEvents = async (): Promise<Event[]> => {
  const response = await fetch(API_ENDPOINTS.EVENTS);
  const data: EventListResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch events");
  }

  return data.events || [];
};

export const createEvent = async (
  eventData: EventFormData,
  token: string
): Promise<EventResponse> => {
  const formData = new FormData();
  formData.append("title", eventData.title);
  formData.append("description", eventData.description);
  formData.append("address", eventData.address);
  formData.append("date", eventData.date);

  if (eventData.image) {
    formData.append("image", eventData.image);
  }

  const response = await fetch(API_ENDPOINTS.EVENTS, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data: EventResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create event");
  }

  return data;
};

export const updateEvent = async (
  eventId: number,
  eventData: EventFormData,
  token: string
): Promise<EventResponse> => {
  const formData = new FormData();
  formData.append("title", eventData.title);
  formData.append("description", eventData.description);
  formData.append("address", eventData.address);
  formData.append("date", eventData.date);

  if (eventData.image) {
    formData.append("image", eventData.image);
  }

  const response = await fetch(getEventUrl(eventId), {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data: EventResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update event");
  }

  return data;
};

export const deleteEvent = async (
  eventId: number,
  token: string
): Promise<void> => {
  const response = await fetch(getEventUrl(eventId), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete event");
  }
};

// JWT Helper
export const decodeToken = (
  token: string
): { id: number; email: string; iat: number; exp: number } => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
