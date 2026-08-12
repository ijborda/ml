export type ModelKind = "image-classification";

export type ModelDefinition = {
  slug: string;
  title: string;
  description: string;
  kind: ModelKind;
  route: string;
  apiPath: string;
};
