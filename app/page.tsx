import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { products } from "@/lib/data";
import { Car, Truck } from "lucide-react";
import { ProductSearch } from "@/components/ui/ProductSearch";

export default function Home() {
  // Show a mix of featured products (e.g., first 2 auto, first 1 truck)
  const featuredProducts = [
    ...products.filter(p => p.vehicleType === 'auto').slice(0, 2),
    ...products.filter(p => p.vehicleType === 'truck').slice(0, 1)
  ];

  return (
    <div className="flex flex-col relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-white/40 z-10" /> {/* Overlay for readability */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: "url('/tire-shop-bg.png')" }}
        />
      </div>
      {/* Hero Section */}
      <section className="relative bg-transparent py-12 text-zinc-900 md:py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-white/80 shadow-md rounded-xl p-6 mb-8 inline-block">
              <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl text-primary">
                Encuentra las llantas perfectas para tu vehículo
              </h1>
              <p className="text-lg text-black md:text-xl">
                Especialistas en llantas para carro y camión. Servicio rápido y profesional.
              </p>
            </div>

            <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-lg bg-white/80 p-6 text-zinc-900 shadow-md border border-secondary/20">
              <p className="text-sm text-muted-foreground text-center w-full">
                Busca por referencia, marca o tamaño (ej. 205/55 R16)
              </p>
              <ProductSearch placeholder="ej. 205/55 R16, Kumho, 15512RW" />
            </div>

            {/* Vehicle Type Selection */}
            <div className="mt-8">
              <div className="inline-block bg-white/80 shadow-md rounded-xl p-4 mb-6">
                <h2 className="text-xl font-bold text-primary">Selecciona tu tipo de vehículo</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Link href="/catalog?filter=auto" className="group relative overflow-hidden rounded-xl bg-white/80 p-6 shadow-sm transition-all hover:shadow-md border border-secondary hover:border-black">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 rounded-full bg-secondary p-3 text-primary">
                      <Car className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Automóvil</h3>
                    <p className="text-muted-foreground text-xs">Llantas para sedanes, SUVs y camionetas.</p>
                  </div>
                </Link>
                <Link href="/catalog?filter=truck" className="group relative overflow-hidden rounded-xl bg-white/80 p-6 shadow-sm transition-all hover:shadow-md border border-secondary hover:border-black">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 rounded-full bg-secondary p-3 text-primary">
                      <Truck className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Camión</h3>
                    <p className="text-muted-foreground text-xs">Llantas de carga pesada y comerciales.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-white/80 shadow-md rounded-xl p-8">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-primary">Llantas Destacadas</h2>
              <Button variant="outline" asChild>
                <Link href="/catalog">Ver Todas</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services / Features */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold">Amplia Selección</h3>
              <p className="text-muted-foreground">Las mejores marcas para autos y camiones.</p>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold">Instalación Profesional</h3>
              <p className="text-muted-foreground">Reserva tu cita en línea y obtén un servicio experto.</p>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold">Mejor Precio Garantizado</h3>
              <p className="text-muted-foreground">Precios competitivos en todas nuestras llantas y servicios.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
