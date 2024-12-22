import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const LessonDetail: React.FC = () => {
  const { lessonId } = useParams();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const response = await axios.get(`/api/lessons/${lessonId}`);
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{lesson?.title}</h1>
      
      {lesson?.video_url && (
        <div className="aspect-video">
          <iframe
            src={lesson.video_url}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}
      
      <div className="prose max-w-none">
        {lesson?.content}
      </div>
    </div>
  );
};