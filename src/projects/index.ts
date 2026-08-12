export type { ModelDefinition, ModelKind } from "./types";
export { maritoOrNotModel } from "./marito-or-not";

import { maritoOrNotModel } from "./marito-or-not";

export const modelCatalog = [maritoOrNotModel];

export function findModelBySlug(slug: string) {
  return modelCatalog.find((model) => model.slug === slug);
}

export function filterModels(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return modelCatalog;
  }

  return modelCatalog.filter((model) => {
    const haystack = `${model.title} ${model.description} ${model.tags.join(" ")}`.toLowerCase();
    return haystack.includes(normalized);
  });
}
