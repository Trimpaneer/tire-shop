import Image from "next/image";
import { Product } from "@/lib/data";
import { Button } from "./Button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="aspect-square relative bg-muted/50 p-6">
                <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-105">


                    <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-primary/10 p-4 text-center text-primary">
                        <span className="text-lg font-bold text-primary mb-1">{product.brand}</span>
                        <span className="text-sm font-medium mb-2">{product.name}</span>
                        <p className="text-xs text-muted-foreground">
                            Diseñada para {product.vehicleType === 'auto' ? 'Automóvil' : 'Camión'} <br />
                            Medida: {product.size}
                        </p>
                    </div>
                </div>
                {!product.inStock && (
                    <div className="absolute top-2 right-2 rounded bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
                        Agotado
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2">
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-semibold leading-tight">{product.name}</h3>
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Medida</span>
                            <span className="font-medium">{product.size}</span>
                        </div>
                        {product.reference && (
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Referencia</span>
                                <span className="font-mono text-xs">{product.reference}</span>
                            </div>
                        )}
                    </div>
                    <div className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price)}
                    </div>
                </div>
                <Button variant="secondary" className="mt-4 w-full" disabled={!product.inStock}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Agregar al Carrito
                </Button>
            </div>
        </div>
    );
}
