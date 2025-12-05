import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SizeFilterProps {
    sizes: string[];
    selectedSize: string | null;
    onSelectSize: (size: string | null) => void;
}

export function SizeFilter({ sizes, selectedSize, onSelectSize }: SizeFilterProps) {
    return (
        <div className="w-full rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="mb-4 font-semibold">Filtrar por Medida</h3>
            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2">
                <Button
                    variant={selectedSize === null ? "default" : "ghost"}
                    className={cn("justify-start", selectedSize === null && "bg-primary text-primary-foreground")}
                    onClick={() => onSelectSize(null)}
                >
                    Todas las Medidas
                </Button>
                {sizes.map((size) => (
                    <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "ghost"}
                        className={cn("justify-start", selectedSize === size && "bg-primary text-primary-foreground")}
                        onClick={() => onSelectSize(size)}
                    >
                        {size}
                    </Button>
                ))}
            </div>
        </div>
    );
}
