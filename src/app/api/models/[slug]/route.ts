import { NextRequest } from "next/server";

import { findModelBySlug } from "@/lib/model-registry";
import { enforceRateLimit, getClientIp, proxyModelRequest } from "@/lib/model-proxy";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const model = findModelBySlug(slug);

  if (!model) {
    return Response.json({ error: "Model not found." }, { status: 404 });
  }

  const ip = getClientIp(req);
  const rateLimitError = await enforceRateLimit(ip);

  if (rateLimitError) {
    return Response.json(rateLimitError, { status: 429 });
  }

  const formData = await req.formData();
  const image = formData.get("image");

  if (!(image instanceof File)) {
    return Response.json({ error: "Image file is required." }, { status: 400 });
  }

  const fileBuffer = await image.arrayBuffer();
  const payload = JSON.stringify({
    image: {
      name: image.name,
      contentType: image.type,
      data: Buffer.from(fileBuffer).toString("base64"),
    },
  });

  return proxyModelRequest(model, payload, {
    "Content-Type": "application/json",
  });
}

export async function GET() {
  return Response.json({
    message: "Use POST with form-data field 'image'.",
  });
}
