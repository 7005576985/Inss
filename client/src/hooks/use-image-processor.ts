import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { applyImageEnhancements, downloadCanvasImage } from "@/lib/image-utils";
import type { ImageEnhancement } from "@shared/schema";

export function useImageProcessor() {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiRequest('POST', '/api/images/upload', formData);
      return response.json();
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    }
  });

  const enhanceMutation = useMutation({
    mutationFn: async ({ imageUrl, enhancements }: { imageUrl: string, enhancements: ImageEnhancement }) => {
      // Apply enhancements client-side for now
      const enhancedDataUrl = await applyImageEnhancements(imageUrl, enhancements);
      return enhancedDataUrl;
    },
    onSuccess: (enhancedDataUrl) => {
      setProcessedImageUrl(enhancedDataUrl);
    },
    onError: (error) => {
      console.error('Enhancement failed:', error);
    }
  });

  const processImage = async (file: File) => {
    try {
      await uploadMutation.mutateAsync(file);
    } catch (error) {
      console.error('Failed to process image:', error);
    }
  };

  const applyEnhancements = async (imageUrl: string, enhancements: ImageEnhancement) => {
    if (Object.values(enhancements).every(value => value === 0)) {
      setProcessedImageUrl(null);
      return;
    }
    
    try {
      await enhanceMutation.mutateAsync({ imageUrl, enhancements });
    } catch (error) {
      console.error('Failed to apply enhancements:', error);
    }
  };

  const downloadImage = (imageUrl: string | null) => {
    if (imageUrl) {
      downloadCanvasImage(imageUrl, 'enhanced-image.png');
    }
  };

  return {
    processImage,
    applyEnhancements,
    downloadImage,
    isProcessing: uploadMutation.isPending || enhanceMutation.isPending,
    processedImageUrl,
  };
}
