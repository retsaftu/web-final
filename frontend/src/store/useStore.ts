// store/useStore.ts
import { apiService } from "@/api/api";
import {
  Category,
  Course,
  Enrollment,
  Rating,
  Lesson,
  ApiError,
} from "@/types/api";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface StoreState {
  // Состояния
  categories: Category[];
  courses: Course[];
  currentCourse: Course | null;
  enrollments: Enrollment[];
  currentCourseRatings: Rating[];
  currentCourseLessons: Lesson[];
  isLoading: boolean;
  error: ApiError | null;

  // Действия для категорий
  fetchCategories: () => Promise<void>;
  createCategory: (data: Omit<Category, "id">) => Promise<void>;

  // Действия для курсов
  fetchCourses: () => Promise<void>;
  fetchCourse: (id: number) => Promise<void>;
  createCourse: (data: Omit<Course, "id" | "created_at">) => Promise<void>;
  updateCourse: (id: number, data: Partial<Course>) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;

  // Действия для записей
  fetchEnrollments: () => Promise<void>;
  createEnrollment: (courseId: number, userId: number) => Promise<void>;
  updateEnrollmentStatus: (id: number, status: string) => Promise<void>;

  // Действия для рейтингов
  fetchCourseRatings: (courseId: number) => Promise<void>;
  createRating: (data: Omit<Rating, "id" | "created_at">) => Promise<void>;

  // Действия для уроков
  fetchCourseLessons: (courseId: number) => Promise<void>;
  createLesson: (data: Omit<Lesson, "id">) => Promise<void>;
  updateLesson: (id: number, data: Partial<Lesson>) => Promise<void>;
  deleteLesson: (id: number) => Promise<void>;

  // Сброс состояний
  resetError: () => void;
  resetStore: () => void;
}

const initialState = {
  categories: [],
  courses: [],
  currentCourse: null,
  enrollments: [],
  currentCourseRatings: [],
  currentCourseLessons: [],
  isLoading: false,
  error: null,
};

export const useStore = create<StoreState>()(
  devtools((set, get) => ({
    ...initialState,

    // Категории
    fetchCategories: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.getCategories();
        set({ categories: response.data, isLoading: false });
      } catch (error) {
        set({
          error: {
            message: "Failed to fetch categories",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    createCategory: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.createCategory(data);
        set((state) => ({
          categories: [...state.categories, response.data],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: {
            message: "Failed to create category",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    // Курсы
    fetchCourses: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.getCourses();
        set({ courses: response.data, isLoading: false });
      } catch (error) {
        set({
          error: {
            message: "Failed to fetch courses",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    fetchCourse: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.getCourse(id);
        set({ currentCourse: response.data, isLoading: false });
      } catch (error) {
        set({
          error: {
            message: "Failed to fetch course",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    createCourse: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.createCourse(data);
        set((state) => ({
          courses: [...state.courses, response.data],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: {
            message: "Failed to create course",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    updateCourse: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.updateCourse(id, data);
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === id ? response.data : course
          ),
          currentCourse: response.data,
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: {
            message: "Failed to update course",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    deleteCourse: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await apiService.deleteCourse(id);
        set((state) => ({
          courses: state.courses.filter((course) => course.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: {
            message: "Failed to delete course",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    // Записи на курсы
    fetchEnrollments: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.getEnrollments();
        set({ enrollments: response.data, isLoading: false });
      } catch (error) {
        set({
          error: {
            message: "Failed to fetch enrollments",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    createEnrollment: async (courseId, userId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.createEnrollment({
          course: courseId,
          user: userId,
          status: "active",
        });
        set((state) => ({
          enrollments: [...state.enrollments, response.data],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: {
            message: "Failed to create enrollment",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    // Рейтинги
    fetchCourseRatings: async (courseId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.getRatings(courseId);
        set({ currentCourseRatings: response.data, isLoading: false });
      } catch (error) {
        set({
          error: {
            message: "Failed to fetch ratings",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    createRating: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.createRating(data);
        set((state) => ({
          currentCourseRatings: [...state.currentCourseRatings, response.data],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: {
            message: "Failed to create rating",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    // Уроки
    fetchCourseLessons: async (courseId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.getLessons(courseId);
        set({ currentCourseLessons: response.data, isLoading: false });
      } catch (error) {
        set({
          error: {
            message: "Failed to fetch lessons",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    createLesson: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiService.createLesson(data);
        set((state) => ({
          currentCourseLessons: [...state.currentCourseLessons, response.data],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: {
            message: "Failed to create lesson",
            status: error.response?.status ?? 500,
          },
          isLoading: false,
        });
      }
    },

    // Утилиты
    resetError: () => set({ error: null }),
    resetStore: () => set(initialState),
  }))
);
