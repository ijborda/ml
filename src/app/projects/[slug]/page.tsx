import Link from "next/link";
import { notFound } from "next/navigation";

import { ModelRunner } from "@/components/ModelRunner";
import { findModelBySlug } from "@/lib/model-registry";

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = findModelBySlug(slug);

  if (!model) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020817",
        color: "#e2e8f0",
        padding: "48px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: 24 }}>
        <Link href="/" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 700 }}>
          ← Back to projects
        </Link>

        <header style={{ display: "grid", gap: 10 }}>
          <span
            style={{
              width: "fit-content",
              display: "inline-flex",
              padding: "6px 10px",
              borderRadius: 999,
              background: `${model.accent}22`,
              color: model.accent,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {model.kind}
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 3vw, 3rem)" }}>{model.title}</h1>
          <p style={{ margin: 0, color: "#cbd5e1", maxWidth: 760, lineHeight: 1.7 }}>{model.description}</p>
        </header>

        <ModelRunner model={model} />
      </div>
    </main>
  );
}
