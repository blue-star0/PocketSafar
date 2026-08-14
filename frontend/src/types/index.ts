export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  total_points: number;
  badges: string[];
  created_at: string;
}

export interface DiaryEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  location_name: string;
  latitude: number | null;
  longitude: number | null;
  mood: string | null;
  rating: number | null;
  photos: DiaryPhoto[];
  entry_date: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiaryPhoto {
  storage_path: string;
  url: string;
  caption: string | null;
  order: number;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  budget: number | null;
  status: "planned" | "active" | "completed";
  stops: TripStop[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TripStop {
  name: string;
  latitude: number;
  longitude: number;
  order: number;
  transport_mode: "car" | "train" | "bus" | "flight" | "bike" | "ship" | "walk";
  estimated_cost: number | null;
  notes: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
