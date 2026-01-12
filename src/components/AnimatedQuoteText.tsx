import React, { useEffect } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AnimatedQuoteTextProps {
  text: string;
  style?: TextStyle;
}

// Animation types
type AnimationType =
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'zoom'
  | 'bounce'
  | 'rotate'
  | 'flip'
  | 'pulse'
  | 'typing'
  | 'wobble';

const ANIMATIONS: AnimationType[] = [
  'fade',
  'slideUp',
  'slideDown',
  'zoom',
  'bounce',
  'rotate',
  'flip',
  'pulse',
  'typing',
  'wobble',
];

function getRandomAnimation(): AnimationType {
  return ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
}

export function AnimatedQuoteText({ text, style }: AnimatedQuoteTextProps) {
  const animationType = React.useMemo(() => getRandomAnimation(), []);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const rotateY = useSharedValue(0);

  useEffect(() => {
    switch (animationType) {
      case 'fade':
        opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
        break;

      case 'slideUp':
        translateY.value = 50;
        opacity.value = 0;
        translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
        opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
        break;

      case 'slideDown':
        translateY.value = -50;
        opacity.value = 0;
        translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
        opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
        break;

      case 'zoom':
        scale.value = 0;
        opacity.value = 0;
        scale.value = withSpring(1, { damping: 10, stiffness: 100 });
        opacity.value = withTiming(1, { duration: 500 });
        break;

      case 'bounce':
        scale.value = 0;
        scale.value = withSequence(
          withSpring(1.2, { damping: 8, stiffness: 100 }),
          withSpring(1, { damping: 8, stiffness: 100 })
        );
        opacity.value = withTiming(1, { duration: 400 });
        break;

      case 'rotate':
        rotation.value = -180;
        opacity.value = 0;
        rotation.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.ease) });
        opacity.value = withTiming(1, { duration: 700 });
        break;

      case 'flip':
        rotateY.value = 90;
        opacity.value = 0;
        rotateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
        opacity.value = withTiming(1, { duration: 600 });
        break;

      case 'pulse':
        opacity.value = 0;
        scale.value = 0.8;
        opacity.value = withTiming(1, { duration: 500 });
        scale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        break;

      case 'typing':
        opacity.value = 0;
        // Simulate typing with progressive fade-in
        opacity.value = withDelay(
          200,
          withTiming(1, { duration: text.length * 30, easing: Easing.linear })
        );
        break;

      case 'wobble':
        translateX.value = 0;
        opacity.value = 0;
        opacity.value = withTiming(1, { duration: 400 });
        translateX.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 100, easing: Easing.inOut(Easing.ease) }),
            withTiming(5, { duration: 100, easing: Easing.inOut(Easing.ease) }),
            withTiming(-5, { duration: 100, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 100, easing: Easing.inOut(Easing.ease) })
          ),
          2,
          false
        );
        break;
    }
  }, [animationType, text]);

  const animatedStyle = useAnimatedStyle(() => {
    const baseStyle: any = {
      opacity: opacity.value,
    };

    switch (animationType) {
      case 'fade':
        return { ...baseStyle };
      case 'slideUp':
      case 'slideDown':
        return { ...baseStyle, transform: [{ translateY: translateY.value }] };
      case 'zoom':
      case 'bounce':
      case 'pulse':
        return { ...baseStyle, transform: [{ scale: scale.value }] };
      case 'rotate':
        return { ...baseStyle, transform: [{ rotate: `${rotation.value}deg` }] };
      case 'flip':
        return { ...baseStyle, transform: [{ rotateY: `${rotateY.value}deg` }] };
      case 'typing':
        return { ...baseStyle };
      case 'wobble':
        return { ...baseStyle, transform: [{ translateX: translateX.value }] };
      default:
        return baseStyle;
    }
  });

  // For typing animation, we need to use a worklet-compatible approach
  if (animationType === 'typing') {
    return (
      <Animated.Text style={[styles.text, style, animatedStyle]}>
        {text}
      </Animated.Text>
    );
  }

  return (
    <Animated.Text style={[styles.text, style, animatedStyle]}>
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
