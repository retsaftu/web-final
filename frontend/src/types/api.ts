// types/api.types.ts
export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  created_at: string;
  category: number;
  instructor: number;
}

export interface Enrollment {
  id: number;
  enrollment_date: string;
  status: string;
  user: number;
  course: number;
}

export interface Rating {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  course: number;
  user: number;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url: string;
  course: number;
}

export interface ApiError {
  message: string;
  status: number;
}
