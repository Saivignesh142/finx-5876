import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import ScanScreen from "./src/screens/ScanScreen";
import ResultScreen from "./src/screens/ResultScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import SafetyScreen from "./src/screens/SafetyScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import colors from "./src/constants/colors";
import { translate, type TranslationKey } from "./src/constants/translations";
import { analyzeWithBackend, hasBackendConfiguration } from "./src/services/api";
import { analyzeContent } from "./src/services/scamDetector";
import { clearHistory as clearStoredHistory, loadHistory, loadLanguage, saveHistory, saveLanguage } from "./src/services/storage";
import type { AppRoute, InputType, Language, ScanHistoryRecord, ScanResult } from "./src/types/scam";

const routes: AppRoute[] = ["Home", "Scan", "Result", "History", "Safety", "Profile"];
const routeKeys: Record<AppRoute, TranslationKey> = {
  Home: "home", Scan: "scan", Result: "result", History: "history", Safety: "safety", Profile: "profile",
};

export default function App() {
  const [route, setRoute] = useState<AppRoute>("Home");
  const [language, setLanguage] = useState<Language>("en");
  const [history, setHistory] = useState<ScanHistoryRecord[]>([]);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [inputType, setInputType] = useState<InputType>("message");
  const [scanning, setScanning] = useState(false);
  const [ready, setReady] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const scanLock = useRef(false);
  const t = (key: TranslationKey) => translate(language, key);

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      const notices: string[] = [];
      try {
        const savedLanguage = await loadLanguage();
        if (mounted) setLanguage(savedLanguage);
      } catch {
        notices.push("Language preference could not be loaded.");
      }
      try {
        const savedHistory = await loadHistory();
        if (mounted) setHistory(savedHistory);
      } catch {
        notices.push("Saved scan history could not be loaded.");
      }
      if (mounted) {
        setNotice(notices.length ? notices.join(" ") : null);
        setReady(true);
      }
    };
    void initialize();
    return () => { mounted = false; };
  }, []);

  const chooseScan = useCallback((type: InputType) => {
    setInputType(type);
    setScanError(null);
    setRoute("Scan");
  }, []);

  const startScan = async (type: InputType, content: string) => {
    if (scanLock.current) return;
    scanLock.current = true;
    setScanning(true);
    setScanError(null);
    setNotice(null);
    try {
      const analysis = hasBackendConfiguration()
        ? await analyzeWithBackend({ type, content })
        : analyzeContent({ type, content });
      const now = new Date().toISOString();
      const completed: ScanResult = { ...analysis, id: `${Date.now()}`, analyzedAt: now };
      setResult(completed);
      const record: ScanHistoryRecord = {
        id: completed.id,
        inputType: type,
        score: completed.score,
        level: completed.level,
        explanation: completed.signals[0]?.title ?? t("noSignals"),
        method: completed.method,
        scannedAt: now,
      };
      const nextHistory = [record, ...history].slice(0, 100);
      setHistory(nextHistory);
      try {
        await saveHistory(nextHistory);
      } catch {
        setNotice("Analysis completed, but scan history could not be saved on this device.");
      }
      setRoute("Result");
    } catch (error) {
      setScanError(error instanceof Error ? error.message : t("scanError"));
    } finally {
      scanLock.current = false;
      setScanning(false);
    }
  };

  const changeLanguage = async (next: Language) => {
    setLanguage(next);
    try {
      await saveLanguage(next);
      setNotice(null);
    } catch {
      setNotice("Language changed for this session but could not be saved.");
    }
  };

  const clearHistory = async () => {
    try {
      await clearStoredHistory();
      setHistory([]);
      setNotice(null);
    } catch {
      setNotice("Scan history could not be deleted from this device.");
    }
  };

  if (!ready) {
    return <SafeAreaView style={styles.loading}><ActivityIndicator size="large" color={colors.blue} /><Text style={styles.loadingText}>{t("scanning")}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <View style={styles.brandMark}><Text style={styles.markText}>F</Text></View>
        <View style={styles.brandCopy}>
          <Text style={styles.brand}>{t("brand")}</Text>
          <Text style={styles.tagline}>{t("tagline")}</Text>
        </View>
      </View>
      {!!notice && <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text>}
      <View style={styles.content}>
        {route === "Home" && <HomeScreen language={language} history={history} onNavigate={setRoute} onChooseScan={chooseScan} />}
        {route === "Scan" && <ScanScreen key={inputType} language={language} initialType={inputType} scanning={scanning} error={scanError} onSubmit={startScan} />}
        {route === "Result" && <ResultScreen language={language} result={result} onScanAgain={() => chooseScan(inputType)} onHome={() => setRoute("Home")} />}
        {route === "History" && <HistoryScreen language={language} history={history} onClear={clearHistory} />}
        {route === "Safety" && <SafetyScreen language={language} />}
        {route === "Profile" && <ProfileScreen language={language} historyCount={history.length} onLanguageChange={changeLanguage} onClearHistory={clearHistory} />}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nav}>
        {routes.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="tab"
            accessibilityState={{ selected: route === item }}
            onPress={() => setRoute(item)}
            style={[styles.navItem, route === item && styles.navSelected]}
          >
            <Text style={[styles.navLabel, route === item && styles.navLabelSelected]}>{t(routeKeys[item])}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, gap: 12 },
  loadingText: { color: colors.navy, fontWeight: "700" },
  header: { width: "100%", maxWidth: 760, alignSelf: "center", flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 10, gap: 11 },
  brandMark: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" },
  markText: { color: colors.white, fontSize: 25, fontWeight: "900" },
  brandCopy: { flex: 1 },
  brand: { color: colors.navy, fontSize: 19, fontWeight: "900", letterSpacing: 1.5 },
  tagline: { color: colors.secondaryText, fontSize: 10, marginTop: 2 },
  notice: { maxWidth: 760, width: "92%", alignSelf: "center", padding: 10, borderRadius: 10, backgroundColor: colors.paleAmber, color: colors.text, fontSize: 12, marginBottom: 4 },
  content: { flex: 1 },
  nav: { minWidth: "100%", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 7, paddingTop: 8, paddingBottom: 7, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  navItem: { minWidth: 54, alignItems: "center", justifyContent: "center", paddingHorizontal: 9, paddingVertical: 10, borderRadius: 12 },
  navSelected: { backgroundColor: colors.paleBlue },
  navLabel: { color: colors.secondaryText, fontSize: 11, fontWeight: "700" },
  navLabelSelected: { color: colors.blue },
});
