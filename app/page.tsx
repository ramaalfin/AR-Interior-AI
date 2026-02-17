"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FileUploadZone } from "@/components/FileUploadZone";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { imageToBase64 } from "@/lib/image-utils";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const base64 = await imageToBase64(file);

      const response = await fetch("/api/analyze-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze room");
      }

      const analysis = await response.json();

      // Encode analysis data in URL
      const analysisJson = encodeURIComponent(JSON.stringify(analysis));
      router.push(`/analysis?data=${analysisJson}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while analyzing the room",
      );
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-card to-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Room Design Analyzer
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                AI-powered furniture recommendations for your space
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-balance text-4xl font-bold text-foreground">
              Transform Your Space with AI
            </h2>
            <p className="text-balance text-lg text-muted-foreground">
              Upload a photo of your room and get personalized furniture
              recommendations powered by Google Gemini AI
            </p>
          </div>

          {/* Upload Section */}
          {isLoading ? (
            <LoadingSpinner message="Analyzing your room... This may take a moment." />
          ) : (
            <div className="space-y-4">
              <FileUploadZone
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
              />

              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Features Section */}
          <div className="grid gap-6 md:grid-cols-3 mt-12">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <span className="text-lg">📸</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Upload & Analyze
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload any room photo and let our AI analyze its style, colors,
                and layout
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <span className="text-lg">✨</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Get Recommendations
              </h3>
              <p className="text-sm text-muted-foreground">
                Receive curated furniture recommendations tailored to your
                room's aesthetic
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <span className="text-lg">🏠</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Visualize in 3D & AR
              </h3>
              <p className="text-sm text-muted-foreground">
                View products in 3D and use AR to preview them in your actual
                room
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
