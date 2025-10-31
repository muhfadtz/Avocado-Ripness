import React, { useState, useRef, useEffect } from "react";

interface CameraCaptureProps {
  onCapture: (file: File, previewURL: string) => void;
  isLoading?: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, isLoading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (window.location.protocol !== "https:") {
          setError("Camera only works over HTTPS (or localhost).");
          return;
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          // Kadang perlu user interaction di mobile Safari
          await videoRef.current.play().catch(() => {});
          setIsReady(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Cannot access camera. Please allow permission.");
      }
    };

    startCamera();

    return () => {
      // Stop semua track kamera saat keluar
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []); // <--- hanya dijalankan sekali

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "capture.png", { type: "image/png" });
      const previewURL = URL.createObjectURL(blob);
      setCapturedPreview(previewURL);
      onCapture(file, previewURL);
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-sm border border-gray-300 rounded-md overflow-hidden shadow-md">
        {error ? (
          <div className="flex items-center justify-center h-64 bg-red-100 text-red-600 text-center p-4">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => videoRef.current?.play().catch(() => {})}
          />
        )}
      </div>

      <button
        onClick={capturePhoto}
        disabled={isLoading || !isReady}
        className="w-full max-w-sm px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg disabled:opacity-50 transition-all"
      >
        Predict Ripeness
      </button>

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
