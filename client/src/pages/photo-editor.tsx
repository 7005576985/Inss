import { useState } from "react";
import { Header } from "@/components/photo-editor/header";
import { Sidebar } from "@/components/photo-editor/sidebar";
import { CanvasArea } from "@/components/photo-editor/canvas-area";
import { Toolbar } from "@/components/photo-editor/toolbar";
import { DemoModal } from "@/components/photo-editor/demo-modal";
import { useImageProcessor } from "@/hooks/use-image-processor";
import type { ImageEnhancement } from "@shared/schema";

export default function PhotoEditor() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [enhancements, setEnhancements] = useState<ImageEnhancement>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
  });

  const {
    processImage,
    applyEnhancements,
    downloadImage,
    isProcessing,
    processedImageUrl,
  } = useImageProcessor();

  const handleImageUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setCurrentImage(imageUrl);
    await processImage(file);
  };

  const handleEnhancementChange = (key: keyof ImageEnhancement, value: number) => {
    const newEnhancements = { ...enhancements, [key]: value };
    setEnhancements(newEnhancements);
    if (currentImage) {
      applyEnhancements(currentImage, newEnhancements);
    }
  };

  const handleApplyChanges = () => {
    if (processedImageUrl) {
      setCurrentImage(processedImageUrl);
      setShowBeforeAfter(false);
    }
  };

  return (
    <div className="photo-editor-dark min-h-screen overflow-hidden">
      <Header 
        onDownload={() => downloadImage(processedImageUrl || currentImage)}
        hasImage={!!currentImage}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          onImageUpload={handleImageUpload}
          enhancements={enhancements}
          onEnhancementChange={handleEnhancementChange}
          isProcessing={isProcessing}
          hasImage={!!currentImage}
        />
        
        <div className="flex-1 flex flex-col">
          <CanvasArea
            currentImage={currentImage}
            processedImage={processedImageUrl}
            showBeforeAfter={showBeforeAfter}
            onToggleBeforeAfter={() => setShowBeforeAfter(!showBeforeAfter)}
          />
          
          <Toolbar
            onApplyChanges={handleApplyChanges}
            isProcessing={isProcessing}
            hasChanges={processedImageUrl !== null}
          />
        </div>
      </div>

      <DemoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />

      {/* Floating Demo Button */}
      <button
        onClick={() => setShowDemoModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 gradient-button rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
