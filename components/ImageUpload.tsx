"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from 'next/image';

interface Detection {
  bbox: number[];
  confidence: number;
  class: string;
}

export default function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Display the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process the image with YOLOv8
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setProcessedImage(data.image);
        setDetections(data.detections);
      } else {
        console.error('Error processing image:', data.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setDetections([]);
  };

  return (
    <div className="w-full">
      <Card className="bg-gray-900 border border-gray-800">
        <div className="p-4 space-y-4">
          {!processedImage ? (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer bg-gray-800/50 hover:bg-gray-800/80 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video w-full min-h-[400px] border-2 border-dashed border-gray-700 rounded-xl overflow-hidden bg-gray-800/50">
                <Image
                  src={processedImage}
                  alt="Processed image with detections"
                  fill
                  className="object-contain"
                />
                <Button 
                  onClick={handleReset}
                  className="absolute top-4 right-4 bg-gray-900/80 hover:bg-gray-900 text-gray-300 border border-gray-700"
                >
                  Upload New Image
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">Detections:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {detections.map((detection, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-800 rounded-xl bg-gray-800/50 backdrop-blur-sm"
                    >
                      <p className="font-medium text-gray-200">{detection.class}</p>
                      <p className="text-sm text-gray-400">
                        Confidence: {(detection.confidence * 100).toFixed(2)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                <p className="text-gray-300">Processing image...</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 