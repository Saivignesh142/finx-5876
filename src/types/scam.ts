export type InputType = "message" | "url" | "transcript";
export type RiskLevel = "low" | "medium" | "high";
export type DetectionMethod = "local-rules" | "backend-rules";
export type Language = "en" | "te";
export type AppRoute = "Home" | "Scan" | "Result" | "History" | "Safety" | "Profile";

export interface ScanInput {
  type: InputType;
  content: string;
}

export interface WarningSignal {
  id: string;
  title: string;
  explanation: string;
}

export interface ScanResult {
  id: string;
  score: number;
  level: RiskLevel;
  signals: WarningSignal[];
  recommendations: string[];
  method: DetectionMethod;
  analyzedAt: string;
}

export interface ScanHistoryRecord {
  id: string;
  inputType: InputType;
  score: number;
  level: RiskLevel;
  explanation: string;
  method: DetectionMethod;
  scannedAt: string;
}

export interface AnalyzeRequest extends ScanInput {}

export interface AnalyzeResponse {
  result: Omit<ScanResult, "id" | "analyzedAt">;
}

export type ThemePreference = "light" | "dark" | "system";