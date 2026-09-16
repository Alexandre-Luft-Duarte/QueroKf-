"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { BEAN_TYPE_LABELS, PROCESS_LABELS, ROAST_LEVEL_LABELS, type Roaster, type Taxonomy } from "@/lib/types";

type Props = {
  roasters: Roaster[];
  flavorNotes: Taxonomy[];
  brewMethods: Taxonomy[];
};

const selectClass =
  "w-full rounded-lg border border-latte bg-surface px-3 py-2 text-sm text-ink focus:border-coffee";

/** Os filtros vivem na query string: a URL fica compartilhável e o servidor refaz a busca. */
export function CoffeeFilters({ roasters, flavorNotes, brewMethods }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // qualquer filtro novo volta para a primeira página

      router.push(params.size ? `/?${params}` : "/");
    },
    [router, searchParams],
  );

  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const current = (key: string) => searchParams.get(key) ?? "";
  const hasFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-latte bg-surface p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Filtros</h2>
        {hasFilters ? (
          <button type="button" onClick={() => router.push("/")} className="text-xs text-coffee underline">
            limpar
          </button>
        ) : null}
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Buscar</span>
        <input
          type="search"
          defaultValue={current("search")}
          placeholder="nome, origem, torrefação..."
          onChange={(event) => {
            // debounce: evita uma navegação a cada tecla digitada
            const { value } = event.target;
            clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => updateParam("search", value), 400);
          }}
          className={selectClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Torrefação</span>
        <select value={current("roaster")} onChange={(e) => updateParam("roaster", e.target.value)} className={selectClass}>
          <option value="">Todas</option>
          {roasters.map((roaster) => (
            <option key={roaster.id} value={roaster.slug}>
              {roaster.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Tipo de grão</span>
        <select value={current("beanType")} onChange={(e) => updateParam("beanType", e.target.value)} className={selectClass}>
          <option value="">Todos</option>
          {Object.entries(BEAN_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Torra</span>
        <select value={current("roastLevel")} onChange={(e) => updateParam("roastLevel", e.target.value)} className={selectClass}>
          <option value="">Todas</option>
          {Object.entries(ROAST_LEVEL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Processo</span>
        <select value={current("process")} onChange={(e) => updateParam("process", e.target.value)} className={selectClass}>
          <option value="">Todos</option>
          {Object.entries(PROCESS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Método de preparo</span>
        <select value={current("brewMethod")} onChange={(e) => updateParam("brewMethod", e.target.value)} className={selectClass}>
          <option value="">Todos</option>
          {brewMethods.map((method) => (
            <option key={method.id} value={method.slug}>
              {method.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Nota sensorial</span>
        <select value={current("flavorNote")} onChange={(e) => updateParam("flavorNote", e.target.value)} className={selectClass}>
          <option value="">Todas</option>
          {flavorNotes.map((note) => (
            <option key={note.id} value={note.slug}>
              {note.name}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="flex gap-2">
        <legend className="mb-1 text-sm font-medium">Faixa de preço (R$)</legend>
        <input
          type="number"
          min={0}
          placeholder="mín"
          defaultValue={current("minPrice") ? Number(current("minPrice")) / 100 : ""}
          onBlur={(e) => updateParam("minPrice", e.target.value ? String(Math.round(Number(e.target.value) * 100)) : "")}
          className={selectClass}
        />
        <input
          type="number"
          min={0}
          placeholder="máx"
          defaultValue={current("maxPrice") ? Number(current("maxPrice")) / 100 : ""}
          onBlur={(e) => updateParam("maxPrice", e.target.value ? String(Math.round(Number(e.target.value) * 100)) : "")}
          className={selectClass}
        />
      </fieldset>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Ordenar por</span>
        <select value={current("sort")} onChange={(e) => updateParam("sort", e.target.value)} className={selectClass}>
          <option value="">Mais recentes</option>
          <option value="preco-asc">Menor preço</option>
          <option value="preco-desc">Maior preço</option>
          <option value="nota">Maior pontuação SCA</option>
        </select>
      </label>
    </aside>
  );
}
