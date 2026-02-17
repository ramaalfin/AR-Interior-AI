"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCarousel } from "@/components/ProductCarousel";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getRecommendedProducts } from "@/lib/image-utils";
import productsData from "@/lib/products.json";

// Separate component that uses useSearchParams
function RecommendationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const categoriesParam = searchParams.get("categories");
      if (categoriesParam) {
        const categories = JSON.parse(decodeURIComponent(categoriesParam));
        const recommended = getRecommendedProducts(
          categories,
          productsData.products,
        );
        setProducts(recommended);
      } else {
        setProducts(productsData.products);
      }
    } catch (error) {
      console.error("Error parsing categories:", error);
      setProducts(productsData.products);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-b from-background to-card">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-card">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-primary">
            Recommended Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on your room analysis, we recommend these beautiful pieces for
            your space
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {products.length > 0 ? (
            <>
              <ProductCarousel products={products} />
              <p className="text-center text-sm text-muted-foreground">
                Click on any product card to view details, 3D model, and AR
                preview
              </p>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products found</p>
              <Link href="/">
                <Button>Start Over</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Main page component with Suspense boundary
export default function RecommendationsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-linear-to-b from-background to-card">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <LoadingSpinner />
          </div>
        </main>
      }
    >
      <RecommendationsContent />
    </Suspense>
  );
}
