import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";

interface ScanCardProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export default function ScanCard({ title, description, icon, onPress, accessibilityLabel }: ScanCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.icon}><Text style={styles.iconText}>{icon}</Text></View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: "100%", flexDirection: "row", alignItems: "center", padding: 16, gap: 13, borderWidth: 1, borderColor: colors.border, borderRadius: 18, backgroundColor: colors.white },
  icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.paleBlue, alignItems: "center", justifyContent: "center" },
  iconText: { color: colors.blue, fontSize: 22, fontWeight: "800" },
  copy: { flex: 1 },
  title: { color: colors.navy, fontSize: 15, fontWeight: "800" },
  description: { color: colors.secondaryText, fontSize: 12, marginTop: 4, lineHeight: 18 },
  arrow: { color: colors.blue, fontSize: 27, paddingHorizontal: 4 },
  pressed: { opacity: 0.8 },
});