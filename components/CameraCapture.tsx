import React, { useState, useRef, useEffect } from "react";

interface CameraCaptureProps {
  onCapture: (file: File, previewURL: string) => void;
  isLoading?: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, isLoading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Pastikan site menggunakan HTTPS, kalau tidak camera akan ditolak browser
        if (window.location.protocol !== "https:") {
          setError("Camera requires HTTPS to work in production.");
          return;
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // gunakan kamera belakang di HP
          audio: false,
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error("Cannot access camera:", err);
        setError("Cannot access camera. Please allow camera permission or refresh the page.");
      }
    };

    startCamera();

    return () => {
      // Stop semua track kamera saat komponen di-unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

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
        const previewURL = URL.createObjectURL(blob);
        setCapturedPreview(previewURL);
        onCapture(file, previewURL);
      }
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Video Preview */}
      <div className="w-full max-w-sm border border-gray-300 rounded-md overflow-hidden shadow-md">
        {error ? (
          <div className="flex items-center justify-center h-64 bg-red-100 text-red-600 text-center p-4">
            {error}
          </div>
        ) : stream ? (
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-200 text-gray-600">
            Waiting for camera...
          </div>
        )}
      </div>

      {/* Capture Button */}
      <button
        onClick={capturePhoto}
        disabled={isLoading || !stream}
        className="w-full max-w-sm px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg disabled:opacity-50 transition-all"
      >
        Predict Ripeness
      </button>

      {/* Captured Preview */}
      {capturedPreview && (
        <div className="mt-4 w-full max-w-sm">
          <p className="text-gray-700 mb-1 text-sm">Captured Preview:</p>
          <img
            src={capturedPreview}
            alt="Captured preview"
            className="w-full h-auto rounded-md shadow-sm border border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
