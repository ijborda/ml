"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { filterModels } from "@/lib/model-registry";

export function ModelSearchCards() {
  const [query, setQuery] = useState("");

  const models = useMemo(() => filterModels(query), [query]);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 12 }}>
        <label htmlFor="model-search" style={{ fontSize: 14, color: "#cbd5e1" }}>
          Search models
        </label>
        <input
          id="model-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, tag, or description"
          style={{
            width: "100%",
            border: "1px solid rgba(148, 163, 184, 0.35)",
            background: "#0b1120",
            color: "#f8fafc",
            borderRadius: 12,
            padding: "14px 16px",
            fontSize: 16,
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
        {models.map((model) => (
          <Link
            key={model.slug}
            href={model.route}
            style={{
              textDecoration: "none",
              display: "grid",
              gap: 14,
              padding: 20,
              background: "#111827",
              border: `1px solid ${model.accent}55`,
              borderRadius: 18,
              color: "#e2e8f0",
              boxShadow: "0 18px 32px rgba(15, 23, 42, 0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  display: "inline-flex",
                  background: `${model.accent}22`,
                  color: model.accent,
                  borderRadius: 999,
                  padding: "6px 10px",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {model.kind}
              </span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{model.tags.length} tags</span>
            </div>

            <div>
              <h3 style={{ margin: 0, fontSize: 22, marginBottom: 8 }}>{model.title}</h3>
              <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.6 }}>{model.description}</p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  style={{ background: "#0b1120", color: "#cbd5e1", borderRadius: 999, padding: "6px 10px", fontSize: 12 }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {models.length === 0 && (
        <div style={{ padding: 20, borderRadius: 16, background: "#111827", color: "#cbd5e1" }}>
          No models match your search.
        </div>
      )}
    </div>
  );
}
