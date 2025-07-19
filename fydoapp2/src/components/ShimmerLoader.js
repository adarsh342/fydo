"use client"

import { useEffect } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated"

const { width } = Dimensions.get("window")

const ShimmerLoader = ({ height = 80, borderRadius = 16, style }) => {
  const shimmerTranslateX = useSharedValue(-width)

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(withTiming(width, { duration: 1500 }), -1, false)
  }, [])

  const shimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmerTranslateX.value, [-width, 0, width], [0, 1, 0])

    return {
      transform: [{ translateX: shimmerTranslateX.value }],
      opacity,
    }
  })

  return (
    <View style={[styles.container, { height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmer, shimmerStyle]} />
    </View>
  )
}

const ShimmerShopCard = () => (
  <View style={styles.shopCard}>
    <View style={styles.shopContent}>
      <ShimmerLoader height={48} borderRadius={24} style={styles.shopIcon} />
      <View style={styles.shopInfo}>
        <ShimmerLoader height={20} borderRadius={4} style={styles.shopName} />
        <ShimmerLoader height={16} borderRadius={4} style={styles.shopCategory} />
        <View style={styles.shopMeta}>
          <ShimmerLoader height={14} borderRadius={4} style={styles.rating} />
          <ShimmerLoader height={14} borderRadius={4} style={styles.distance} />
        </View>
      </View>
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
  },
  shimmer: {
    width: "30%",
    height: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
  shopCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shopContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  shopIcon: {
    width: 48,
    marginRight: 16,
  },
  shopInfo: {
    flex: 1,
    gap: 8,
  },
  shopName: {
    width: "70%",
  },
  shopCategory: {
    width: "50%",
  },
  shopMeta: {
    flexDirection: "row",
    gap: 16,
  },
  rating: {
    width: 60,
  },
  distance: {
    width: 80,
  },
})

export { ShimmerLoader, ShimmerShopCard }
