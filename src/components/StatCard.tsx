import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red";
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-600",
    green: "from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-600",
    purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-600",
    orange: "from-orange-500 to-orange-600 bg-orange-50 text-orange-600",
    red: "from-red-500 to-red-600 bg-red-50 text-red-600",
  };

  const iconBgColor = colorClasses[color].split(" ")[2];
  const iconTextColor = colorClasses[color].split(" ")[3];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-slate-200 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-200">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-slate-200 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className={iconTextColor} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
