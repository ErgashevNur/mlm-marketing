import { useEffect, useState } from "react";

// Convert "HH:MM:SS" to seconds
const hmsToSeconds = (hms: string): number => {
  const [h = "0", m = "0", s = "0"] = hms.split(":");
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
};

// Convert seconds to "HH:MM:SS"
const formatSeconds = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const CountdownTimer = ({ timeString }: { timeString: string }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const savedStart = localStorage.getItem("bonus_start_time");
    const savedDuration = localStorage.getItem("bonus_duration_seconds");

    let remaining = 0;

    if (savedStart && savedDuration) {
      const startTime = parseInt(savedStart, 10);
      const duration = parseInt(savedDuration, 10);
      const now = Math.floor(Date.now() / 1000);

      const elapsed = now - startTime;
      remaining = Math.max(duration - elapsed, 0);
    } else {
      // Birinchi marta kirganda kelgan vaqtni saqlaymiz
      const duration = hmsToSeconds(timeString);
      localStorage.setItem(
        "bonus_start_time",
        `${Math.floor(Date.now() / 1000)}`
      );
      localStorage.setItem("bonus_duration_seconds", `${duration}`);
      remaining = duration;
    }

    setTimeLeft(remaining);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeString]);

  if (timeLeft <= 0) return null;

  return (
    <p className="text-white font-bold text-lg">{formatSeconds(timeLeft)}</p>
  );
};

export default CountdownTimer;
