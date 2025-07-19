import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { Platform } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AuthProvider } from "./src/context/AuthContext"
import { LocationProvider } from "./src/context/LocationContext"
import LoginScreen from "./src/screens/LoginScreen"
import HomeScreen from "./src/screens/HomeScreen"
import NearbyShopsScreen from "./src/screens/NearbyShopsScreen"
import NotOperationalScreen from "./src/screens/NotOperationalScreen"
import LoadingScreen from "./src/screens/LoadingScreen"

const Stack = createStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <LocationProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#FF6B35" />
            <Stack.Navigator
              initialRouteName="Loading"
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#FF6B35",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                  fontSize: 18,
                  fontFamily: Platform.OS === "web" ? "Inter, sans-serif" : "System",
                },
                gestureEnabled: true,
                cardStyleInterpolator: ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                          }),
                        },
                      ],
                    },
                  }
                },
              }}
            >
              <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Fydo" }} />
              <Stack.Screen name="NearbyShops" component={NearbyShopsScreen} options={{ title: "Nearby Shops" }} />
              <Stack.Screen name="NotOperational" component={NotOperationalScreen} options={{ title: "Fydo" }} />
            </Stack.Navigator>
          </NavigationContainer>
        </LocationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
