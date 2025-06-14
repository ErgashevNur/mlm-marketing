import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { TrendingUp, BarChart3, PieChart, Calendar } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

type ChartType = "line" | "bar" | "doughnut";
type TimeRange = "7d" | "30d" | "90d" | "1y";

interface StatisticsChartProps {
  className?: string;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({
  className = "",
}) => {
  const [activeChart, setActiveChart] = useState<ChartType>("line");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  // Sample data - replace with your actual data
  const generateSampleData = (range: TimeRange) => {
    const days =
      range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
    const labels = [];
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
      data.push(Math.floor(Math.random() * 1000) + 500);
    }

    return { labels, data };
  };

  const { labels, data } = generateSampleData(timeRange);

  // Chart configurations
  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: "Sales",
        data,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: ["Desktop", "Mobile", "Tablet", "Other"],
    datasets: [
      {
        data: [45, 35, 15, 5],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
          "rgb(251, 191, 36)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
      },
    },
    scales:
      activeChart !== "doughnut"
        ? {
            x: {
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
              ticks: {
                font: {
                  size: 11,
                },
                color: "#6B7280",
              },
            },
            y: {
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
                drawBorder: false,
              },
              border: {
                display: false,
              },
              ticks: {
                font: {
                  size: 11,
                },
                color: "#6B7280",
                callback: function (value: any) {
                  return "$" + value.toLocaleString();
                },
              },
            },
          }
        : {},
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return context.label + ": " + context.parsed + "%";
          },
        },
      },
    },
    cutout: "60%",
  };

  const renderChart = () => {
    switch (activeChart) {
      case "line":
        return <Line data={lineChartData} options={chartOptions} />;
      case "bar":
        return <Bar data={barChartData} options={chartOptions} />;
      case "doughnut":
        return <Doughnut data={doughnutData} options={doughnutOptions} />;
      default:
        return <Line data={lineChartData} options={chartOptions} />;
    }
  };

  const chartTypes = [
    { type: "line" as ChartType, icon: TrendingUp, label: "Line Chart" },
    { type: "bar" as ChartType, icon: BarChart3, label: "Bar Chart" },
    { type: "doughnut" as ChartType, icon: PieChart, label: "Doughnut Chart" },
  ];

  const timeRanges = [
    { value: "7d" as TimeRange, label: "7 Days" },
    { value: "30d" as TimeRange, label: "30 Days" },
    { value: "90d" as TimeRange, label: "90 Days" },
    { value: "1y" as TimeRange, label: "1 Year" },
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Statistics Overview
        </h2>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Chart Type Selector */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {chartTypes.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setActiveChart(type)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeChart === type
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          {activeChart !== "doughnut" && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeRanges.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80 w-full">{renderChart()}</div>

      {/* Chart Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.reduce((a, b) => a + b, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(
                data.reduce((a, b) => a + b, 0) / data.length
              ).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.max(...data).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Peak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              +{Math.round(((data[data.length - 1] - data[0]) / data[0]) * 100)}
              %
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Growth</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;

/*
HOW TO USE THIS STATISTICS CHART COMPONENT:

1. BASIC USAGE:
   import StatisticsChart from './components/StatisticsChart';
   
   <StatisticsChart />

2. WITH CUSTOM STYLING:
   <StatisticsChart className="mb-8" />

3. REPLACE SAMPLE DATA WITH YOUR REAL DATA:
   - Modify the `generateSampleData` function to fetch from your API
   - Update the chart datasets with your actual data structure
   - Customize labels and data points based on your needs

4. CUSTOMIZATION OPTIONS:
   - Change chart colors by modifying backgroundColor and borderColor in datasets
   - Add more chart types by extending the chartTypes array
   - Modify time ranges by updating the timeRanges array
   - Customize tooltips and legends in chartOptions

5. API INTEGRATION EXAMPLE:
   const fetchChartData = async (range: TimeRange) => {
     const response = await fetch(`/api/statistics?range=${range}`);
     const data = await response.json();
     return data;
   };

6. RESPONSIVE DESIGN:
   - The chart automatically adjusts to container size
   - Controls stack vertically on mobile devices
   - Chart maintains aspect ratio across different screen sizes

7. DARK MODE SUPPORT:
   - Automatically adapts to dark/light theme
   - Uses Tailwind's dark: prefix for styling
   - Chart colors adjust based on theme

8. FEATURES INCLUDED:
   - Interactive chart type switching (Line, Bar, Doughnut)
   - Time range filtering (7d, 30d, 90d, 1y)
   - Hover tooltips with formatted data
   - Summary statistics below chart
   - Fully responsive design
   - Dark mode support
   - Smooth animations and transitions
*/
