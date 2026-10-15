import { analyzeContent, isInputType } from "../src/services/scamDetector";
import type { AnalyzeRequest, AnalyzeResponse } from "../src/types/scam";

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

const MAX_CONTENT_LENGTH = 10_000;

export default function handler(req: ApiRequest, res: ApiResponse): void {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const body = typeof req.body === "string" ? parseBody(req.body) : req.body;
  if (!body || typeof body !== "object" || !("type" in body) || !("content" in body)) {
    res.status(400).json({ error: "Request must include a valid input type and content." });
    return;
  }

  const { type, content } = body as Record<string, unknown>;
  if (!isInputType(type) || typeof content !== "string" || !content.trim()) {
    res.status(400).json({ error: "Input type or content is invalid." });
    return;
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    res.status(413).json({ error: "Input exceeds the 10,000 character limit." });
    return;
  }

  const analysis = analyzeContent({ type, content } satisfies AnalyzeRequest);
  const result: AnalyzeResponse["result"] = { ...analysis, method: "backend-rules" };
  res.status(200).json({ result });
}

function parseBody(serialized: string): unknown {
  try {
    return JSON.parse(serialized) as unknown;
  } catch {
    return null;
  }
}