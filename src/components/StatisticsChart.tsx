import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js komponentlarini ro'yxatdan o'tkazamiz
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CustomBarChart() {
  const [values, setValues] = useState([
    10, 20, 15, 40, 50, 60, 90, 20, 30, 40, 50, 60, 10, 20, 15, 40, 50, 60, 90,
    20, 30, 40, 50, 60,
  ]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = Number(value);
    setValues(newValues);
  };

  const data = {
    labels: [
      "Yan",
      "Fev",
      "Mar",
      "Apr",
      "May",
      "Iyun",
      "Yan",
      "Fev",
      "Mar",
      "Apr",
      "May",
      "Iyun",
      "Yan",
      "Fev",
      "Mar",
      "Apr",
      "May",
      "Iyun",
      "Yan",
      "Fev",
      "Mar",
      "Apr",
      "May",
      "Iyun",
    ],
    datasets: [
      {
        label: "Mening ma'lumotim",
        data: values,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      {/* 🧮 Raqam kiritish inputlari */}
      {/* <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {values.map((value, index) => (
          <input
            key={index}
            type="number"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="p-2 border rounded text-center"
          />
        ))}
      </div> */}

      {/* 📈 Grafik */}
      <div className="h-96 bg-white dark:bg-gray-800 p-4 border rounded shadow">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
