import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import RiskBadge, { riskLabelKey } from "../components/RiskBadge";
import colors from "../constants/colors";
import { translate, type TranslationKey } from "../constants/translations";
import type { Language, ScanResult } from "../types/scam";

interface ResultScreenProps {
  language: Language;
  result: ScanResult | null;
  onScanAgain: () => void;
  onHome: () => void;
}

export default function ResultScreen({ language, result, onScanAgain, onHome }: ResultScreenProps) {
  const t = (key: TranslationKey) => translate(language, key);
  if (!result) return (
    <View style={styles.page}>
      <Text style={styles.title}>{t("result")}</Text>
      <Text style={styles.text}>{t("noHistory")}</Text>
      <PrimaryButton label={t("scanNow")} onPress={onScanAgain} />
    </View>
  );

  const tone = result.level === "high" ? colors.red : result.level === "medium" ? colors.amber : colors.green;
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>{t("result")}</Text>
      <View style={styles.panel}>
        <RiskBadge level={result.level} label={t(riskLabelKey[result.level])} />
        <Text style={[styles.score, { color: tone }]}>{result.score}<Text style={styles.outOf}> / 100</Text></Text>
        <Text style={styles.text}>{t("score")} · {result.method === "local-rules" ? t("offline") : t("online")}</Text>
        <View style={styles.track}><View style={[styles.fill, { width: `${result.score}%`, backgroundColor: tone }]} /></View>
        <Text style={styles.section}>{t("signals")}</Text>
        {result.signals.length === 0 ? <Text style={styles.text}>{t("noSignals")}</Text> : result.signals.map((signal) => (
          <View key={signal.id} style={styles.signal}>
            <Text style={styles.signalTitle}>• {signal.title}</Text>
            <Text style={styles.text}>{signal.explanation}</Text>
          </View>
        ))}
        <Text style={styles.section}>{t("recommendations")}</Text>
        {result.recommendations.map((recommendation, index) => <Text key={`${index}-${recommendation}`} style={styles.recommendation}>• {recommendation}</Text>)}
      </View>
      <Text style={styles.disclaimer}>{t("disclaimer")}</Text>
      <PrimaryButton label={t("scanAgain")} onPress={onScanAgain} />
      <PrimaryButton label={t("backHome")} variant="secondary" onPress={onHome} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { width: "100%", maxWidth: 760, alignSelf: "center", padding: 18, paddingBottom: 28, gap: 12 },
  title: { color: colors.navy, fontSize: 27, fontWeight: "900" },
  panel: { backgroundColor: colors.white, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border },
  score: { fontSize: 46, fontWeight: "900", marginTop: 14 },
  outOf: { fontSize: 18, color: colors.secondaryText, fontWeight: "600" },
  text: { color: colors.secondaryText, fontSize: 13, lineHeight: 20, marginTop: 4 },
  track: { height: 8, overflow: "hidden", backgroundColor: colors.border, borderRadius: 8, marginTop: 14 },
  fill: { height: "100%", borderRadius: 8 },
  section: { color: colors.navy, fontSize: 16, fontWeight: "800", marginTop: 22, marginBottom: 8 },
  signal: { paddingVertical: 8, borderBottomColor: colors.border, borderBottomWidth: 1 },
  signalTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  recommendation: { color: colors.text, fontSize: 13, lineHeight: 20, marginBottom: 7 },
  disclaimer: { color: colors.secondaryText, fontSize: 12, lineHeight: 19 },
});