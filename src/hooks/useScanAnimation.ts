import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

export default function useScanAnimation(active: boolean) {
  const progress = useRef(new Animated.Value(0)).current;
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!active) {
      progress.stopAnimation();
      progress.setValue(0);
      setRunning(false);
      return;
    }
    setRunning(true);
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => {
      loop.stop();
      progress.stopAnimation();
      setRunning(false);
    };
  }, [active, progress]);

  return { progress, running };
}