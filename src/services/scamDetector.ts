import type { InputType, RiskLevel, ScanInput, ScanResult, WarningSignal } from "../types/scam";

interface Rule {
  id: string;
  title: string;
  explanation: string;
  patterns: RegExp[];
  weight: number;
  types?: InputType[];
}

const rules: Rule[] = [
  { id: "otp", title: "Request for a one-time password", explanation: "Legitimate organizations should not ask you to disclose an OTP.", patterns: [/\b(?:share|send|tell|provide|read out)\b.{0,35}\b(?:otp|one[- ]time password)\b/i, /\b(?:otp|one[- ]time password)\b.{0,30}\b(?:share|send|tell|provide)\b/i], weight: 32 },
  { id: "credentials", title: "Request for a password or security code", explanation: "A request to reveal a password, PIN, or CVV is a serious warning sign.", patterns: [/\b(?:password|passcode|cvv|cvc|pin)\b.{0,35}\b(?:share|send|provide|tell|confirm|enter)\b/i, /\b(?:share|send|provide|tell|confirm)\b.{0,35}\b(?:password|passcode|cvv|cvc|pin)\b/i], weight: 32 },
  { id: "urgent", title: "Urgent threat or time pressure", explanation: "Scammers often pressure people to act before they can verify a claim.", patterns: [/\b(?:immediately|urgent|within \d+ hours?|final warning|act now|expires today)\b/i, /\baccount\b.{0,35}\b(?:blocked|suspended|closed|frozen)\b/i], weight: 18 },
  { id: "payment", title: "Unexpected payment demand", explanation: "Verify payment requests using a known, official contact channel.", patterns: [/\b(?:pay|transfer|send)\b.{0,30}\b(?:money|fee|deposit|funds|payment)\b/i, /\b(?:processing fee|verification fee|advance payment)\b/i], weight: 24 },
  { id: "prize", title: "Unexpected prize or reward claim", explanation: "Unexpected prizes that require a fee or personal details may be fraudulent.", patterns: [/\b(?:you have won|winner|prize money|claim your reward|unexpected reward|congratulations)\b/i], weight: 20 },
  { id: "banking", title: "Possible banking impersonation", explanation: "Contact your bank using the number on your card or its official app, not a number in an unexpected message.", patterns: [/\b(?:bank|account|kyc)\b.{0,40}\b(?:verify|verification|update|suspend|blocked|details)\b/i, /\b(?:bank manager|bank support|bank security)\b/i], weight: 20 },
  { id: "authority", title: "Authority or government impersonation", explanation: "Government agencies do not resolve unexpected threats through secret payments or messaging pressure.", patterns: [/\b(?:police officer|government officer|income tax department|customs officer|digital arrest)\b/i], weight: 22 },
  { id: "install", title: "Request to install an unknown application", explanation: "Installing an app from an unsolicited link can expose your device and accounts.", patterns: [/\b(?:install|download)\b.{0,45}\b(?:app|application|apk|remote access|screen sharing)\b/i], weight: 22 },
  { id: "link", title: "URL with potentially risky characteristics", explanation: "Shortened, non-HTTPS, or lookalike URLs can hide the destination. Do not open a link to test it.", patterns: [/\bhttp:\/\/[^\s]+/i, /\b(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|cutt\.ly)\/\S+/i, /\b(?:login|verify|secure|account)[.-][a-z0-9-]+\.(?:com|net|org|in)\b/i], weight: 25, types: ["url", "message", "transcript"] },
  { id: "link-action", title: "Prompt to open or verify through a link", explanation: "Unexpected links asking you to sign in or verify details should be checked independently.", patterns: [/\b(?:click|tap|open)\b.{0,30}\b(?:link|here|below)\b/i, /\bverify\b.{0,30}\b(?:link|website|url)\b/i], weight: 15 },
];

export function analyzeContent(input: ScanInput): Omit<ScanResult, "id" | "analyzedAt"> {
  const content = input.content.trim();
  if (!content) throw new Error("Input content must not be empty.");
  if (content.length > 10_000) throw new Error("Input content exceeds the 10,000 character limit.");

  const signals: WarningSignal[] = [];
  let score = 0;
  for (const rule of rules) {
    if (rule.types && !rule.types.includes(input.type)) continue;
    if (rule.patterns.some((pattern) => pattern.test(content))) {
      signals.push({ id: rule.id, title: rule.title, explanation: rule.explanation });
      score += rule.weight;
    }
  }

  score = Math.min(score, 100);
  const level: RiskLevel = score >= 71 ? "high" : score >= 31 ? "medium" : "low";
  const recommendations = level === "high"
    ? ["Do not click links, install software, share credentials, or send money.", "Verify the claim using an official app or a contact detail you already trust."]
    : level === "medium"
      ? ["Pause before acting and verify the sender independently.", "Do not share sensitive information or pay an unexpected fee."]
      : ["No configured warning patterns were detected; this does not prove the content is safe.", "Verify unexpected requests through an official, independently sourced channel."];

  return { score, level, signals, recommendations, method: "local-rules" };
}

export function isInputType(value: unknown): value is InputType {
  return value === "message" || value === "url" || value === "transcript";
}