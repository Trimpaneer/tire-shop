"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/catalog?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className={cn("relative w-full max-w-md", className)}>
            <div className="flex w-full gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder={placeholder}
                        className="pl-9"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                </div>
                <Button variant="secondary" onClick={handleSearch}>
                    Buscar
                </Button>
            </div>
        </div>
    );
}
