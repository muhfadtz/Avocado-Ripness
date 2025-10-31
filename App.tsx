import React, { useState } from "react";
import UploadCard from "./components/UploadCard";
import ResultCard from "./components/ResultCard";
import CameraCapture from "./components/CameraCapture";
import { PredictionResult } from "./types";
import { AvocadoIcon, ArrowPathIcon } from "./components/Icons";

const API_URL = "https://Dawgggggg-AvocadoRipness.hf.space/predict";

const App: React.FC = () => {
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setResult(null);
    setPreviewURL(null);
    setError(null);
  };

  const handlePredict = async (file: File, preview: string) => {
    setPreviewURL(preview);

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
      formData.append("file", file);

      const maxRetries = 5;
      const retryDelay = 5000;
      let attempt = 0;
      let success = false;
      let data: any = null;

      while (!success && attempt < maxRetries) {
        attempt++;
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 30000);

          const response = await fetch(API_URL, {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Server error: ${response.status} - ${text}`);
          }

          data = await response.json();
          success = true;
        } catch (err: any) {
          console.warn(`Attempt ${attempt} failed:`, err.message);
          if (attempt < maxRetries) await new Promise(res => setTimeout(res, retryDelay));
          else throw err;
        }
      }

      if (data.error) throw new Error(data.error);

      setResult({ label: data.label, confidence: data.confidence });
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError("Failed to analyze avocado. Model might still be starting up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-lime-50/50">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
          <ArrowPathIcon className="w-12 h-12 text-white animate-spin" />
          <p className="mt-4 text-white text-lg font-semibold">Analyzing your avocado...</p>
        </div>
      )}

      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="inline-block bg-white p-4 rounded-full shadow-md mb-4">
              <AvocadoIcon className="w-12 h-12 text-lime-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-lime-900 tracking-tight">
              Avocado Ripeness Recognition
            </h1>
            <p className="mt-2 text-lime-700">Upload an image or capture from camera</p>
          </header>

          {/* Tab Bar */}
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => { setMode("upload"); handleReset(); }}
              className={`px-4 py-2 rounded-lg font-medium ${mode === "upload" ? "bg-lime-600 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Upload
            </button>
            <button
              onClick={() => { setMode("camera"); handleReset(); }}
              className={`px-4 py-2 rounded-lg font-medium ${mode === "camera" ? "bg-lime-600 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Camera
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative animate-fade-in">
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error}</span>
              <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3" aria-label="Close">
                <svg className="fill-current h-6 w-6 text-red-500" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </button>
            </div>
          )}

          {/* Input Mode */}
          {mode === "upload" ? (
            <UploadCard onPredict={handlePredict} isLoading={isLoading} />
          ) : (
            <CameraCapture onCapture={handlePredict} isLoading={isLoading} />
          )}

          {/* Result */}
          {result && !error && (
            <div className="mt-8">
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
