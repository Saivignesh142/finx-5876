import type { AnalyzeRequest, AnalyzeResponse } from "../types/scam";

const REQUEST_TIMEOUT_MS = 8_000;
const MAX_CONTENT_LENGTH = 10_000;

export async function analyzeWithBackend(input: AnalyzeRequest): Promise<AnalyzeResponse["result"]> {
  const endpoint = process.env.EXPO_PUBLIC_FINX_API_URL?.trim();
  if (!endpoint) throw new Error("Analysis service is not configured.");
  if (!input.content.trim()) throw new Error("Input content must not be empty.");
  if (input.content.length > MAX_CONTENT_LENGTH) throw new Error("Input content exceeds the 10,000 character limit.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Analysis service returned HTTP ${response.status}.`);
    const data: unknown = await response.json();
    if (!isAnalyzeResponse(data)) throw new Error("Analysis service returned an invalid response.");
    return data.result;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Analysis service request timed out.");
    }
    throw error instanceof Error ? error : new Error("Analysis service request failed.");
  } finally {
    clearTimeout(timeout);
  }
}

function isAnalyzeResponse(value: unknown): value is AnalyzeResponse {
  if (!value || typeof value !== "object" || !("result" in value)) return false;
  const result = value.result;
  if (!result || typeof result !== "object") return false;
  if (!("score" in result) || typeof result.score !== "number" || result.score < 0 || result.score > 100) return false;
  if (!("level" in result) || (result.level !== "low" && result.level !== "medium" && result.level !== "high")) return false;
  if (!("signals" in result) || !Array.isArray(result.signals) || !result.signals.every(isWarningSignal)) return false;
  if (!("recommendations" in result) || !Array.isArray(result.recommendations) || !result.recommendations.every((item) => typeof item === "string")) return false;
  return "method" in result && (result.method === "local-rules" || result.method === "backend-rules");
}

function isWarningSignal(value: unknown): boolean {
  return !!value && typeof value === "object"
    && "id" in value && typeof value.id === "string"
    && "title" in value && typeof value.title === "string"
    && "explanation" in value && typeof value.explanation === "string";
}

export function hasBackendConfiguration(): boolean {
  return !!process.env.EXPO_PUBLIC_FINX_API_URL?.trim();
}