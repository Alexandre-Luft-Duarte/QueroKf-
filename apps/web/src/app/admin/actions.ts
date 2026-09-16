"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { FormState } from "@/lib/form-state";

/** Traduz falhas da API em estado de formulário em vez de derrubar a página. */
async function run(action: () => Promise<unknown>, successMessage: string): Promise<FormState> {
  try {
    await action();
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "Erro inesperado ao falar com a API.";
    return { status: "error", message };
  }

  revalidatePath("/", "layout");
  return { status: "success", message: successMessage };
}

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
};

const number = (formData: FormData, key: string) => {
  const value = text(formData, key);
  return value === undefined ? undefined : Number(value);
};

/** O formulário trabalha em reais; o banco guarda centavos. */
const priceInCents = (formData: FormData) => {
  const value = number(formData, "price");
  return value === undefined ? undefined : Math.round(value * 100);
};

function coffeePayload(formData: FormData) {
  return {
    name: text(formData, "name"),
    description: text(formData, "description"),
    imageUrl: text(formData, "imageUrl"),
    priceCents: priceInCents(formData),
    weightGrams: number(formData, "weightGrams"),
    beanType: text(formData, "beanType"),
    roastLevel: text(formData, "roastLevel"),
    process: text(formData, "process"),
    origin: text(formData, "origin"),
    region: text(formData, "region"),
    altitude: number(formData, "altitude"),
    scaScore: number(formData, "scaScore"),
    storeUrl: text(formData, "storeUrl"),
    active: formData.get("active") === "on",
    roasterId: text(formData, "roasterId"),
    flavorNoteIds: formData.getAll("flavorNoteIds").filter((id): id is string => typeof id === "string"),
    brewMethodIds: formData.getAll("brewMethodIds").filter((id): id is string => typeof id === "string"),
  };
}

export async function createCoffeeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await run(() => api.coffees.create(coffeePayload(formData)), "Café cadastrado.");

  if (result.status === "success") redirect("/admin/cafes");
  return result;
}

export async function updateCoffeeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = String(formData.get("id"));
  const result = await run(() => api.coffees.update(id, coffeePayload(formData)), "Café atualizado.");

  if (result.status === "success") redirect("/admin/cafes");
  return result;
}

export async function deleteCoffeeAction(formData: FormData): Promise<void> {
  await run(() => api.coffees.remove(String(formData.get("id"))), "Café removido.");
}

function roasterPayload(formData: FormData) {
  return {
    name: text(formData, "name"),
    description: text(formData, "description"),
    websiteUrl: text(formData, "websiteUrl"),
    logoUrl: text(formData, "logoUrl"),
    city: text(formData, "city"),
    state: text(formData, "state")?.toUpperCase(),
  };
}

export async function createRoasterAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await run(() => api.roasters.create(roasterPayload(formData)), "Torrefação cadastrada.");

  if (result.status === "success") redirect("/admin/torrefacoes");
  return result;
}

export async function updateRoasterAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = String(formData.get("id"));
  const result = await run(() => api.roasters.update(id, roasterPayload(formData)), "Torrefação atualizada.");

  if (result.status === "success") redirect("/admin/torrefacoes");
  return result;
}

export async function deleteRoasterAction(formData: FormData): Promise<void> {
  await run(() => api.roasters.remove(String(formData.get("id"))), "Torrefação removida.");
}

export async function createFlavorNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return run(() => api.flavorNotes.create({ name: text(formData, "name") }), "Nota sensorial criada.");
}

export async function updateFlavorNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return run(
    () => api.flavorNotes.update(String(formData.get("id")), { name: text(formData, "name") }),
    "Nota sensorial atualizada.",
  );
}

export async function deleteFlavorNoteAction(formData: FormData): Promise<void> {
  await run(() => api.flavorNotes.remove(String(formData.get("id"))), "Nota sensorial removida.");
}

export async function createBrewMethodAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return run(
    () => api.brewMethods.create({ name: text(formData, "name"), description: text(formData, "description") }),
    "Método de preparo criado.",
  );
}

export async function updateBrewMethodAction(_prev: FormState, formData: FormData): Promise<FormState> {
  return run(
    () =>
      api.brewMethods.update(String(formData.get("id")), {
        name: text(formData, "name"),
        description: text(formData, "description"),
      }),
    "Método de preparo atualizado.",
  );
}

export async function deleteBrewMethodAction(formData: FormData): Promise<void> {
  await run(() => api.brewMethods.remove(String(formData.get("id"))), "Método de preparo removido.");
}
