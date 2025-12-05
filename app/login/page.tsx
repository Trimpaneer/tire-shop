"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email o contraseña incorrectos");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            setError("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-sm">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Ingresa a tu cuenta de RuedaFusa
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Contraseña
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="secondary"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        ¿No tienes cuenta?{" "}
                        <Link href="/register" className="text-secondary hover:underline">
                            Regístrate aquí
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
