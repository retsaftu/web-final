import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  BookOpen,
  Users,
  Calendar,
  Star,
  ChevronRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/store/useStore";

interface CoursesListProps {
  userOnly?: boolean;
}

export const CoursesList: React.FC<CoursesListProps> = ({
  userOnly = false,
}) => {
  const {
    courses,
    categories,
    enrollments,
    currentCourseLessons,
    isLoading,
    error,
    fetchCourses,
  } = useStore();

  React.useEffect(() => {
    fetchCourses(userOnly);
  }, [userOnly]);

  const getCategory = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId);
  };

  const getEnrollmentCount = (courseId: number) => {
    return enrollments.filter((e) => e.courseId === courseId).length;
  };

  const getLessonCount = (courseId: number) => {
    return currentCourseLessons.filter((l) => l.courseId === courseId).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading courses...</div>
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

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-muted-foreground">
          {userOnly
            ? "You haven't enrolled in any courses yet."
            : "No courses available."}
        </div>
        {userOnly && (
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Link key={course.id} to={`/courses/${course.id}`}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            {/* Превью изображение курса */}
            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-primary/10">
                  <BookOpen className="h-10 w-10 text-primary/40" />
                </div>
              )}
              {/* Бейдж категории */}
              {getCategory(course.category) && (
                <Badge className="absolute top-2 left-2" variant="secondary">
                  {getCategory(course.category)?.name}
                </Badge>
              )}
            </div>

            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                {/* Рейтинг курса */}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{course.rating || 4.5}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground line-clamp-2 mb-4">
                {course.description}
              </p>

              {/* Метаданные курса */}
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {course.duration || "8 weeks"}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {getLessonCount(course.id)} lessons
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {getEnrollmentCount(course.id)} students
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(course.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Прогресс для enrolled курсов */}
              {userOnly && (
                <div className="mt-4">
                  <Progress value={33} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    33% completed
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="justify-between">
              <div className="text-lg font-bold">
                {new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(course.price)}
              </div>
              <Button variant="ghost" size="sm">
                {userOnly ? "Continue" : "Learn More"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};
