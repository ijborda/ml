"use client";

import { useEffect, useMemo, useState } from "react";

import type { ModelDefinition } from "@/projects";

type PredictionResult = {
  prediction?: number | number[];
  probability?: number[] | number[][] | null;
  label?: string;
  message?: string;
  error?: string;
};

function getPredictionValue(prediction?: number | number[]) {
  if (typeof prediction === "number") {
    return prediction;
  }

  if (Array.isArray(prediction) && typeof prediction[0] === "number") {
    return prediction[0];
  }

  return undefined;
}

function getPredictionLabel(prediction?: number | number[]) {
  const value = getPredictionValue(prediction);

  if (value === 1) return "Marito";
  if (value === 0) return "Not Marito";

  return "Prediction";
}

export function ModelRunner({ model }: { model: ModelDefinition }) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const predictionLabel = useMemo(() => {
    if (!result) return "Waiting for inference";
    if (result.error) return "Error";

    return result.label ?? getPredictionLabel(result.prediction);
  }, [result]);

  const probabilityText = useMemo(() => {
    if (!result || !result.probability) return "-";
    const probability = Array.isArray(result.probability) ? result.probability[0] : result.probability;
    if (Array.isArray(probability)) {
      return probability.map((value) => Number(value).toFixed(3)).join(" | ");
    }
    return Number(probability).toFixed(3);
  }, [result]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) {
      setResult({ error: "Please choose an image first." });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(`/api/models/${model.slug}`, {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as PredictionResult;

      if (!response.ok) {
        setResult({ error: payload.error ?? "Inference failed." });
        return;
      }

      setResult({
        ...payload,
        label: getPredictionLabel(payload.prediction),
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1.1fr 0.9fr" }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, background: "#f5f5f5", border: "1px solid #d4d4d4", borderRadius: 12, padding: 18 }}>
        <label htmlFor="image-upload" style={{ color: "#111111", fontWeight: 600 }}>
          Upload image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          style={{ color: "#111111" }}
        />

        {preview && (
          <div style={{ overflow: "hidden", borderRadius: 12, background: "#f0f0f0", border: "1px solid #d4d4d4" }}>
            <img src={preview} alt="Selected upload preview" style={{ width: "100%", maxHeight: 340, objectFit: "cover", display: "block" }} />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !image}
          style={{
            background: isSubmitting || !image ? "#d4d4d4" : "#111111",
            color: "#ffffff",
            border: "none",
            borderRadius: 10,
            padding: "12px 18px",
            fontWeight: 700,
            cursor: isSubmitting || !image ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Running model…" : "Predict"}
        </button>
      </form>

      <div style={{ background: "#f5f5f5", border: "1px solid #d4d4d4", borderRadius: 12, padding: 18, display: "grid", gap: 16, alignContent: "start" }}>
        <div>
          <p style={{ margin: 0, color: "#666666", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12 }}>
            Result
          </p>
          <h3 style={{ margin: "8px 0 0", fontSize: 28, color: "#111111" }}>{predictionLabel}</h3>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #d4d4d4", borderRadius: 10, padding: 14 }}>
          <p style={{ margin: 0, color: "#666666" }}>Probability</p>
          <p style={{ margin: "8px 0 0", fontSize: 20, color: "#111111" }}>{probabilityText}</p>
        </div>

        {result?.error && (
          <div style={{ background: "#fff5f5", border: "1px solid #d4d4d4", color: "#111111", borderRadius: 10, padding: 12 }}>
            {result.error}
          </div>
        )}
      </div>
    </div>
  );
}
