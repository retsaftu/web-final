// layouts/Sidebar.tsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  FolderTree,
  UserCircle,
  ChevronDown,
  ChevronRight,
  BookMarked,
  Clock,
  ShieldCheck,
  Settings,
} from "lucide-react";

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  children?: Array<{
    path: string;
    icon: React.ElementType;
    label: string;
  }>;
}

const navItems: NavItem[] = [
  {
    path: "/",
    icon: LayoutDashboard,
    label: "Главная",
  },
  {
    path: "/learning",
    icon: GraduationCap,
    label: "Обучение",
    children: [
      {
        path: "/courses",
        icon: BookOpen,
        label: "Все курсы",
      },
      {
        path: "/categories",
        icon: FolderTree,
        label: "Категории",
      },
      {
        path: "/my-courses",
        icon: BookMarked,
        label: "Мои курсы",
      },
    ],
  },
  {
    path: "/profile",
    icon: UserCircle,
    label: "Профиль",
    children: [
      {
        path: "/profile/progress",
        icon: Clock,
        label: "Прогресс",
      },
      {
        path: "/profile/certificates",
        icon: ShieldCheck,
        label: "Сертификаты",
      },
      {
        path: "/profile/settings",
        icon: Settings,
        label: "Настройки",
      },
    ],
  },
];

const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["/learning"]);

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.path);

    return (
      <div key={item.path}>
        <div
          className={`
            flex items-center px-4 py-3 text-sm cursor-pointer
            ${hasChildren ? "hover:bg-gray-50" : ""}
          `}
          onClick={() => hasChildren && toggleExpand(item.path)}
        >
          {!hasChildren ? (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center flex-1 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ) : (
            <>
              <item.icon className="w-5 h-5 mr-3 text-gray-700" />
              <span className="flex-1 text-gray-700">{item.label}</span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 border-l border-gray-200">
            {item.children?.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <child.icon className="w-4 h-4 mr-3" />
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <nav className="mt-8">{navItems.map((item) => renderNavItem(item))}</nav>
    </aside>
  );
};

export default Sidebar;
