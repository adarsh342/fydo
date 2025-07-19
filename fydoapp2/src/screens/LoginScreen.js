"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from "react-native-reanimated"
import { useAuth } from "../context/AuthContext"

const { width, height } = Dimensions.get("window")

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const { login } = useAuth()

  // Animation values
  const fadeAnim = useSharedValue(0)
  const slideAnim = useSharedValue(50)
  const logoScale = useSharedValue(0.8)

  useEffect(() => {
    // Entrance animations
    fadeAnim.value = withTiming(1, { duration: 800 })
    slideAnim.value = withTiming(0, { duration: 800 })
    logoScale.value = withSpring(1, { damping: 15, stiffness: 150 })
  }, [])

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }))

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }))

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setIsLoading(true)

    // Simulate loading with animation
    setTimeout(() => {
      const success = login(email, password)
      setIsLoading(false)

      if (success) {
        // Success animation before navigation
        logoScale.value = withSpring(1.1, { damping: 10 }, () => {
          runOnJS(navigation.replace)("Home")
        })
      } else {
        Alert.alert("Error", "Invalid credentials. Use test@example.com / 123456")
      }
    }, 1000)
  }

  const fillTestCredentials = () => {
    setEmail("test@example.com")
    setPassword("123456")
  }

  const handleInputFocus = () => {
    setIsKeyboardVisible(true)
  }

  const handleInputBlur = () => {
    setIsKeyboardVisible(false)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.content, animatedContainerStyle]}>
          <Animated.View style={[styles.header, animatedLogoStyle]}>
            <Text style={styles.logo}>Fydo</Text>
            <Text style={styles.subtitle}>Welcome back!</Text>
          </Animated.View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, Platform.OS === "web" && styles.webInput]}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.input, Platform.OS === "web" && styles.webInput]}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{isLoading ? "Signing in..." : "Sign In"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.testButton} onPress={fillTestCredentials} activeOpacity={0.7}>
              <Text style={styles.testButtonText}>Use Test Credentials</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F3",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    minHeight: height,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 8,
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginLeft: 4,
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
    minHeight: 52,
  },
  webInput: {
    outlineStyle: "none",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  button: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    minHeight: 52,
    justifyContent: "center",
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
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  testButton: {
    alignItems: "center",
    marginTop: 16,
    padding: 12,
  },
  testButtonText: {
    color: "#FF6B35",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
})

export default LoginScreen
