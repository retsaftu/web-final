// components/CourseDetail.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  BookOpen,
  Users,
  Play,
  ArrowLeft,
  Star,
  Calendar,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const {
    courses,
    lessons,
    categories,
    enrollments,
    isLoading,
    error,
    fetchCourse,
    fetchCourseLessons,
  } = useStore();

  React.useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
      fetchCourseLessons(courseId);
    }
  }, [courseId]);

  const course = courses.find((c) => c.id === Number(courseId));
  const courseLessons = lessons.filter((l) => l.courseId === Number(courseId));
  const category = categories.find((c) => c.id === course?.categoryId);
  const enrolledStudents = enrollments.filter(
    (e) => e.courseId === Number(courseId)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading course details...</div>
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

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Course not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Навигация назад */}
      <Link to="/courses">
        <Button variant="ghost" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      {/* Основная информация о курсе */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              {category && <Badge variant="secondary">{category.name}</Badge>}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(course.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                {course.rating || 0}
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About this course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>

          {/* Список уроков */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Course Content
                <span className="text-sm text-muted-foreground">
                  {courseLessons.length} lessons
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseLessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {lesson.description}
                      </p>
                    </div>
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Сайдбар с информацией */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {new Intl.NumberFormat("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    }).format(Number(course.price))}
                  </div>
                </div>
                <Button className="w-full">Enroll Now</Button>
                <Separator />
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration
                    </div>
                    <span>{course.duration || "8 weeks"}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Lessons
                    </div>
                    <span>{courseLessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Students
                    </div>
                    <span>{enrolledStudents.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Прогресс курса */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={33} className="mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                4 of 12 lessons completed
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
