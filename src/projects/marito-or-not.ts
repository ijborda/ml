import type { ModelDefinition } from "./types";

export const maritoOrNotModel: ModelDefinition = {
  slug: "marito-or-not",
  title: "Marito or Not",
  description: "Image classification model for identifying whether the uploaded image matches the target persona.",
  kind: "image-classification",
  route: "/projects/marito-or-not",
  apiPath: "/marito-or-not",
  tags: ["image", "classification", "vision"],
  accent: "#34d399",
};
