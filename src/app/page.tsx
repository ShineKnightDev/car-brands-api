"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Brand = {
  id: number;
  nombre: string;
};

type ApiError = {
  error?: string;
};

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiError;
    return data.error ?? "Ocurrio un error inesperado";
  } catch {
    return "Ocurrio un error inesperado";
  }
}

export default function Home(): React.JSX.Element {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newBrandName, setNewBrandName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editBrandId, setEditBrandId] = useState<number | null>(null);
  const [editBrandName, setEditBrandName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const loadBrands = async (): Promise<void> => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/brands", { method: "GET" });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = (await response.json()) as Brand[];
      setBrands(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudieron cargar las marcas";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBrands();
  }, []);

  const handleCreateBrand = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!newBrandName.trim()) {
      setErrorMessage("Debes escribir un nombre de marca");
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBrandName }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setNewBrandName("");
      await loadBrands();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo crear la marca";
      setErrorMessage(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartEdit = (brand: Brand): void => {
    setEditBrandId(brand.id);
    setEditBrandName(brand.nombre);
    setErrorMessage(null);
  };

  const handleCancelEdit = (): void => {
    setEditBrandId(null);
    setEditBrandName("");
  };

  const handleUpdateBrand = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!editBrandId) {
      return;
    }

    if (!editBrandName.trim()) {
      setErrorMessage("Debes escribir un nombre valido para actualizar");
      return;
    }

    setIsUpdating(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/brands/${editBrandId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editBrandName }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      handleCancelEdit();
      await loadBrands();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo actualizar la marca";
      setErrorMessage(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBrand = async (id: number): Promise<void> => {
    setIsDeletingId(id);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      if (editBrandId === id) {
        handleCancelEdit();
      }

      await loadBrands();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo eliminar la marca";
      setErrorMessage(message);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#fef3c7,transparent_30%),radial-gradient(circle_at_80%_0%,#dbeafe,transparent_35%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-4 py-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-xl border border-zinc-200/80 bg-white/80 p-6 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Car Brands API
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            Panel de marcas
          </h1>
          <p className="mt-2 text-zinc-600">
            Interfaz simple para practicar arquitectura limpia consumiendo tu API CRUD.
          </p>
        </header>

        {errorMessage ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Crear marca</CardTitle>
              <CardDescription>Ingresa el nombre y guarda en la base de datos.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleCreateBrand}>
                <Input
                  placeholder="Ejemplo: Toyota"
                  value={newBrandName}
                  onChange={(event) => setNewBrandName(event.target.value)}
                />
                <Button className="w-full" type="submit" disabled={isCreating}>
                  {isCreating ? "Guardando..." : "Crear marca"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Listado de marcas</CardTitle>
              <CardDescription>
                Puedes editar o eliminar cada registro desde esta tabla.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editBrandId ? (
                <form
                  className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-[1fr_auto_auto]"
                  onSubmit={handleUpdateBrand}
                >
                  <Input
                    value={editBrandName}
                    onChange={(event) => setEditBrandName(event.target.value)}
                    placeholder="Nuevo nombre"
                  />
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Actualizando..." : "Actualizar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                </form>
              ) : null}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell className="py-8 text-center text-zinc-500" colSpan={3}>
                        Cargando marcas...
                      </TableCell>
                    </TableRow>
                  ) : brands.length === 0 ? (
                    <TableRow>
                      <TableCell className="py-8 text-center text-zinc-500" colSpan={3}>
                        No hay marcas registradas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    brands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell className="font-medium">#{brand.id}</TableCell>
                        <TableCell>{brand.nombre}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => handleStartEdit(brand)}
                              type="button"
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteBrand(brand.id)}
                              disabled={isDeletingId === brand.id}
                              type="button"
                            >
                              {isDeletingId === brand.id ? "Eliminando..." : "Eliminar"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
