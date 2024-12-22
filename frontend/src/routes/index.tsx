import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { CoursesList } from "../pages/courses/CoursesList";
import { CourseDetail } from "../pages/courses/CourseDetail";
import { LessonDetail } from "../pages/lessons/LessonDetail";
import { Profile } from "../pages/profile";
import { Dashboard } from "../pages/dashboard";
import { CategoryList } from "../pages/categories/CategoryList";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "courses",
          children: [
            {
              path: "",
              element: <CoursesList />,
            },
            {
              path: ":courseId",
              element: <CourseDetail />,
            },
          ],
        },
        {
          path: "lessons",
          children: [
            {
              path: ":lessonId",
              element: <LessonDetail />,
            },
          ],
        },
        {
          path: "categories",
          children: [
            {
              path: "",
              element: <CategoryList />,
            },
          ],
        },
        {
          path: "profile",
          children: [
            {
              path: "",
              element: <Profile />,
            },
            {
              path: "my-courses",
              element: <CoursesList userOnly={true} />,
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
