'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ModelViewer } from '@/components/ModelViewer';
import { Info } from 'lucide-react';
import productsData from '@/lib/products.json';

interface Product {
  id: string;
  name: string;
  modelUrl: string;
}

export default function Product3DPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productId = params.id as string;
    const found = productsData.products.find(p => p.id === productId) as Product | undefined;
    if (found) {
      setProduct(found);
    } else {
      router.push('/recommendations');
    }
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
            <h1 className="text-2xl font-bold text-primary">{product.name} - 3D View</h1>
            <Link href={`/products/${product.id}/ar`}>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Switch to AR
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* 3D Viewer */}
          <div className="rounded-lg border border-border overflow-hidden shadow-lg" style={{ height: '600px' }}>
            <ModelViewer 
              modelUrl={product.modelUrl}
              title={product.name}
              ar={false}
            />
          </div>

          {/* Controls Info */}
          <div className="rounded-lg border border-border bg-card p-4 flex gap-3">
            <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">3D Controls</p>
              <ul className="space-y-1">
                <li>• Click and drag to rotate the model</li>
                <li>• Scroll or pinch to zoom in/out</li>
                <li>• Two-finger drag to pan</li>
                <li>• Double-click to reset view</li>
              </ul>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-4 border-t border-border">
            <Link href={`/products/${product.id}`}>
              <Button variant="outline">Back to Details</Button>
            </Link>
            <Link href={`/products/${product.id}/ar`}>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Try in AR
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
