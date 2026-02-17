'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-grow flex-col justify-between p-4">
        <div className="space-y-2">
          <Badge variant="outline" className="w-fit">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Badge>
          <h3 className="font-semibold text-foreground line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="space-y-3 pt-4">
          <div className="text-2xl font-bold text-accent">
            ${product.price}
          </div>
          <Link href={`/products/${product.id}`}>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="sm"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
