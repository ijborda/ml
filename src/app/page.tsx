import { ModelSearchCards } from "@/components/ModelSearchCards";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020817",
        color: "#e2e8f0",
        fontFamily: "Arial, sans-serif",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: 28 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <p
            style={{
              margin: 0,
              color: "#38bdf8",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            Model Library
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2.2rem, 3vw, 3.5rem)" }}>Explore ML models</h1>
          <p style={{ margin: 0, maxWidth: 720, lineHeight: 1.7, color: "#cbd5e1" }}>
            Search across project models, choose a card, and run the model UI for live predictions.
          </p>
        </div>

        <ModelSearchCards />
      </div>
    </main>
  );
}
