import React, { useState, useEffect, useRef } from "react";
import { UploadIcon, CheckCircleIcon, ArrowPathIcon } from "./Icons";

interface UploadCardProps {
  onPredict: (file: File) => void;
  onReset: () => void;
  isLoading: boolean;
  hasResult: boolean;
}

const UploadCard: React.FC<UploadCardProps> = ({ onPredict, onReset, isLoading, hasResult }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const processFile = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      setIsUploadingImage(true);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setTimeout(() => {
        setImageFile(file);
        const newPreviewUrl = URL.createObjectURL(file);
        setImagePreview(newPreviewUrl);
        onReset(); 
        setIsUploadingImage(false);
      }, 150);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0] || null);
  };

  const handlePredictClick = () => {
    if (imageFile) {
      onPredict(imageFile);
    }
  };

  const handleResetClick = () => {
    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    onReset();
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
       if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(files[0]);
          fileInputRef.current.files = dataTransfer.files;
       }
    }
  };


  return (
    <div 
      className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center transition-all duration-300 ease-in-out transform hover:shadow-xl"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      
      {!imagePreview && (
        <div 
          className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all flex items-center justify-center min-h-[148px] ${
            isDragging
              ? 'border-lime-600 bg-lime-100 scale-105'
              : 'border-lime-300 hover:border-lime-500 hover:bg-lime-50/50'
          }`}
          onClick={() => !isUploadingImage && fileInputRef.current?.click()}
        >
          {isUploadingImage ? (
            <div className="flex flex-col items-center text-lime-600">
                <ArrowPathIcon className="w-12 h-12 mb-3 animate-spin" />
                <span className="font-semibold">Loading preview...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-lime-600 pointer-events-none">
                <UploadIcon className="w-12 h-12 mb-3" />
                <span className="font-semibold">Click to upload or drag & drop</span>
                <span className="text-sm text-lime-500">PNG or JPG</span>
            </div>
          )}
        </div>
      )}

      {imagePreview && (
        <div className="relative group">
          <img
            src={imagePreview}
            alt="Avocado preview"
            className="w-full h-64 object-cover rounded-xl mb-6 shadow-md"
          />
           <button 
             onClick={handleResetClick}
             className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
             title="Remove image"
           >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={handlePredictClick}
          disabled={!imageFile || isLoading || hasResult}
          className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Predicting...
            </>
          ) : hasResult ? (
             <>
              <CheckCircleIcon className="-ml-1 mr-3 h-5 w-5 text-white" />
              Prediction Complete
             </>
          ) : (
            'Predict Ripeness'
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadCard;