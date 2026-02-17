'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AnalysisResultsProps {
  analysis: {
    description: string;
    style: string;
    colors: string[];
    categories: string[];
  };
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      <Card className="border border-border bg-card p-6">
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Room Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.description}
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-foreground">Interior Style</h3>
            <Badge className="bg-accent text-accent-foreground">
              {analysis.style}
            </Badge>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Color Palette</h3>
            <div className="flex flex-wrap gap-3">
              {analysis.colors.map((color, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className="h-12 w-12 rounded-lg border border-border shadow-sm"
                    style={{
                      backgroundColor: color.toLowerCase().includes('white')
                        ? '#ffffff'
                        : color.toLowerCase().includes('black')
                        ? '#000000'
                        : color.toLowerCase().includes('gray') || color.toLowerCase().includes('grey')
                        ? '#808080'
                        : color.toLowerCase().includes('beige') || color.toLowerCase().includes('cream')
                        ? '#f5f5dc'
                        : color.toLowerCase().includes('warm')
                        ? '#d4a574'
                        : color.toLowerCase().includes('cool')
                        ? '#6b8cae'
                        : '#e8dcc8',
                    }}
                  />
                  <p className="text-xs text-muted-foreground">{color}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">
              Recommended Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.categories.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
