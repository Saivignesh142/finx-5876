import React from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import colors from "../constants/colors";
import { translate, type TranslationKey } from "../constants/translations";
import type { Language } from "../types/scam";

interface SafetyScreenProps {
  language: Language;
}

const content = {
  en: [
    ["OTP fraud", "Never share an OTP, PIN, password, or recovery code, even with someone claiming to be bank staff."],
    ["Phishing", "Unexpected links can lead to lookalike sign-in pages. Visit the known official site or app yourself."],
    ["Banking fraud", "Do not install apps or disclose card details to resolve a claimed account problem."],
    ["Fake customer support", "Find support details on the official website or payment card; do not trust unsolicited callers."],
    ["Investment scams", "Be cautious of guaranteed returns, pressure to invest quickly, or requests to pay into personal accounts."],
    ["Fake rewards", "A genuine prize should not require an unexpected fee, OTP, or bank password to release it."],
    ["Suspicious job offers", "Verify employers independently and be wary of upfront fees or requests for sensitive documents."],
    ["Impersonation", "Verify unexpected requests by calling the person or organization using a trusted number."],
    ["Payment fraud", "Check the payee and amount before approving a UPI collect request or scanning a payment QR code."],
  ],
  te: [
    ["OTP మోసం", "బ్యాంకు సిబ్బంది అని చెప్పినా OTP, PIN, పాస్‌వర్డ్ లేదా రికవరీ కోడ్‌ను ఎవరికీ చెప్పకండి."],
    ["ఫిషింగ్", "అనుకోని లింకులు నకిలీ లాగిన్ పేజీలకు తీసుకెళ్లవచ్చు. అధికారిక వెబ్‌సైట్ లేదా యాప్‌ను మీరే తెరవండి."],
    ["బ్యాంకింగ్ మోసం", "ఖాతా సమస్య పరిష్కారమంటూ యాప్ ఇన్‌స్టాల్ చేయమన్నా లేదా కార్డు వివరాలు అడిగినా నమ్మకండి."],
    ["నకిలీ కస్టమర్ సపోర్ట్", "అధికారిక వెబ్‌సైట్ లేదా కార్డులోని సంప్రదింపు వివరాలను ఉపయోగించండి; అనుకోని కాలర్లను నమ్మకండి."],
    ["పెట్టుబడి మోసాలు", "ఖచ్చితమైన లాభాల హామీలు, త్వరగా పెట్టుబడి పెట్టమనే ఒత్తిడి, వ్యక్తిగత ఖాతాలకు చెల్లింపులపై జాగ్రత్త."],
    ["నకిలీ బహుమతులు", "బహుమతి పొందడానికి అనుకోని రుసుము, OTP లేదా బ్యాంకు పాస్‌వర్డ్ అవసరం ఉండదు."],
    ["అనుమానాస్పద ఉద్యోగాలు", "ఉద్యోగ సంస్థను స్వతంత్రంగా ధృవీకరించండి; ముందస్తు రుసుములు లేదా సున్నితమైన పత్రాల అభ్యర్థనలపై జాగ్రత్త."],
    ["వ్యక్తి/సంస్థ వేషధారణ", "అనుకోని అభ్యర్థనను నమ్మకమైన నంబర్‌కు మీరే కాల్ చేసి నిర్ధారించండి."],
    ["చెల్లింపు మోసం", "UPI కలెక్ట్ అభ్యర్థన ఆమోదించే ముందు లేదా QR కోడ్ స్కాన్ చేసే ముందు చెల్లింపుదారుని, మొత్తాన్ని తనిఖీ చేయండి."],
  ],
} as const;

export default function SafetyScreen({ language }: SafetyScreenProps) {
  const t = (key: TranslationKey) => translate(language, key);
  const openPortal = async () => {
    try {
      await Linking.openURL("https://cybercrime.gov.in/");
    } catch {
      Alert.alert("Unable to open website", "Visit https://cybercrime.gov.in/ in your browser.");
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>{t("safetyTitle")}</Text>
      <Text style={styles.body}>{t("safetyIntro")}</Text>
      <Text style={styles.section}>{t("tips")}</Text>
      {content[language].map(([heading, detail]) => (
        <View key={heading} style={styles.card}>
          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.body}>{detail}</Text>
        </View>
      ))}
      <View style={styles.report}>
        <Text style={styles.heading}>{t("reportTitle")}</Text>
        <Text style={styles.body}>{t("reportText")}</Text>
        <PrimaryButton label={t("officialPortal")} variant="secondary" onPress={openPortal} />
      </View>
      <Text style={styles.disclaimer}>{t("aboutText")}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { width: "100%", maxWidth: 760, alignSelf: "center", padding: 18, gap: 12 },
  title: { color: colors.navy, fontSize: 27, fontWeight: "900" },
  section: { color: colors.navy, fontSize: 18, fontWeight: "800", marginTop: 8 },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, gap: 6 },
  heading: { color: colors.navy, fontSize: 15, fontWeight: "800" },
  body: { color: colors.secondaryText, fontSize: 13, lineHeight: 20 },
  report: { padding: 18, borderRadius: 18, backgroundColor: colors.paleBlue, gap: 11, marginTop: 5 },
  disclaimer: { color: colors.secondaryText, fontSize: 12, lineHeight: 19, marginBottom: 10 },
});