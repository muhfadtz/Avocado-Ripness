import React, { useState } from "react";
import UploadCard from "./components/UploadCard";
import ResultCard from "./components/ResultCard";
import { PredictionResult } from "./types";
import { AvocadoIcon, ArrowPathIcon } from "./components/Icons";

const API_URL = "backend-avocado-production.up.railway.app/predict"; // Ganti kalau backend beda port

const App: React.FC = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // === Fungsi Prediksi ===
  const handlePredict = async (file: File) => {
    if (!file) return;

    // Validasi ukuran & tipe
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (jpg, png, etc).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large! Maximum size is 5MB.");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file); // Flask expects 'file'

      console.log("📤 Sending file:", file.name, file.type, file.size);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Flask Response:", text);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Parsed response:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        label: data.label,
        confidence: data.confidence,
      });
    } catch (err: any) {
      console.error("🚨 Error calling Flask API:", err);
      setError(
        "Failed to analyze avocado. Please check your image or try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // === Fungsi Reset ===
  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-lime-50/50">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
          <ArrowPathIcon className="w-12 h-12 text-white animate-spin" />
          <p className="mt-4 text-white text-lg font-semibold">
            Analyzing your avocado...
          </p>
          <p className="mt-1 text-white/70 text-sm">
            This might take a few seconds.
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="inline-block bg-white p-4 rounded-full shadow-md mb-4">
              <AvocadoIcon className="w-12 h-12 text-lime-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-lime-900 tracking-tight">
              Avocado Ripeness Recognition
            </h1>
            <p className="mt-2 text-lime-700">
              Upload an image to check if your avocado is ready to eat!
            </p>
          </header>

          {/* Error Alert */}
          {error && (
            <div
              className="mb-6 w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative animate-fade-in"
              role="alert"
            >
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error}</span>
              <button
                onClick={() => setError(null)}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                aria-label="Close"
              >
                <svg
                  className="fill-current h-6 w-6 text-red-500"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </button>
            </div>
          )}

          {/* Upload Card */}
          <UploadCard
            onPredict={handlePredict}
            onReset={handleReset}
            isLoading={isLoading}
            hasResult={!!result}
          />

          {/* Result Card */}
          {result && !error && (
            <div className="mt-8 animate-fade-in-up">
              <ResultCard
                label={result.label}
                confidence={result.confidence}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
