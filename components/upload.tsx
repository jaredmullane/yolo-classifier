"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { UploadIcon, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DetectionResult } from "@/components/detection-result"
import { runObjectDetection } from "@/lib/object-detection"

export function Upload() {
  const [image, setImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [detections, setDetections] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = async (file: File) => {
    try {
      setIsProcessing(true)
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)

      // Process the image with object detection
      const results = await runObjectDetection(imageUrl)
      setDetections(results)
    } catch (error) {
      console.error("Error processing image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        processImage(file)
      }
    }
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImage(e.target.files[0])
    }
  }, [])

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const resetImage = useCallback(() => {
    setImage(null)
    setDetections([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  return (
    <div className="w-full">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {!image ? (
        <Card
          className={cn(
            "border-dashed border-2 border-gray-700 rounded-xl h-64 flex flex-col items-center justify-center p-6 transition-colors",
            isDragging && "border-emerald-500 bg-emerald-500/5",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 rounded-full bg-gray-800">
              <UploadIcon className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Drag and drop your image here</p>
              <p className="text-sm text-gray-400 mt-1">or click to browse files</p>
            </div>
            <Button
              onClick={handleButtonClick}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              Select Image
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Detection Results</h2>
            <Button variant="outline" size="icon" onClick={resetImage}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative">
            {isProcessing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 rounded-xl">
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                  <p className="mt-2 text-sm text-gray-300">Processing image...</p>
                </div>
              </div>
            ) : null}

            <DetectionResult imageUrl={image} detections={detections} />
          </div>
        </div>
      )}
    </div>
  )
}

