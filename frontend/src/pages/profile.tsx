import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Profile: React.FC = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get("/api/user/profile");
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <div className="rounded-lg border p-6 space-y-4">
        <div>
          <label className="font-medium">Username</label>
          <p>{user?.username}</p>
        </div>
        
        <div>
          <label className="font-medium">Email</label>
          <p>{user?.email}</p>
        </div>
        
        <Link 
          to="/profile/my-courses" 
          className="block mt-4 text-blue-600 hover:underline"
        >
          View My Courses
        </Link>
      </div>
    </div>
  );
};