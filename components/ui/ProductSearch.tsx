"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SearchSuggestions {
    references: string[];
    names: string[];
    brands: string[];
    sizes: string[];
}

interface ProductSearchProps {
    placeholder?: string;
    className?: string;
}

export function ProductSearch({
    placeholder = "Buscar por referencia, marca, tamaño...",
    className
}: ProductSearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestions>({
        references: [],
        names: [],
        brands: [],
        sizes: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout>();

    // Fetch suggestions from API
    const fetchSuggestions = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setSuggestions({ references: [], names: [], brands: [], sizes: [] });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [query]);

    const handleSelect = (value: string, type: 'reference' | 'name' | 'brand' | 'size') => {
        setQuery(value);
        setIsOpen(false);

        // Navigate to catalog with search query
        router.push(`/catalog?q=${encodeURIComponent(value)}`);
    };

    const handleSearch = () => {
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/catalog?q=${encodeURIComponent(query)}`);
        }
    };

    const handleClear = () => {
        setQuery("");
        setSuggestions({ references: [], names: [], brands: [], sizes: [] });
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const hasSuggestions =
        suggestions.references.length > 0 ||
        suggestions.names.length > 0 ||
        suggestions.brands.length > 0 ||
        suggestions.sizes.length > 0;

    return (
        <div ref={wrapperRef} className={cn("relative w-full max-w-md", className)}>
            <div className="flex w-full gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={placeholder}
                        className="pl-9 pr-9"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => {
                            if (query.trim()) setIsOpen(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            } else if (e.key === 'Escape') {
                                setIsOpen(false);
                            }
                        }}
                    />
                    {isLoading && (
                        <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {!isLoading && query && (
                        <button
                            onClick={handleClear}
                            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <Button variant="secondary" onClick={handleSearch}>
                    Buscar
                </Button>
            </div>

            {isOpen && hasSuggestions && !isLoading && (
                <div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md dark:bg-zinc-950">
                    <div className="max-h-80 overflow-y-auto p-1">
                        {/* References */}
                        {suggestions.references.length > 0 && (
                            <div className="mb-2">
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    Referencias
                                </div>
                                {suggestions.references.map((ref) => (
                                    <div
                                        key={`ref-${ref}`}
                                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => handleSelect(ref, 'reference')}
                                    >
                                        <span className="font-mono text-xs mr-2 text-muted-foreground">REF</span>
                                        {ref}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Brands */}
                        {suggestions.brands.length > 0 && (
                            <div className="mb-2">
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    Marcas
                                </div>
                                {suggestions.brands.map((brand) => (
                                    <div
                                        key={`brand-${brand}`}
                                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => handleSelect(brand, 'brand')}
                                    >
                                        {brand}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sizes */}
                        {suggestions.sizes.length > 0 && (
                            <div className="mb-2">
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    Tamaños
                                </div>
                                {suggestions.sizes.map((size) => (
                                    <div
                                        key={`size-${size}`}
                                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => handleSelect(size, 'size')}
                                    >
                                        {size}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Names */}
                        {suggestions.names.length > 0 && (
                            <div>
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    Productos
                                </div>
                                {suggestions.names.map((name) => (
                                    <div
                                        key={`name-${name}`}
                                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => handleSelect(name, 'name')}
                                    >
                                        {name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
