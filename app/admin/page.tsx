"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface Product {
    id: string;
    reference?: string;
    name: string;
    brand: string;
    size: string;
    price: number;
    vehicleType: string;
    stock: number;
}

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        reference: '',
        name: '',
        brand: '',
        size: '',
        price: 0,
        vehicleType: 'auto',
        stock: 0
    });

    // Filter products based on search query
    const filteredProducts = products.filter(product => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        const priceString = product.price.toString();
        const vehicleTypeText = product.vehicleType === 'auto' ? 'auto automóvil' : 'truck camión';
        const referenceText = product.reference || '';

        return (
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.size.toLowerCase().includes(query) ||
            priceString.includes(query) ||
            vehicleTypeText.includes(query) ||
            referenceText.toLowerCase().includes(query)
        );
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
            router.push("/");
        }
    }, [status, session, router]);

    useEffect(() => {
        if (status === "authenticated" && (session?.user as any)?.role === "ADMIN") {
            fetchProducts();
        }
    }, [status, session]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (mode === 'add') {
                const res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    alert('Producto agregado exitosamente');
                    fetchProducts();
                    setMode('list');
                    resetForm();
                }
            } else if (mode === 'edit' && selectedProduct) {
                const res = await fetch(`/api/products/${selectedProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (res.ok) {
                    alert('Producto actualizado exitosamente');
                    fetchProducts();
                    setMode('list');
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            return;
        }

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Producto eliminado exitosamente');
                fetchProducts();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar el producto');
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            reference: product.reference || '',
            name: product.name,
            brand: product.brand,
            size: product.size,
            price: product.price,
            vehicleType: product.vehicleType,
            stock: product.stock
        });
        setMode('edit');
    };

    const resetForm = () => {
        setFormData({
            reference: '',
            name: '',
            brand: '',
            size: '',
            price: 0,
            vehicleType: 'auto',
            stock: 0
        });
        setSelectedProduct(null);
    };

    if (status === "loading") {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="text-center">Cargando...</div>
            </div>
        );
    }

    if (!session || (session.user as any)?.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
                <p className="text-muted-foreground">
                    Bienvenido, {session.user?.email}
                </p>
            </div>

            {mode === 'list' ? (
                <>
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Productos</h2>
                        <Button onClick={() => setMode('add')}>
                            Agregar Nuevo Producto
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-xl">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por referencia, nombre, marca, tamaño, precio o tipo..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                        {searchQuery && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-10">Cargando productos...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border">
                                <thead>
                                    <tr className="bg-muted">
                                        <th className="border p-2 text-left">Referencia</th>
                                        <th className="border p-2 text-left">Marca</th>
                                        <th className="border p-2 text-left">Nombre</th>
                                        <th className="border p-2 text-left">Tamaño</th>
                                        <th className="border p-2 text-left">Precio</th>
                                        <th className="border p-2 text-left">Tipo</th>
                                        <th className="border p-2 text-left">Stock</th>
                                        <th className="border p-2 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-muted/50">
                                            <td className="border p-2 font-mono text-sm">{product.reference || '-'}</td>
                                            <td className="border p-2">{product.brand}</td>
                                            <td className="border p-2">{product.name}</td>
                                            <td className="border p-2">{product.size}</td>
                                            <td className="border p-2">${product.price.toLocaleString()}</td>
                                            <td className="border p-2">{product.vehicleType === 'auto' ? 'Auto' : 'Camión'}</td>
                                            <td className="border p-2">{product.stock}</td>
                                            <td className="border p-2">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="mb-6">
                        <Button variant="outline" onClick={() => { setMode('list'); resetForm(); }}>
                            ← Volver a la lista
                        </Button>
                    </div>

                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-semibold mb-6">
                            {mode === 'add' ? 'Agregar Nuevo Producto' : 'Editar Producto'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Referencia</label>
                                <input
                                    type="text"
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Ej: 15512RW"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Opcional - Código de referencia del producto</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Marca</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre del Producto</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Tamaño (ej: 205/55R16)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.size}
                                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="205/55R16"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Precio (COP)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Tipo de Vehículo</label>
                                <select
                                    required
                                    value={formData.vehicleType}
                                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                >
                                    <option value="auto">Automóvil</option>
                                    <option value="truck">Camión</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Stock (Cantidad Disponible)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit">
                                    {mode === 'add' ? 'Agregar Producto' : 'Guardar Cambios'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setMode('list'); resetForm(); }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
