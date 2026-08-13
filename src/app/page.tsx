import { ModelSearchCards } from "@/components/ModelSearchCards";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#111111",
        fontFamily: "Arial, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "980px", margin: "0 auto", display: "grid", gap: 24 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666666" }}>
            Models
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700 }}>Machine Learning Projects</h1>
        </header>

        <ModelSearchCards />
      </div>
    </main>
  );
}
