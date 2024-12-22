// layouts/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Toaster } from "sonner";

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-right" />

      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
