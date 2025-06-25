import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CloudUpload, Sun, Palette, Eye, Zap, Scissors, Expand, Crop } from "lucide-react";
import type { ImageEnhancement } from "@shared/schema";

interface SidebarProps {
  onImageUpload: (file: File) => void;
  enhancements: ImageEnhancement;
  onEnhancementChange: (key: keyof ImageEnhancement, value: number) => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export function Sidebar({ 
  onImageUpload, 
  enhancements, 
  onEnhancementChange, 
  isProcessing,
  hasImage 
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-80 panel-dark border-r border-gray-800 flex flex-col">
      {/* Upload Section */}
      <div className="p-6 border-b border-gray-800">
        <div 
          className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer drag-zone"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 hover-dark rounded-full flex items-center justify-center mx-auto">
              <CloudUpload className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">Drop your image here</p>
              <p className="text-gray-400 text-sm">or click to browse</p>
            </div>
            <div className="text-xs text-gray-500">
              Supports JPG, PNG, WEBP up to 10MB
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* AI Enhancement Tools */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Quick Enhance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2 text-white">
              <Zap className="w-5 h-5 text-purple-500" />
              <span>AI Quick Enhance</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="secondary" 
                className="tool-icon p-4 hover-dark hover:bg-gray-700 transition-all text-center flex flex-col space-y-2 h-auto"
                disabled={!hasImage || isProcessing}
              >
                <Sun className="w-6 h-6 text-yellow-400" />
                <span className="text-sm font-medium">Auto Enhance</span>
              </Button>
              <Button 
                variant="secondary" 
                className="tool-icon p-4 hover-dark hover:bg-gray-700 transition-all text-center flex flex-col space-y-2 h-auto"
                disabled={!hasImage || isProcessing}
              >
                <Palette className="w-6 h-6 text-blue-400" />
                <span className="text-sm font-medium">Smart HDR</span>
              </Button>
              <Button 
                variant="secondary" 
                className="tool-icon p-4 hover-dark hover:bg-gray-700 transition-all text-center flex flex-col space-y-2 h-auto"
                disabled={!hasImage || isProcessing}
              >
                <Palette className="w-6 h-6 text-pink-400" />
                <span className="text-sm font-medium">Color Pop</span>
              </Button>
              <Button 
                variant="secondary" 
                className="tool-icon p-4 hover-dark hover:bg-gray-700 transition-all text-center flex flex-col space-y-2 h-auto"
                disabled={!hasImage || isProcessing}
              >
                <Eye className="w-6 h-6 text-green-400" />
                <span className="text-sm font-medium">Sharpen</span>
              </Button>
            </div>
          </div>

          {/* Manual Adjustments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2 text-white">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>Adjustments</span>
            </h3>
            
            {/* Brightness */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Brightness</label>
                <span className="text-sm text-gray-400">{enhancements.brightness}</span>
              </div>
              <Slider
                value={[enhancements.brightness]}
                onValueChange={(value) => onEnhancementChange('brightness', value[0])}
                min={-100}
                max={100}
                step={1}
                disabled={!hasImage || isProcessing}
                className="w-full"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Contrast</label>
                <span className="text-sm text-gray-400">{enhancements.contrast}</span>
              </div>
              <Slider
                value={[enhancements.contrast]}
                onValueChange={(value) => onEnhancementChange('contrast', value[0])}
                min={-100}
                max={100}
                step={1}
                disabled={!hasImage || isProcessing}
                className="w-full"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Saturation</label>
                <span className="text-sm text-gray-400">{enhancements.saturation}</span>
              </div>
              <Slider
                value={[enhancements.saturation]}
                onValueChange={(value) => onEnhancementChange('saturation', value[0])}
                min={-100}
                max={100}
                step={1}
                disabled={!hasImage || isProcessing}
                className="w-full"
              />
            </div>

            {/* Exposure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white">Exposure</label>
                <span className="text-sm text-gray-400">{enhancements.exposure}</span>
              </div>
              <Slider
                value={[enhancements.exposure]}
                onValueChange={(value) => onEnhancementChange('exposure', value[0])}
                min={-100}
                max={100}
                step={1}
                disabled={!hasImage || isProcessing}
                className="w-full"
              />
            </div>
          </div>

          {/* AI Tools */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2 text-white">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <span>AI Tools</span>
            </h3>
            <div className="space-y-3">
              <Button 
                variant="secondary" 
                className="w-full p-3 hover-dark hover:bg-gray-700 transition-all flex items-center space-x-3 justify-start"
                disabled={!hasImage || isProcessing}
              >
                <Scissors className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Background Removal</span>
              </Button>
              <Button 
                variant="secondary" 
                className="w-full p-3 hover-dark hover:bg-gray-700 transition-all flex items-center space-x-3 justify-start"
                disabled={!hasImage || isProcessing}
              >
                <Expand className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Upscale Image</span>
              </Button>
              <Button 
                variant="secondary" 
                className="w-full p-3 hover-dark hover:bg-gray-700 transition-all flex items-center space-x-3 justify-start"
                disabled={!hasImage || isProcessing}
              >
                <Crop className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Smart Crop</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
