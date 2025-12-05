"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SearchWithSuggestionsProps {
    availableSizes: string[];
}

export function SearchWithSuggestions({ availableSizes }: SearchWithSuggestionsProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredSizes = availableSizes.filter((size) =>
        size.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (size: string) => {
        setQuery(size);
        setIsOpen(false);
        router.push(`/catalog?size=${encodeURIComponent(size)}`);
    };

    const handleSearch = () => {
        if (query) {
            router.push(`/catalog?size=${encodeURIComponent(query)}`);
        }
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
    }, [wrapperRef]);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md">
            <div className="flex w-full gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        autoComplete="new-password"
                        placeholder="ej. 205/55 R16"
                        className="pl-9 !bg-white !text-black placeholder:text-gray-500"
                        style={{ backgroundColor: 'white' }}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                                setIsOpen(false);
                            }
                        }}
                    />
                </div>
                <Button variant="secondary" onClick={handleSearch}>Buscar</Button>
            </div>

            {isOpen && filteredSizes.length > 0 && (
                <div id="search-suggestions-dropdown" className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md">
                    <div className="max-h-60 overflow-y-auto p-1">
                        {filteredSizes.map((size) => (
                            <div
                                key={size}
                                className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 hover:text-black data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer text-black"
                                )}
                                onClick={() => handleSelect(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
