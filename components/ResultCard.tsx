import React from "react";
import { PredictionResult } from "../types";

type ResultTheme = {
  text: string;
  ring: string;
  bg: string;
  description: string;
};

const themeMap: Record<string, ResultTheme> = {
  "Matang": {
    text: "text-green-600",
    ring: "stroke-green-500",
    bg: "bg-green-50",
    description: "This avocado is perfectly ripe and ready to eat.",
  },
  "Belum Matang": {
    text: "text-amber-600",
    ring: "stroke-amber-500",
    bg: "bg-amber-50",
    description: "Give it a few more days — it's not quite ready yet.",
  },
  "Mentah": {
    text: "text-amber-600",
    ring: "stroke-amber-500",
    bg: "bg-amber-50",
    description: "Give it a few more days — it's not quite ready yet.",
  },
  "Busuk": {
    text: "text-stone-600",
    ring: "stroke-stone-500",
    bg: "bg-stone-50",
    description: "Unfortunately, this avocado is past its prime.",
  },
};

// ✅ Default theme agar tidak error jika label tidak dikenal
const defaultTheme: ResultTheme = {
  text: "text-gray-600",
  ring: "stroke-gray-400",
  bg: "bg-gray-50",
  description: "Unknown classification result.",
};

const ResultCard: React.FC<PredictionResult> = ({ label, confidence }) => {
  const theme = themeMap[label] || defaultTheme;
  const confidencePercentage = Math.round(confidence * 100);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidencePercentage / 100) * circumference;

  return (
    <div
      className={`w-full ${theme.bg} rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200/80`}
    >
      <div className="flex flex-col items-center text-center">
        <h2
          className="text-xl font-bold text-gray-700 mb-4 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          Prediction Result
        </h2>

        <div
          className="relative w-36 h-36 mb-4 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle
              className="stroke-current text-gray-200"
              strokeWidth="8"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
            />
            <circle
              className={`transform -rotate-90 origin-center ${theme.ring}`}
              strokeWidth="8"
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
                transition:
                  "stroke-dashoffset 1.2s cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${theme.text}`}>
              {confidencePercentage}
            </span>
            <span className={`text-lg font-semibold ${theme.text}`}>%</span>
          </div>
        </div>

        <span
          className={`text-3xl font-bold ${theme.text} animate-fade-in-up`}
          style={{ animationDelay: "300ms" }}
        >
          {label}
        </span>

        <p
          className="mt-2 text-gray-500 animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          {theme.description}
        </p>
      </div>
    </div>
  );
};

export default ResultCard;
