import { useAppTheme } from "@/src/context/ThemeContext";
import { palette } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { isDark } = useAppTheme();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      animation: "shift",
      tabBarActiveTintColor: palette.green,
      tabBarInactiveTintColor: isDark ? palette.grey500 : palette.black,
      tabBarStyle: {
        backgroundColor: isDark ? palette.black : palette.white,
        borderTopColor: isDark ? palette.black : palette.white,
      }
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarAccessibilityLabel: "Home tab",
          animation: 'fade',
          tabBarIcon: ({ size, focused, color }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color}
              size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: "Favourite",
          tabBarAccessibilityLabel: "Favourite tab",
          tabBarIcon: ({ size, focused, color }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'}
              color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarAccessibilityLabel: "Search tab",
          tabBarIcon: ({ size, focused, color }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'}
              color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarAccessibilityLabel: "Profile tab",
          tabBarIcon: ({ size, focused, color }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'}
              color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}