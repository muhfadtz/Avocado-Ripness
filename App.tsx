import React, { useState, useRef } from "react";
import { PredictionResult } from "./types";
import { AvocadoIcon, ArrowPathIcon } from "./components/Icons";

// === Komponen CameraCapture ===
interface CameraCaptureProps {
  onCapture: (file: File) => void;
  isLoading?: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, isLoading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Cannot access camera. Please allow permission.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "capture.png", { type: "image/png" });
        onCapture(file);
      }
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!stream ? (
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-lime-600 text-white rounded-lg"
        >
          Start Camera
        </button>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-sm rounded-md shadow-md"
          />
          <button
            onClick={capturePhoto}
            disabled={isLoading}
            className="px-4 py-2 bg-lime-500 text-white rounded-lg disabled:opacity-50"
          >
            Capture & Predict
          </button>
        </>
      )}
    </div>
  );
};

// === Komponen UploadCard ===
interface UploadCardProps {
  onPredict: (file: File) => void;
  onReset: () => void;
  isLoading?: boolean;
  hasResult?: boolean;
}

const UploadCard: React.FC<UploadCardProps> = ({ onPredict, onReset, isLoading, hasResult }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPredict(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="px-4 py-2 bg-lime-500 text-white rounded-lg disabled:opacity-50"
      >
        Upload Image
      </button>
      {hasResult && (
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
        >
          Reset
        </button>
      )}
    </div>
  );
};

// === Komponen ResultCard ===
interface ResultCardProps {
  label: string;
  confidence: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ label, confidence }) => (
  <div className="p-6 bg-white rounded-lg shadow-md text-center">
    <h2 className="text-xl font-bold mb-2">{label}</h2>
    <p className="text-gray-700">Confidence: {(confidence * 100).toFixed(2)}%</p>
  </div>
);

// === Main App ===
const API_URL = "https://Dawgggggg-AvocadoRipness.hf.space/predict"; // Ganti sesuai backend

const App: React.FC = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (file: File) => {
    if (!file) return;

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
      const retryDelay = 5000; // 5 detik
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
          if (attempt < maxRetries) {
            await new Promise((res) => setTimeout(res, retryDelay));
          } else {
            throw err;
          }
        }
      }

      if (data.error) throw new Error(data.error);

      setResult({
        label: data.label,
        confidence: data.confidence,
      });
    } catch (err: any) {
      console.error("Error:", err);
      setError(
        "Failed to analyze avocado. The model might still be starting up. Try again in a few seconds."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
              Upload an image or capture from your camera to check if your avocado is ready to eat!
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

          {/* Upload & Camera */}
          <div className="flex flex-col items-center space-y-6">
            <UploadCard
              onPredict={handlePredict}
              onReset={handleReset}
              isLoading={isLoading}
              hasResult={!!result}
            />
            <CameraCapture onCapture={handlePredict} isLoading={isLoading} />
          </div>

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
