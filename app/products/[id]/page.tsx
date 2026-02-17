"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Eye, Zap } from "lucide-react";
import productsData from "@/lib/products.json";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  modelUrl: string;
  dimensions: string;
  material: string;
  style: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productId = params.id as string;
    const found = productsData.products.find((p) => p.id === productId);
    if (found) {
      setProduct(found);
    } else {
      router.push("/recommendations");
    }
    setIsLoading(false);
  }, [params, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-b from-background to-card">
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
    <main className="min-h-screen bg-linear-to-b from-background to-card">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/recommendations"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            ← Back to Recommendations
          </Link>
          <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div>
            <div className="relative h-96 w-full overflow-hidden rounded-lg bg-muted shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline">
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
                </Badge>
                <Badge className="bg-accent text-accent-foreground">
                  {product.style}
                </Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-b border-border py-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-4xl font-bold text-accent">
                  ${product.price}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Dimensions</p>
                <p className="text-foreground font-medium">
                  {product.dimensions}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Material</p>
                <p className="text-foreground font-medium">
                  {product.material}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">
                View Options
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href={`/products/${product.id}/3d`}>
                  <Button
                    className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                  >
                    <Eye className="h-4 w-4" />
                    View in 3D
                  </Button>
                </Link>
                <Link href={`/products/${product.id}/ar`}>
                  <Button
                    className="w-full flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                    size="lg"
                  >
                    <Zap className="h-4 w-4" />
                    View in AR
                  </Button>
                </Link>
              </div>
            </div>

            <Link href="/recommendations">
              <Button variant="outline" className="w-full">
                Back to Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
