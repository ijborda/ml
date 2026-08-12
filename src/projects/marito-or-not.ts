import type { ModelDefinition } from "./types";

export const maritoOrNotModel: ModelDefinition = {
  slug: "marito-or-not",
  title: "Marito or Not",
  description: "Image classification for matching an uploaded image to the target persona.",
  kind: "image-classification",
  route: "/projects/marito-or-not",
  apiPath: "/marito-or-not",
};
