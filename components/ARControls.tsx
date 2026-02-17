'use client';

import { useRef, useState } from 'react';
import { Camera, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadImage } from '@/lib/image-utils';

interface ARControlsProps {
  modelViewerRef: React.RefObject<HTMLElement>;
}

export function ARControls({ modelViewerRef }: ARControlsProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      const modelViewer = modelViewerRef.current as any;
      if (modelViewer && modelViewer.toBlob) {
        const blob = await modelViewer.toBlob();
        if (blob && canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const img = new Image();
            img.onload = async () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              await downloadImage(canvas, `room-design-${Date.now()}.png`);
            };
            img.src = URL.createObjectURL(blob);
          }
        }
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={handleCapture}
          disabled={isCapturing}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          size="lg"
        >
          <Camera className="h-4 w-4" />
          {isCapturing ? 'Capturing...' : 'Take Photo'}
        </Button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <p className="text-xs text-muted-foreground">
        💡 Tip: You can place the product in your room using AR. Take a photo of your design and download it!
      </p>
    </div>
  );
}
