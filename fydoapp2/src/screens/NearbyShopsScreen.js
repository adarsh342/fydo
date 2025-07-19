"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Dimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSpring } from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"
import { useLocation } from "../context/LocationContext"
import { ShimmerShopCard } from "../components/ShimmerLoader"

const { width } = Dimensions.get("window")

// Real shops data
const REAL_SHOPS = [
  {
    id: "1",
    name: "Green Grocery Store",
    category: "Groceries",
    distance: "150m",
    rating: 4.5,
    icon: "storefront",
    color: "#FF6B35",
  },
  {
    id: "2",
    name: "Fresh Bakery",
    category: "Bakery",
    distance: "220m",
    rating: 4.8,
    icon: "cafe",
    color: "#DC2626",
  },
  {
    id: "3",
    name: "Tech Repair Hub",
    category: "Electronics",
    distance: "280m",
    rating: 4.3,
    icon: "phone-portrait",
    color: "#FF8A65",
  },
  {
    id: "4",
    name: "Fashion Boutique",
    category: "Clothing",
    distance: "295m",
    rating: 4.6,
    icon: "shirt",
    color: "#FF5722",
  },
]

// Dummy shops data as requested
const DUMMY_SHOPS = [
  {
    id: "1",
    name: "Fydo Test Store 1",
    distance: "1.2 km",
    category: "Demo Store",
    rating: 4.2,
    icon: "storefront",
    color: "#FF6B35",
  },
  {
    id: "2",
    name: "Fydo Test Store 2",
    distance: "2.5 km",
    category: "Test Shop",
    rating: 4.0,
    icon: "bag",
    color: "#DC2626",
  },
  {
    id: "3",
    name: "Demo Mart",
    distance: "3.1 km",
    category: "Sample Store",
    rating: 3.8,
    icon: "basket",
    color: "#FF8A65",
  },
  {
    id: "4",
    name: "Mock Retail",
    distance: "0.9 km",
    category: "Mock Shop",
    rating: 4.5,
    icon: "business",
    color: "#FF5722",
  },
]

const AnimatedShopItem = ({ item, index, isDummy }) => {
  const fadeAnim = useSharedValue(0)
  const slideAnim = useSharedValue(50)
  const scaleAnim = useSharedValue(0.9)

  useEffect(() => {
    const delay = index * 150

    fadeAnim.value = withDelay(delay, withTiming(1, { duration: 500 }))
    slideAnim.value = withDelay(delay, withTiming(0, { duration: 500 }))
    scaleAnim.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 100 }))
  }, [index])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }, { scale: scaleAnim.value }],
  }))

  return (
    <Animated.View style={[styles.shopCard, animatedStyle]}>
      <TouchableOpacity
        style={styles.shopContent}
        activeOpacity={0.8}
        onPress={() => {
          console.log(`Selected shop: ${item.name}`)
        }}
      >
        <View style={[styles.shopIcon, { backgroundColor: `${item.color}20` }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>

        <View style={styles.shopInfo}>
          <View style={styles.shopNameContainer}>
            <Text style={styles.shopName}>{item.name}</Text>
            {isDummy && (
              <View style={styles.demoBadge}>
                <Text style={styles.demoBadgeText}>DEMO</Text>
              </View>
            )}
          </View>
          <Text style={styles.shopCategory}>{item.category}</Text>
          <View style={styles.shopMeta}>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <Text style={styles.distance}>{item.distance} away</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </TouchableOpacity>
    </Animated.View>
  )
}

const NearbyShopsScreen = () => {
  const { shouldShowDummyShops } = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [shopsData, setShopsData] = useState([])

  const headerFadeAnim = useSharedValue(0)
  const headerSlideAnim = useSharedValue(-30)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
      setShopsData(shouldShowDummyShops ? DUMMY_SHOPS : REAL_SHOPS)

      headerFadeAnim.value = withTiming(1, { duration: 600 })
      headerSlideAnim.value = withTiming(0, { duration: 600 })
    }, 1500)

    return () => clearTimeout(timer)
  }, [shouldShowDummyShops])

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerFadeAnim.value,
    transform: [{ translateY: headerSlideAnim.value }],
  }))

  const renderShopItem = ({ item, index }) => (
    <AnimatedShopItem item={item} index={index} isDummy={shouldShowDummyShops} />
  )

  const renderShimmerItem = ({ index }) => <ShimmerShopCard key={index} />

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.loadingBadge}>
            <Ionicons name="search" size={24} color="#16a34a" />
            <Text style={styles.loadingText}>Finding shops near you...</Text>
          </View>
        </View>
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={renderShimmerItem}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, animatedHeaderStyle]}>
        {shouldShowDummyShops ? (
          <View style={styles.demoBanner}>
            <Ionicons name="flask" size={24} color="#f59e0b" />
            <Text style={styles.demoText}>🎭 Demo Mode - Sample Stores for Testing</Text>
          </View>
        ) : (
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
            <Text style={styles.successText}>Great! We found shops near you</Text>
          </View>
        )}
      </Animated.View>

      <FlatList
        data={shopsData}
        renderItem={renderShopItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === "ios"}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F3",
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F3",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successText: {
    flex: 1,
    fontSize: 16,
    color: "#DC2626",
    fontWeight: "500",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  demoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: "#fbbf24",
    shadowColor: "#f59e0b",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demoText: {
    flex: 1,
    fontSize: 16,
    color: "#92400e",
    fontWeight: "600",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  loadingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  loadingText: {
    flex: 1,
    fontSize: 16,
    color: "#0369a1",
    fontWeight: "500",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  listContainer: {
    padding: 24,
    paddingTop: 8,
  },
  shopCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  shopContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  shopIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  shopInfo: {
    flex: 1,
  },
  shopNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  demoBadge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  demoBadgeText: {
    fontSize: 10,
    color: "#92400e",
    fontWeight: "bold",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  shopCategory: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  shopMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
  distance: {
    fontSize: 14,
    color: "#6b7280",
    fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
  },
})

export default NearbyShopsScreen
