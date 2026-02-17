"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnalysisResults } from "@/components/AnalysisResults";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ArrowRight } from "lucide-react";

interface Analysis {
  description: string;
  style: string;
  colors: string[];
  categories: string[];
}

// Create a separate component that uses useSearchParams
function AnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const data = searchParams.get("data");
      if (data) {
        const decoded = JSON.parse(decodeURIComponent(data));
        setAnalysis(decoded);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error parsing analysis data:", error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-b from-background to-card">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-screen bg-linear-to-b from-background to-card">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <p className="text-muted-foreground">
            Unable to load analysis. Please try again.
          </p>
          <Link href="/">
            <Button className="mt-4">Go Back</Button>
          </Link>
        </div>
      </main>
    );
  }

  const categoriesForUrl = encodeURIComponent(
    JSON.stringify(analysis.categories),
  );

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-card">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-primary">Room Analysis</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <AnalysisResults analysis={analysis} />

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-6 border-t border-border">
            <Link href="/">
              <Button variant="outline">Upload Different Photo</Button>
            </Link>
            <Link href={`/recommendations?categories=${categoriesForUrl}`}>
              <Button className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                View Recommendations <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// Main page component with Suspense boundary
export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-linear-to-b from-background to-card">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <LoadingSpinner />
          </div>
        </main>
      }
    >
      <AnalysisContent />
    </Suspense>
  );
}
