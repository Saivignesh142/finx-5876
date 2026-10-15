import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";
import { translate, type TranslationKey } from "../constants/translations";
import type { Language } from "../types/scam";

interface ProfileScreenProps {
  language: Language;
  historyCount: number;
  onLanguageChange: (language: Language) => void;
  onClearHistory: () => void;
}

export default function ProfileScreen({ language, historyCount, onLanguageChange, onClearHistory }: ProfileScreenProps) {
  const t = (key: TranslationKey) => translate(language, key);
  return (
    <View style={styles.page}>
      <Text style={styles.title}>{t("profile")}</Text>
      <View style={styles.card}>
        <Text style={styles.heading}>{t("selectLanguage")}</Text>
        <View style={styles.options}>
          {(["en", "te"] as const).map((item) => (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityState={{ selected: language === item }}
              onPress={() => onLanguageChange(item)}
              style={[styles.option, language === item && styles.selected]}
            >
              <Text style={[styles.optionText, language === item && styles.selectedText]}>{t(item === "en" ? "english" : "telugu")}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Info title={t("privacy")} description={t("privacyText")} />
      <View style={styles.card}>
        <Text style={styles.heading}>{t("history")}</Text>
        <Text style={styles.body}>{historyCount}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: historyCount === 0 }}
          disabled={historyCount === 0}
          onPress={onClearHistory}
          style={styles.clearButton}
        >
          <Text style={[styles.clearText, historyCount === 0 && styles.muted]}>{t("clearHistory")}</Text>
        </Pressable>
      </View>
      <Info title={t("about")} description={t("aboutText")} />
      <Text style={styles.version}>{t("version")}</Text>
    </View>
  );
}

function Info({ title, description }: { title: string; description: string }) {
  return <View style={styles.card}><Text style={styles.heading}>{title}</Text><Text style={styles.body}>{description}</Text></View>;
}

const styles = StyleSheet.create({
  page: { width: "100%", maxWidth: 760, alignSelf: "center", padding: 18, gap: 12 },
  title: { color: colors.navy, fontSize: 27, fontWeight: "900", marginBottom: 4 },
  card: { padding: 17, borderRadius: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, gap: 10 },
  heading: { color: colors.navy, fontSize: 15, fontWeight: "800" },
  body: { color: colors.secondaryText, fontSize: 13, lineHeight: 20 },
  options: { flexDirection: "row", gap: 10 },
  option: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, alignItems: "center" },
  selected: { borderColor: colors.blue, backgroundColor: colors.paleBlue },
  optionText: { color: colors.secondaryText, fontSize: 14, fontWeight: "700" },
  selectedText: { color: colors.blue },
  clearButton: { alignSelf: "flex-start", paddingVertical: 6 },
  clearText: { color: colors.red, fontSize: 13, fontWeight: "700" },
  muted: { color: colors.secondaryText },
  version: { color: colors.secondaryText, fontSize: 12, textAlign: "center", margin: 8 },
});