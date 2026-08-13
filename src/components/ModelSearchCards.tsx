"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { filterModels } from "@/lib/model-registry";

export function ModelSearchCards() {
  const [query, setQuery] = useState("");

  const models = useMemo(() => filterModels(query), [query]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <input
        id="model-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search models"
        style={{
          width: "100%",
          border: "1px solid #d4d4d4",
          background: "#ffffff",
          color: "#111111",
          borderRadius: 10,
          padding: "12px 14px",
          fontSize: 16,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 200px))",
          columnGap: 10,
          rowGap: 10,
          justifyContent: "start",
        }}
      >
        {models.map((model) => (
          <Link
            key={model.slug}
            href={model.route}
            style={{
              textDecoration: "none",
              display: "grid",
              gap: 12,
              width: "100%",
              padding: 10,
              background: "#f5f5f5",
              border: "1px solid #d4d4d4",
              borderRadius: 10,
              color: "#111111",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666666" }}>
                {model.kind}
              </span>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>{model.title}</h3>
            </div>

            <p style={{ margin: 0, color: "#333333", lineHeight: 1.4, fontSize: 12 }}>{model.description}</p>
          </Link>
        ))}
      </div>

      {models.length === 0 && (
        <div style={{ padding: 18, border: "1px solid #d4d4d4", borderRadius: 10, background: "#fafafa" }}>
          No models match your search.
        </div>
      )}
    </div>
  );
}
