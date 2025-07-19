"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform, Dimensions } from "react-native"
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
import { useLocation } from "../context/LocationContext"
import { __DEV__ } from "react-native"

const { width } = Dimensions.get("window")

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth()
  const { getCurrentLocation, retryCount } = useLocation()
  const [isCheckingLocation, setIsCheckingLocation] = useState(false)

  // Animation values
  const fadeAnim = useSharedValue(0)
  const scaleAnim = useSharedValue(0.9)
  const iconRotation = useSharedValue(0)
  const pulseScale = useSharedValue(1)

  useEffect(() => {
    // Entrance animations
    fadeAnim.value = withTiming(1, { duration: 600 })
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 100 })

    // Continuous icon animation
    iconRotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 1000 }),
        withTiming(-5, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      ),
      -1,
      false,
    )
  }, [])

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }))

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }, { scale: pulseScale.value }],
  }))

  const handleFindShops = async () => {
    setIsCheckingLocation(true)

    // Start pulse animation
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 500 }), withTiming(1, { duration: 500 })),
      3,
      false,
    )

    try {
      const result = await getCurrentLocation()

      if (result) {
        const { withinRange } = result

        // Add a small delay for better UX
        setTimeout(() => {
          setIsCheckingLocation(false)
          pulseScale.value = withTiming(1, { duration: 300 })

          if (withinRange) {
            runOnJS(navigation.navigate)("NearbyShops")
          } else {
            runOnJS(navigation.navigate)("NotOperational")
          }
        }, 1500)
      } else {
        setIsCheckingLocation(false)
        pulseScale.value = withTiming(1, { duration: 300 })

        if (Platform.OS === "web") {
          Alert.alert(
            "Location Error",
            "Unable to get your location. Please ensure location services are enabled in your browser and try again.",
          )
        } else {
          Alert.alert("Location Error", "Unable to get your location. Please check your permissions and try again.")
        }
      }
    } catch (error) {
      setIsCheckingLocation(false)
      pulseScale.value = withTiming(1, { duration: 300 })
      Alert.alert("Error", "Something went wrong. Please try again.")
    }
  }

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?")
      if (confirmed) {
        logout()
        navigation.replace("Login")
      }
    } else {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout()
            navigation.replace("Login")
          },
        },
      ])
    }
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedContainerStyle]}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || "User"}!</Text>

          {/* Debug info for testing */}
          {__DEV__ && (
            <View style={styles.debugInfo}>
              <Text style={styles.debugText}>🔄 Attempt: {retryCount + 1}</Text>
              <Text style={styles.debugText}>
                {retryCount < 3
                  ? "Next: Real location check"
                  : retryCount === 3 || retryCount === 4
                    ? "Next: Demo shops"
                    : "Next: Reset counter"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
            <Ionicons name="location" size={48} color="#FF6B35" />
          </Animated.View>

          <Text style={styles.cardTitle}>Find Nearby Shops</Text>
          <Text style={styles.cardDescription}>Discover amazing local shops and services in your area</Text>

          <TouchableOpacity
            style={[styles.findButton, isCheckingLocation && styles.buttonDisabled]}
            onPress={handleFindShops}
            disabled={isCheckingLocation}
            activeOpacity={0.8}
          >
            {isCheckingLocation ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.buttonText}>Checking location...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Find Shops Near Me</Text>
            )}
          </TouchableOpacity>
        </View>

        {Platform.OS === "web" && (
          <View style={styles.webNotice}>
            <Ionicons name="information-circle" size={16} color="#3b82f6" />
            <Text style={styles.webNoticeText}>Web version: Location features may require browser permissions</Text>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F3",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 48,
  },
  welcome: {
    fontSize: 24,
    color: "#6b7280",
    marginBottom: 4,
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  userName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  debugInfo: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  cardDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  findButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: width * 0.6,
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  webNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  webNoticeText: {
    flex: 1,
    fontSize: 12,
    color: "#1e40af",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
  },
  logoutText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
})

export default HomeScreen
