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
        background: "#ffffff",
        color: "#111111",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "980px", margin: "0 auto", display: "grid", gap: 20 }}>
        <Link href="/" style={{ color: "#111111", textDecoration: "none", fontWeight: 700, display: "inline-block" }}>
          ← Back
        </Link>

        <header style={{ display: "grid", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666666" }}>
            {model.kind}
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 3vw, 2.6rem)" }}>{model.title}</h1>
          <p style={{ margin: 0, color: "#333333", maxWidth: 760, lineHeight: 1.6 }}>{model.description}</p>
        </header>

        <ModelRunner model={model} />
      </div>
    </main>
  );
}
