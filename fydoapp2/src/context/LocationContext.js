"use client"

import { createContext, useContext, useState, useEffect } from "react"
import * as Location from "expo-location"
import { getDistance } from "geolib"
import { Platform, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const LocationContext = createContext()

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}

// Hardcoded shop location (Bangalore coordinates)
const SHOP_LOCATION = {
  latitude: 12.9716,
  longitude: 77.5946,
}

const RETRY_COUNTER_KEY = "@fydo_retry_counter"

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null)
  const [isWithinRange, setIsWithinRange] = useState(false)
  const [locationPermission, setLocationPermission] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [shouldShowDummyShops, setShouldShowDummyShops] = useState(false)

  // Load retry count on app start
  useEffect(() => {
    loadRetryCount()
  }, [])

  const loadRetryCount = async () => {
    try {
      const count = await AsyncStorage.getItem(RETRY_COUNTER_KEY)
      const currentCount = count ? Number.parseInt(count, 10) : 0
      setRetryCount(currentCount)
      console.log("Loaded retry count:", currentCount)
    } catch (error) {
      console.error("Error loading retry count:", error)
      setRetryCount(0)
    }
  }

  const updateRetryCount = async (newCount) => {
    try {
      await AsyncStorage.setItem(RETRY_COUNTER_KEY, newCount.toString())
      setRetryCount(newCount)
      console.log("Updated retry count to:", newCount)
    } catch (error) {
      console.error("Error updating retry count:", error)
    }
  }

  const requestLocationPermission = async () => {
    try {
      // Web fallback
      if (Platform.OS === "web") {
        if (!navigator.geolocation) {
          Alert.alert("Location Error", "Geolocation is not supported by this browser.")
          setLocationPermission(false)
          return false
        }
        setLocationPermission(true)
        return true
      }

      const { status } = await Location.requestForegroundPermissionsAsync()
      setLocationPermission(status === "granted")
      return status === "granted"
    } catch (error) {
      console.error("Error requesting location permission:", error)
      setLocationPermission(false)
      return false
    }
  }

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true)
      setShouldShowDummyShops(false)

      // Get current retry count
      const currentRetryCount = retryCount
      console.log("Current attempt:", currentRetryCount + 1)

      const hasPermission = await requestLocationPermission()

      if (!hasPermission) {
        setIsLoading(false)
        return null
      }

      let userLocation

      if (Platform.OS === "web") {
        // Enhanced web geolocation API with better error handling
        const position = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."))
            return
          }

          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              console.error("Geolocation error:", error)
              reject(error)
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 60000,
            },
          )
        })

        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      } else {
        // Native location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 10000,
        })

        userLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        }
      }

      setLocation(userLocation)

      // Calculate distance using geolib
      const distance = getDistance(userLocation, SHOP_LOCATION)
      const withinRange = distance <= 300 // 300 meters

      // Retry logic implementation
      if (!withinRange) {
        let newRetryCount = currentRetryCount + 1
        if (newRetryCount > 5) {
          newRetryCount = 1 // Reset cycle after 5th attempt
        }

        if (newRetryCount === 4 || newRetryCount === 5) {
          // 4th and 5th attempt: show dummy shops
          console.log("🎭 Showing dummy shops (attempt", newRetryCount, ")")
          setShouldShowDummyShops(true)
          setIsWithinRange(true) // Force showing shops screen
          await updateRetryCount(newRetryCount)
          setIsLoading(false)
          return { location: userLocation, withinRange: true, distance, isDummy: true }
        } else {
          // 1st, 2nd, 3rd attempt: show actual not serviceable (oops)
          console.log("❌ Showing not serviceable (attempt", newRetryCount, ")")
          setShouldShowDummyShops(false)
          setIsWithinRange(false)
          await updateRetryCount(newRetryCount)
          setIsLoading(false)
          return { location: userLocation, withinRange: false, distance, isDummy: false, showOops: true }
        }
      } else {
        // User is within range, reset counter
        console.log("✅ User within range, resetting counter")
        await updateRetryCount(0)
        setShouldShowDummyShops(false)
        setIsWithinRange(true)
      }

      setIsLoading(false)
      return { location: userLocation, withinRange: isWithinRange, distance, isDummy: false }
    } catch (error) {
      console.error("Error getting location:", error)
      setIsLoading(false)

      // Provide helpful error messages
      if (Platform.OS === "web") {
        Alert.alert(
          "Location Error",
          "Unable to get your location. Please ensure location services are enabled in your browser.",
        )
      } else {
        Alert.alert("Location Error", "Unable to get your location. Please check your location settings and try again.")
      }
      return null
    }
  }

  return (
    <LocationContext.Provider
      value={{
        location,
        isWithinRange,
        locationPermission,
        isLoading,
        retryCount,
        shouldShowDummyShops,
        getCurrentLocation,
        requestLocationPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}
