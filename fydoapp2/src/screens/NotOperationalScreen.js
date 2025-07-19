"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
} from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

const NotOperationalScreen = ({ navigation }) => {
  const fadeAnim = useSharedValue(0)
  const scaleAnim = useSharedValue(0.8)
  const bounceAnim = useSharedValue(0)
  const cardSlideAnim = useSharedValue(30)

  useEffect(() => {
    // Initial entrance animation
    fadeAnim.value = withTiming(1, { duration: 800 })
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 100 })
    cardSlideAnim.value = withTiming(0, { duration: 800 })

    // Continuous bounce animation for the icon
    bounceAnim.value = withRepeat(
      withSequence(withTiming(-10, { duration: 1000 }), withTiming(0, { duration: 1000 })),
      -1,
      false,
    )
  }, [])

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }))

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnim.value }],
  }))

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardSlideAnim.value }],
  }))

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedContainerStyle]}>
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          <Ionicons name="location-outline" size={80} color="#FF6B35" />
        </Animated.View>

        <Text style={styles.title}>Oops!</Text>
        <Text style={styles.message}>We are not operational in your area</Text>
        <Text style={styles.subMessage}>Don't worry! We're expanding rapidly and hope to serve you soon.</Text>

        <Animated.View style={[styles.infoCard, animatedCardStyle]}>
          <Ionicons name="information-circle" size={24} color="#3b82f6" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Stay Updated</Text>
            <Text style={styles.infoDescription}>We'll notify you as soon as we launch in your area</Text>
          </View>
        </Animated.View>

        {Platform.OS === "web" && (
          <Animated.View style={[styles.webInfo, animatedCardStyle]}>
            <Ionicons name="globe-outline" size={20} color="#16a34a" />
            <Text style={styles.webInfoText}>Web version: Location detection may vary based on browser settings</Text>
          </Animated.View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="#FF6B35" />
          <Text style={styles.backButtonText}>Try Different Location</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F3",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    maxWidth: 320,
    width: "100%",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFE5E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  message: {
    fontSize: 20,
    color: "#374151",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  subMessage: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "flex-start",
    gap: 12,
    width: "100%",
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 4,
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  infoDescription: {
    fontSize: 14,
    color: "#3730a3",
    lineHeight: 20,
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  webInfo: {
    flexDirection: "row",
    backgroundColor: "#FFF5F3",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  webInfoText: {
    flex: 1,
    fontSize: 12,
    color: "#DC2626",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
})

export default NotOperationalScreen
