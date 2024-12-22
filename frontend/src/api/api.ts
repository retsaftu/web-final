// services/api.service.ts
import { Category, Course, Enrollment, Lesson, Rating } from "@/types/api";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // Категории
  getCategories: () => api.get<Category[]>("/categories/"),
  createCategory: (data: Omit<Category, "id">) =>
    api.post<Category>("/categories/", data),

  // Курсы
  getCourses: () => api.get<Course[]>("/courses/"),
  getCourse: (id: number) => api.get<Course>(`/courses/${id}/`),
  createCourse: (data: Omit<Course, "id" | "created_at">) =>
    api.post<Course>("/courses/", data),
  updateCourse: (id: number, data: Partial<Course>) =>
    api.patch<Course>(`/courses/${id}/`, data),
  deleteCourse: (id: number) => api.delete(`/courses/${id}/`),

  // Записи на курсы
  getEnrollments: () => api.get<Enrollment[]>("/enrollments/"),
  createEnrollment: (data: Omit<Enrollment, "id" | "enrollment_date">) =>
    api.post<Enrollment>("/enrollments/", data),
  updateEnrollmentStatus: (id: number, status: string) =>
    api.patch<Enrollment>(`/enrollments/${id}/`, { status }),

  // Рейтинги
  getRatings: (courseId: number) =>
    api.get<Rating[]>(`/courses/${courseId}/ratings/`),
  createRating: (data: Omit<Rating, "id" | "created_at">) =>
    api.post<Rating>("/ratings/", data),

  // Уроки
  getLessons: (courseId: number) =>
    api.get<Lesson[]>(`/courses/${courseId}/lessons/`),
  createLesson: (data: Omit<Lesson, "id">) =>
    api.post<Lesson>("/lessons/", data),
  updateLesson: (id: number, data: Partial<Lesson>) =>
    api.patch<Lesson>(`/lessons/${id}/`, data),
  deleteLesson: (id: number) => api.delete(`/lessons/${id}/`),
};
