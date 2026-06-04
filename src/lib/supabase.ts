import { AppState, Platform } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { createClient, processLock } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// Custom secure storage adapter for Expo
const secureStorage = {
    getItem: async (key: string) => {
        try {
            return await SecureStore.getItemAsync(key)
        } catch (error) {
            console.error('Error reading from secure store:', error)
            return null
        }
    },
    setItem: async (key: string, value: string) => {
        try {
            await SecureStore.setItemAsync(key, value)
        } catch (error) {
            console.error('Error writing to secure store:', error)
        }
    },
    removeItem: async (key: string) => {
        try {
            await SecureStore.deleteItemAsync(key)
        } catch (error) {
            console.error('Error removing from secure store:', error)
        }
    },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        ...(Platform.OS !== 'web' ? { storage: secureStorage } : { storage: AsyncStorage }),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        lock: processLock,
    },
})

if (Platform.OS !== 'web') {
    AppState.addEventListener('change', (state) => {
        if (state === 'active') {
            supabase.auth.startAutoRefresh()
        } else {
            supabase.auth.stopAutoRefresh()
        }
    })
}