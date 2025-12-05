import Link from "next/link";
import { Car, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-white/80">
            <div className="container mx-auto px-4 py-10 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
                            <Car className="h-6 w-6" />
                            <span>RuedaFusa</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Su socio de confianza para llantas de calidad. Ordene en línea y recoja en nuestro centro de servicio.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Enlaces Rápidos</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
                            <li><Link href="/catalog" className="hover:text-primary">Catálogo</Link></li>
                            <li><Link href="/about" className="hover:text-primary">Nosotros</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contacto</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Servicios</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Instalación de Llantas</li>
                            <li>Balanceo de Ruedas</li>
                            <li>Alineación</li>
                            <li>Almacenamiento de Llantas</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Contáctenos</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>123 Auto Drive,<br />Car City, CC 12345</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>(555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span>info@ruedafusa.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} RuedaFusa. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
