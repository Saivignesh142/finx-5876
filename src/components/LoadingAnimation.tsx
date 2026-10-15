import React from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";
import useScanAnimation from "../hooks/useScanAnimation";

interface LoadingAnimationProps {
  label: string;
}

export default function LoadingAnimation({ label }: LoadingAnimationProps) {
  const { progress } = useScanAnimation(true);
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.04] });
  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityLabel={label}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <ActivityIndicator size="large" color={colors.blue} />
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 12, padding: 24, backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.navy, fontSize: 14, fontWeight: "700", textAlign: "center" },
});