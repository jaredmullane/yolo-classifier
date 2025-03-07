"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { COLORS, DETECTION_CLASSES } from "@/lib/detection-classes"

interface DetectionResultProps {
  imageUrl: string
  detections: any[]
}

export function DetectionResult({ imageUrl, detections }: DetectionResultProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return

    const image = new Image()
    image.crossOrigin = "anonymous"
    image.src = imageUrl

    image.onload = () => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions to match image
      const maxWidth = 800
      const scale = Math.min(1, maxWidth / image.width)
      canvas.width = image.width * scale
      canvas.height = image.height * scale
      setImageDimensions({ width: canvas.width, height: canvas.height })

      // Draw image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

      // Draw bounding boxes
      detections.forEach((detection, index) => {
        const [x, y, width, height] = detection.bbox.map((val: number) => val * scale)
        const classId = detection.class
        const score = detection.score
        const color = COLORS[classId % COLORS.length]

        // Draw rectangle
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, width, height)

        // Draw label background
        const label = `${DETECTION_CLASSES[classId]} ${(score * 100).toFixed(1)}%`
        ctx.fillStyle = color
        const textMetrics = ctx.measureText(label)
        const textHeight = 20
        ctx.fillRect(x, y - textHeight, textMetrics.width + 10, textHeight)

        // Draw label text
        ctx.fillStyle = "#000000"
        ctx.font = "14px Arial"
        ctx.fillText(label, x + 5, y - 5)
      })
    }
  }, [imageUrl, detections])

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative">
        <canvas ref={canvasRef} className="w-full h-auto bg-gray-900 rounded-t-xl" />
      </div>

      <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          {detections.length === 0
            ? "No objects detected"
            : `${detections.length} object${detections.length !== 1 ? "s" : ""} detected`}
        </h3>

        {detections.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {detections.map((detection, index) => {
              const classId = detection.class
              const className = DETECTION_CLASSES[classId]
              const score = detection.score
              const color = COLORS[classId % COLORS.length]

              return (
                <Card key={index} className="p-3 bg-gray-800 border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
                      <span className="font-medium">{className}</span>
                    </div>
                    <Badge variant="outline" className="bg-gray-700">
                      {(score * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

