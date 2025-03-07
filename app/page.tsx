import ImageUpload from "@/components/ImageUpload";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-black text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <p className="w-full text-center border-b border-gray-800 bg-black/50 backdrop-blur-md py-4">
          AI Object Detection
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Object Detection
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Upload an image to detect objects using AI. Get bounding boxes and confidence scores in real-time.
        </p>
        <ImageUpload />
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-5xl mt-8">
        <p className="text-xs text-gray-500">Powered by AI and Next.js</p>
      </div>
    </main>
  );
}

