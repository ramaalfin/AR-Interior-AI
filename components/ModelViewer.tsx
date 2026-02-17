'use client';

import { useEffect, useRef } from 'react';

interface ModelViewerProps {
  modelUrl: string;
  ar?: boolean;
  title?: string;
}

export function ModelViewer({ modelUrl, ar = false, title }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load model-viewer script if not already loaded
    if (!customElements.get('model-viewer')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden bg-card">
      <model-viewer
        src={modelUrl}
        alt={title || 'Product model'}
        auto-rotate
        camera-controls
        ar={ar}
        ar-modes="scene-viewer webxr quick-look"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#faf8f3',
        }}
      />
    </div>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
