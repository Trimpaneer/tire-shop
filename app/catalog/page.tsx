"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { SizeFilter } from "@/components/catalog/SizeFilter";
import { ProductSearch } from "@/components/ui/ProductSearch";

// Define Product interface matching API response (Prisma model)
interface Product {
    id: string;
    reference?: string;
    name: string;
    brand: string;
    size: string;
    price: number;
    vehicleType: 'auto' | 'truck';
    stock: number;
    image?: string;
}

export default function CatalogPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialFilter = searchParams.get("filter") as 'all' | 'auto' | 'truck' || 'all';
    const initialSize = searchParams.get("size");
    const initialBrand = searchParams.get("brand");
    const initialSort = searchParams.get("sort") || "radial-asc";
    const initialSearchQuery = searchParams.get("q") || "";

    const [filter, setFilter] = useState<'all' | 'auto' | 'truck'>(initialFilter);
    const [selectedSize, setSelectedSize] = useState<string | null>(initialSize);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrand);
    const [sortOption, setSortOption] = useState<string>(initialSort);
    const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all products on mount
    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/products`);
                if (!res.ok) throw new Error('Failed to fetch products');
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    // Sync state with URL params
    useEffect(() => {
        const paramFilter = searchParams.get("filter") as 'all' | 'auto' | 'truck';
        setFilter(paramFilter || 'all');

        const paramSize = searchParams.get("size");
        setSelectedSize(paramSize || null);

        const paramBrand = searchParams.get("brand");
        setSelectedBrand(paramBrand || null);

        const paramSort = searchParams.get("sort");
        setSortOption(paramSort || "radial-asc");

        const paramQuery = searchParams.get("q");
        setSearchQuery(paramQuery || "");
    }, [searchParams]);

    // Update URL when filters change
    const updateFilters = (
        newFilter: 'all' | 'auto' | 'truck',
        newSize: string | null,
        newBrand: string | null,
        newSort: string
    ) => {
        const params = new URLSearchParams();
        if (newFilter !== 'all') params.set('filter', newFilter);
        if (newSize) params.set('size', newSize);
        if (newBrand) params.set('brand', newBrand);
        if (newSort !== 'radial-asc') params.set('sort', newSort);

        router.push(`/catalog?${params.toString()}`);
    };

    const handleCategoryChange = (newFilter: 'all' | 'auto' | 'truck') => {
        setFilter(newFilter);
        setSelectedSize(null);
        updateFilters(newFilter, null, selectedBrand, sortOption);
    };

    const handleSizeChange = (size: string | null) => {
        setSelectedSize(size);
        updateFilters(filter, size, selectedBrand, sortOption);
    };

    const handleBrandChange = (brand: string) => {
        const newBrand = brand === "all" ? null : brand;
        setSelectedBrand(newBrand);
        updateFilters(filter, selectedSize, newBrand, sortOption);
    };

    const handleSortChange = (sort: string) => {
        setSortOption(sort);
        updateFilters(filter, selectedSize, selectedBrand, sort);
    };

    // Helper to extract radial size
    const getRadialSize = (size: string): number => {
        const match = size.match(/R(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
    };

    // Filter products by category first
    const categoryProducts = useMemo(() => {
        return products.filter(product => {
            if (filter === 'all') return true;
            return product.vehicleType === filter;
        });
    }, [filter, products]);

    // Extract unique sizes and brands
    const availableSizes = useMemo(() => {
        const sizes = new Set(categoryProducts.map(p => p.size));
        return Array.from(sizes).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    }, [categoryProducts]);

    const availableBrands = useMemo(() => {
        const brands = new Set(categoryProducts.map(p => p.brand));
        return Array.from(brands).sort();
    }, [categoryProducts]);

    // Filter by search query first
    const searchFilteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return categoryProducts;

        const query = searchQuery.toLowerCase();
        return categoryProducts.filter(product => {
            const referenceText = product.reference || '';
            return (
                referenceText.toLowerCase().includes(query) ||
                product.name.toLowerCase().includes(query) ||
                product.brand.toLowerCase().includes(query) ||
                product.size.toLowerCase().includes(query)
            );
        });
    }, [categoryProducts, searchQuery]);

    // Filter and Sort products
    const filteredProducts = useMemo(() => {
        let result = searchFilteredProducts.filter(product => {
            if (selectedSize && product.size !== selectedSize) return false;
            if (selectedBrand && product.brand !== selectedBrand) return false;
            return true;
        });

        // Sorting
        result.sort((a, b) => {
            if (sortOption === "radial-asc") {
                const radialA = getRadialSize(a.size);
                const radialB = getRadialSize(b.size);
                if (radialA !== radialB) return radialA - radialB;
                return a.name.localeCompare(b.name);
            }
            if (sortOption === "price-asc") {
                return a.price - b.price;
            }
            if (sortOption === "price-desc") {
                return b.price - a.price;
            }
            return 0;
        });

        return result;
    }, [searchFilteredProducts, selectedSize, selectedBrand, sortOption]);

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Catálogo de Llantas</h1>
                <p className="text-muted-foreground">Explora nuestra selección completa de llantas para auto y camión.</p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <ProductSearch placeholder="Buscar por referencia, marca, tamaño..." className="max-w-2xl" />
                {searchQuery && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''} para "{searchQuery}"
                    </p>
                )}
            </div>

            {/* Category Tabs */}
            <div className="mb-8 flex gap-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => handleCategoryChange('all')}
                >
                    Todas
                </Button>
                <Button
                    variant={filter === 'auto' ? 'default' : 'outline'}
                    onClick={() => handleCategoryChange('auto')}
                >
                    Automóvil
                </Button>
                <Button
                    variant={filter === 'truck' ? 'default' : 'outline'}
                    onClick={() => handleCategoryChange('truck')}
                >
                    Camión
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
                    {/* Brand Filter */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Marca</h3>
                        <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={selectedBrand || "all"}
                            onChange={(e) => handleBrandChange(e.target.value)}
                        >
                            <option value="all">Todas las marcas</option>
                            {availableBrands.map((brand) => (
                                <option key={brand} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                    </div>

                    <SizeFilter
                        sizes={availableSizes}
                        selectedSize={selectedSize}
                        onSelectSize={handleSizeChange}
                    />
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Sort Control */}
                    <div className="mb-6 flex items-center justify-end">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Ordenar por:</span>
                            <select
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={sortOption}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="radial-asc">Radial (Menor a Mayor)</option>
                                <option value="price-asc">Precio (Menor a Mayor)</option>
                                <option value="price-desc">Precio (Mayor a Menor)</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className="py-20 text-center">Cargando productos...</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        ...product,
                                        image: product.image || '/images/tire-placeholder.png',
                                        inStock: product.stock > 0,
                                        category: 'all-season' as const
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="py-20 text-center text-muted-foreground">
                            No se encontraron llantas con estos filtros.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
