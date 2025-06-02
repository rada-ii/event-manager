import { Request } from "express";

// Database entities
export interface User {
  id: number;
  email: string;
  password?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  address: string;
  date: string;
  image?: string;
  user_id: number;
}

// Request types
export interface CreateEventData {
  title: string;
  description: string;
  address: string;
  date: string;
  image: string;
  userId: number;
}

export interface UpdateEventData {
  title: string;
  description: string;
  address: string;
  date: string;
  image: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends LoginRequest {}

// JWT payload
export interface JwtPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

// API responses
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  message: string;
  user: Omit<User, "password">;
  token: string;
}
