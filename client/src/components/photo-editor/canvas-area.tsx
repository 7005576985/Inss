import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Layers } from "lucide-react";

interface CanvasAreaProps {
  currentImage: string | null;
  processedImage: string | null;
  showBeforeAfter: boolean;
  onToggleBeforeAfter: () => void;
}

export function CanvasArea({ 
  currentImage, 
  processedImage, 
  showBeforeAfter, 
  onToggleBeforeAfter 
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (currentImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
      };
      
      img.src = currentImage;
    }
  }, [currentImage]);

  if (!currentImage) {
    return (
      <div className="flex-1 canvas-container flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="panel-dark rounded-2xl p-8 shadow-2xl">
            <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-600">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 hover-dark rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-medium text-gray-400">Upload an image to get started</p>
                  <p className="text-sm text-gray-500">Your enhanced image will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 canvas-container flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Before/After Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4 panel-dark rounded-full p-1">
            <Button
              onClick={onToggleBeforeAfter}
              variant={showBeforeAfter ? "default" : "ghost"}
              className={`px-4 py-2 rounded-full transition-all ${
                showBeforeAfter 
                  ? "gradient-button text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              Before/After
            </Button>
            <Button
              variant="ghost"
              className="px-4 py-2 text-gray-400 hover:text-white transition-all"
            >
              <Layers className="w-4 h-4 mr-2" />
              Split View
            </Button>
          </div>
        </div>

        {/* Image Canvas */}
        <div className="panel-dark rounded-2xl p-8 shadow-2xl">
          <div className="relative">
            {showBeforeAfter && processedImage ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400 text-center">Before</h4>
                  <img 
                    src={currentImage} 
                    alt="Original" 
                    className="rounded-lg w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-purple-400 text-center">After</h4>
                  <img 
                    src={processedImage} 
                    alt="Enhanced" 
                    className="rounded-lg w-full h-auto max-h-96 object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <img 
                  src={processedImage || currentImage} 
                  alt="Current" 
                  className="rounded-lg max-w-full max-h-96 object-contain"
                />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
