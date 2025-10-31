import React, { useState, useRef, useEffect } from "react";

interface CameraCaptureProps {
  onCapture: (file: File, previewURL: string) => void;
  isLoading?: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, isLoading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  // Start camera on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error("Cannot access camera:", err);
      }
    };

    startCamera();

    return () => {
      // Stop camera when unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
      {/* Live camera preview */}
      <div className="w-full max-w-sm border border-gray-300 rounded-md overflow-hidden shadow-md">
        {stream ? (
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            autoPlay
            playsInline
            muted
            onCanPlay={() => videoRef.current?.play()}
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
        className="px-4 py-2 bg-lime-600 max-w-sm w-full text-white rounded-lg disabled:opacity-50"
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
