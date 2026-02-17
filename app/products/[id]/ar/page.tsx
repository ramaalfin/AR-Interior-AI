'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ModelViewer } from '@/components/ModelViewer';
import { ARControls } from '@/components/ARControls';
import { Info, AlertCircle } from 'lucide-react';
import productsData from '@/lib/products.json';

interface Product {
  id: string;
  name: string;
  modelUrl: string;
}

export default function ProductARPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [arSupported, setArSupported] = useState(true);
  const modelViewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const productId = params.id as string;
    const found = productsData.products.find(p => p.id === productId) as Product | undefined;
    if (found) {
      setProduct(found);
    } else {
      router.push('/recommendations');
    }

    // Check AR support
    const checkARSupport = async () => {
      try {
        const isARSupported = await (navigator as any).xr?.isSessionSupported('immersive-ar');
        setArSupported(isARSupported !== false);
      } catch (error) {
        setArSupported(true); // Assume supported for model-viewer fallback
      }
    };

    checkARSupport();
    setIsLoading(false);
  }, [params, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-card">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href={`/products/${product.id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
            ← Back to Product
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">{product.name} - AR View</h1>
            <Link href={`/products/${product.id}/3d`}>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Switch to 3D
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {!arSupported && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">AR may not be supported on this device</p>
                <p>You can still view the 3D model and use the photo capture feature below.</p>
              </div>
            </div>
          )}

          {/* AR Viewer */}
          <div className="rounded-lg border border-border overflow-hidden shadow-lg" style={{ height: '600px' }}>
            <ModelViewer 
              ref={modelViewerRef}
              modelUrl={product.modelUrl}
              title={product.name}
              ar={true}
            />
          </div>

          {/* AR Controls */}
          <ARControls modelViewerRef={modelViewerRef} />

          {/* Info */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">How to use AR</p>
                <ul className="space-y-1">
                  <li>1. Allow camera access when prompted</li>
                  <li>2. Tap or click on your floor or wall to place the product</li>
                  <li>3. Move your phone around to see the product from different angles</li>
                  <li>4. Use pinch gestures to resize the product</li>
                  <li>5. Click &quot;Take Photo&quot; to capture and download your design</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-4 border-t border-border">
            <Link href={`/products/${product.id}`}>
              <Button variant="outline">Back to Details</Button>
            </Link>
            <Link href={`/products/${product.id}/3d`}>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                View in 3D
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
