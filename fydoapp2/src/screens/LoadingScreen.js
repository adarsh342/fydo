"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, Platform } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  runOnJS,
} from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import * as SplashScreen from "expo-splash-screen"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const LoadingScreen = ({ navigation }) => {
  const { isAuthenticated } = useAuth()

  const fadeAnim = useSharedValue(0)
  const scaleAnim = useSharedValue(0.8)
  const pulseAnim = useSharedValue(1)
  const rotateAnim = useSharedValue(0)

  useEffect(() => {
    // Hide splash screen after component mounts
    SplashScreen.hideAsync()

    // Animate logo entrance
    fadeAnim.value = withTiming(1, { duration: 1000 })
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 100 })

    // Pulse animation
    pulseAnim.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
      false,
    )

    // Rotate animation for icon
    rotateAnim.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false)

    // Navigate after animation
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        runOnJS(navigation.replace)("Home")
      } else {
        runOnJS(navigation.replace)("Login")
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [isAuthenticated])

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }, { scale: pulseAnim.value }],
  }))

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value}deg` }],
  }))

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
        <View style={styles.iconContainer}>
          <Animated.View style={animatedIconStyle}>
            <Ionicons name="storefront" size={60} color="#fff" />
          </Animated.View>
        </View>
        <Text style={styles.logo}>Fydo</Text>
        <Text style={styles.tagline}>Your Local Shopping Companion</Text>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, { opacity: pulseAnim.value }]} />
            <Animated.View style={[styles.dot, { opacity: pulseAnim.value }]} />
            <Animated.View style={[styles.dot, { opacity: pulseAnim.value }]} />
          </View>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  tagline: {
    fontSize: 16,
    color: "#FFE5E0",
    textAlign: "center",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
    marginBottom: 30,
  },
  loadingContainer: {
    marginTop: 20,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFE5E0",
  },
})

export default LoadingScreen
