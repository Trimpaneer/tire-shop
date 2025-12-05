import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">Contáctanos</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Estamos aquí para ayudarte. Visítanos en nuestra sede o escríbenos por WhatsApp para cualquier consulta sobre llantas y servicios.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                    <div className="rounded-lg border bg-card p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Ubicación</h3>
                                    <p className="text-muted-foreground">Fusagasugá, Cundinamarca</p>
                                    <p className="text-sm text-muted-foreground mt-1">RuedaFusa</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium">WhatsApp & Teléfono</h3>
                                    <p className="text-muted-foreground">06 49 46 92 85</p>
                                    <p className="text-sm text-muted-foreground mt-1">Atención rápida por WhatsApp</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Correo Electrónico</h3>
                                    <p className="text-muted-foreground">contacto@ruedafusa.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Horario de Atención</h3>
                                    <p className="text-muted-foreground">Lunes a Sábado: 8:00 AM - 6:00 PM</p>
                                    <p className="text-muted-foreground">Domingos: Cerrado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-lg border bg-card p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6">Envíanos un mensaje</h2>
                    <form className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Nombre
                                </label>
                                <Input id="name" placeholder="Tu nombre" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Teléfono
                                </label>
                                <Input id="phone" placeholder="Tu teléfono" type="tel" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Correo Electrónico
                            </label>
                            <Input id="email" placeholder="tu@email.com" type="email" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Mensaje
                            </label>
                            <textarea
                                id="message"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="¿En qué podemos ayudarte?"
                            />
                        </div>
                        <Button className="w-full" size="lg">
                            Enviar Mensaje
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
