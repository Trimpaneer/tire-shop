"use client";

import Link from "next/link";
import { ShoppingCart, Menu, Car, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession, signOut } from "next-auth/react";

export function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
                    <Car className="h-6 w-6" />
                    <span>RuedaFusa</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-primary text-zinc-600">
                        Inicio
                    </Link>
                    <Link href="/catalog" className="transition-colors hover:text-primary text-zinc-600">
                        Catálogo
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-primary text-zinc-600">
                        Contacto
                    </Link>
                    {session && (session.user as any)?.role === 'ADMIN' && (
                        <Link href="/admin" className="transition-colors hover:text-primary text-zinc-600 font-semibold">
                            Administrar
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-4">
                    {status === "loading" ? (
                        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                    ) : session ? (
                        <>
                            <Button variant="ghost" size="icon" className="relative text-zinc-600 hover:text-primary">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="sr-only">Carrito</span>
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                                    0
                                </span>
                            </Button>
                            <div className="hidden md:flex items-center gap-2 text-sm">
                                <User className="h-4 w-4" />
                                <span className="text-zinc-600">{session.user?.email}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => signOut()}
                                className="text-zinc-600 hover:text-primary"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Salir
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/register">
                                <Button variant="ghost" size="sm">
                                    Registrarse
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="secondary" size="sm">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                        </>
                    )}
                    <Button variant="ghost" size="icon" className="md:hidden text-zinc-600 hover:text-primary">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menú</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
