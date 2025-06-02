// // API Configuration for Event Manager App
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// export const API_ENDPOINTS = {
//   LOGIN: `${API_URL}/users/login`,
//   SIGNUP: `${API_URL}/users/signup`,
//   EVENTS: `${API_URL}/events`,
//   IMAGES: `${API_URL}/images`,
// };

// // Helper to get full image URL
// export const getImageUrl = (imageName) =>
//   `${API_ENDPOINTS.IMAGES}/${imageName}`;

// // Helper to get event action URL
// export const getEventUrl = (eventId, action = "") => {
//   const base = `${API_ENDPOINTS.EVENTS}/${eventId}`;
//   return action ? `${base}/${action}` : base;
// };
