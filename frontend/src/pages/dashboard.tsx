// components/Dashboard.tsx
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "../store/useStore";
import {
  BookOpen,
  Users,
  FolderTree,
  Video,
  TrendingUp,
  Star,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const Dashboard: React.FC = () => {
  const {
    courses,
    enrollments,
    categories,
    currentCourseLessons,
    fetchCourses,
    fetchEnrollments,
    fetchCategories,
    fetchCourseLessons,
    isLoading,
    error,
  } = useStore();

  useEffect(() => {
    // Загружаем все необходимые данные при монтировании
    const loadDashboardData = async () => {
      await Promise.all([
        fetchCourses(),
        fetchEnrollments(),
        fetchCategories(),
        // Загружаем уроки для всех курсов
        ...courses.map((course) => fetchCourseLessons(course.id)),
      ]);
    };

    loadDashboardData();
  }, []);

  // Вычисляем статистику
  const totalStudents = enrollments.length;
  const totalCourses = courses.length;
  const totalCategories = categories.length;
  const totalLessons = currentCourseLessons.length;

  // Вычисляем среднюю оценку курсов
  const averageRating =
    courses.reduce((acc, course) => {
      // Предполагаем, что у курса есть поле с рейтингом
      return acc + (course.rating || 0);
    }, 0) / courses.length || 0;

  // Вычисляем процент роста (можно сравнить с предыдущим периодом)
  const growthRate = 15; // Пример значения

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Основные метрики */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-4 w-4 inline mr-1 text-green-500" />+
              {growthRate}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enrolled Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <Progress value={totalStudents} max={200} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Categories
            </CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <div className="text-xs text-muted-foreground mt-2">
              {categories.slice(0, 3).map((cat) => (
                <span
                  key={cat.id}
                  className="inline-block mr-2 px-2 py-1 bg-gray-100 rounded"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm">
                {averageRating.toFixed(1)} avg. rating
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Последние курсы */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{course.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(course.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {new Intl.NumberFormat("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    }).format(Number(course.price))}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {enrollments.filter((e) => e.course === course.id).length}{" "}
                    students
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
