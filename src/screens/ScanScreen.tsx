import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import LoadingAnimation from "../components/LoadingAnimation";
import PrimaryButton from "../components/PrimaryButton";
import colors from "../constants/colors";
import { translate, type TranslationKey } from "../constants/translations";
import type { InputType, Language } from "../types/scam";

interface ScanScreenProps {
  language: Language;
  initialType: InputType;
  scanning: boolean;
  error: string | null;
  onSubmit: (type: InputType, content: string) => void;
}

const inputTypes: InputType[] = ["message", "url", "transcript"];
const labelKeys: Record<InputType, TranslationKey> = { message: "typeMessage", url: "typeUrl", transcript: "typeTranscript" };

export default function ScanScreen({ language, initialType, scanning, error, onSubmit }: ScanScreenProps) {
  const [type, setType] = useState<InputType>(initialType);
  const [content, setContent] = useState("");
  const [validation, setValidation] = useState<string | null>(null);
  const t = (key: TranslationKey) => translate(language, key);

  const submit = () => {
    if (!content.trim()) {
      setValidation(t("emptyInput"));
      return;
    }
    if (content.length > 10_000) {
      setValidation(t("inputTooLong"));
      return;
    }
    setValidation(null);
    onSubmit(type, content.trim());
  };

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t("scan")}</Text>
      <Text style={styles.subtitle}>{t("intro")}</Text>
      <View style={styles.panel}>
        <Text style={styles.label}>{t("inputType")}</Text>
        <View style={styles.typeOptions}>
          {inputTypes.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityState={{ selected: type === item }}
              onPress={() => setType(item)}
              style={[styles.typeOption, type === item && styles.typeSelected]}
            >
              <Text style={[styles.typeText, type === item && styles.typeTextSelected]}>{t(labelKeys[item])}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>{t("pasteContent")}</Text>
        <TextInput
          accessibilityLabel={t("pasteContent")}
          value={content}
          onChangeText={(value) => { setContent(value); setValidation(null); }}
          editable={!scanning}
          multiline
          textAlignVertical="top"
          maxLength={10_000}
          autoCapitalize={type === "url" ? "none" : "sentences"}
          keyboardType={type === "url" ? "url" : "default"}
          placeholder={t("placeholder")}
          placeholderTextColor={colors.secondaryText}
          style={[styles.input, type === "url" && styles.urlInput]}
        />
        <Text style={styles.counter}>{content.length}/10,000</Text>
        {!!(validation || error) && <Text accessibilityRole="alert" style={styles.error}>{validation ?? error}</Text>}
        <View style={styles.actions}>
          <PrimaryButton variant="secondary" label={t("clear")} disabled={scanning || !content} onPress={() => { setContent(""); setValidation(null); }} style={styles.clearButton} />
          <PrimaryButton label={t("analyze")} disabled={!content.trim() || scanning} loading={scanning} onPress={submit} style={styles.submitButton} />
        </View>
      </View>
      {scanning && <LoadingAnimation label={t("scanning")} />}
      <Text style={styles.privacy}>{t("privacyText")}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { width: "100%", maxWidth: 760, alignSelf: "center", padding: 18, gap: 12 },
  title: { color: colors.navy, fontSize: 27, fontWeight: "900" },
  subtitle: { color: colors.secondaryText, fontSize: 14, lineHeight: 21, marginBottom: 4 },
  panel: { backgroundColor: colors.white, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: colors.border, gap: 12 },
  label: { color: colors.navy, fontSize: 14, fontWeight: "800" },
  typeOptions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 5 },
  typeOption: { paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
  typeSelected: { backgroundColor: colors.paleBlue, borderColor: colors.blue },
  typeText: { color: colors.secondaryText, fontSize: 12, fontWeight: "700" },
  typeTextSelected: { color: colors.blue },
  input: { minHeight: 190, borderWidth: 1, borderColor: colors.border, backgroundColor: "#F8FAFC", borderRadius: 14, padding: 14, color: colors.text, fontSize: 14, lineHeight: 21 },
  urlInput: { minHeight: 100 },
  counter: { alignSelf: "flex-end", color: colors.secondaryText, fontSize: 11 },
  error: { color: colors.red, fontSize: 13, lineHeight: 19 },
  actions: { flexDirection: "row", gap: 10 },
  clearButton: { flex: 1 },
  submitButton: { flex: 2 },
  privacy: { color: colors.secondaryText, fontSize: 12, lineHeight: 19, marginTop: 4 },
});