import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/constants/colors";
import {useColorScheme} from "react-native";

export default function TabLayout() {
    const isDark = useColorScheme() === 'dark'

    return (
        <Tabs screenOptions={{
            headerShown: false,
            animation: "shift",
            tabBarActiveTintColor: colors.green,
            tabBarInactiveTintColor: isDark ? colors.mutedDark : colors.black,
            tabBarStyle: {
                backgroundColor: isDark ? colors.black : colors.white,
                borderTopColor: isDark ? colors.black : colors.white,
            }
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarAccessibilityLabel: "Home tab",
                    animation: 'fade',
                    tabBarIcon: ({size, focused, color}) => (
                        <Ionicons name={focused ? 'home' : 'home-outline'} color={color}
                                  size={size}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="favourite"
                options={{
                    title: "Favourite",
                    tabBarAccessibilityLabel: "Favourite tab",
                    tabBarIcon: ({size, focused, color}) => (
                        <Ionicons name={focused ? 'heart' : 'heart-outline'}
                                  color={color} size={size}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarAccessibilityLabel: "Search tab",
                    tabBarIcon: ({size, focused, color}) => (
                        <Ionicons name={focused ? 'search' : 'search-outline'}
                                  color={color} size={size}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarAccessibilityLabel: "Profile tab",
                    tabBarIcon: ({size, focused, color}) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'}
                                  color={color} size={size}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: "Menu",
                    tabBarAccessibilityLabel: "Menu tab",
                    tabBarIcon: ({size, focused, color}) => (
                        <Ionicons name={focused ? 'menu' : 'menu-outline'} color={color}
                                  size={size}/>
                    ),
                }}
            />

        </Tabs>
    )
}