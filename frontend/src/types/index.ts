// API Response types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

// User types
export interface User {
  id: number;
  email: string;
}

export interface AuthResponse extends ApiResponse {
  user: User;
  token: string;
}

// Event types
export interface Event {
  id: number;
  title: string;
  description: string;
  address: string;
  date: string;
  image?: string;
  user_id: number;
  created_at?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  address: string;
  date: string;
  image: File | null;
}

export interface EventResponse extends ApiResponse {
  event: Event;
}

export interface EventListResponse extends ApiResponse {
  events: Event[];
  count: number;
}

// Component props
export interface LoginProps {
  setToken: (token: string) => void;
  switchForm: () => void;
}

export interface RegisterProps {
  switchForm: () => void;
}

export interface EventListProps {
  token: string;
  logout: () => void;
}

export interface EventCardProps {
  event: Event;
  token: string;
  currentUserId: number | null;
  onDelete: (eventId: number) => void;
  onEdit: (event: Event) => void;
}

// API configuration
export interface ApiEndpoints {
  LOGIN: string;
  SIGNUP: string;
  EVENTS: string;
  IMAGES: string;
}

// Environment variables
export interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
