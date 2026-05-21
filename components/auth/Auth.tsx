import React, { useState } from 'react'
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, useColorScheme } from 'react-native'
import { colors } from '@/constants/colors'
import { supabase } from '@/lib/supabase'

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    return (
        <View style={[styles.screen, { backgroundColor: isDark ? colors.black : colors.white }]}>
            <View style={[styles.card, { backgroundColor: isDark ? colors.darkGrey : colors.lightGrey }]}>
                <Text style={[styles.title, { color: isDark ? colors.white : colors.black }]}>Welcome back</Text>
                <Text style={[styles.subtitle, { color: isDark ? '#CFCFCF' : '#666666' }]}>Sign in to continue shopping</Text>

                <View style={styles.fieldGroup}>
                    <Text style={[styles.label, { color: isDark ? colors.white : colors.black }]}>Email</Text>
                    <TextInput
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        placeholderTextColor={isDark ? '#A8A8A8' : '#8A8A8A'}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={[
                            styles.input,
                            {
                                color: isDark ? colors.white : colors.black,
                                backgroundColor: isDark ? '#2A2A2A' : colors.white,
                                borderColor: isDark ? '#3A3A3A' : '#E4E4E4',
                            },
                        ]}
                    />
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={[styles.label, { color: isDark ? colors.white : colors.black }]}>Password</Text>
                    <TextInput
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Password"
                        placeholderTextColor={isDark ? '#A8A8A8' : '#8A8A8A'}
                        autoCapitalize="none"
                        style={[
                            styles.input,
                            {
                                color: isDark ? colors.white : colors.black,
                                backgroundColor: isDark ? '#2A2A2A' : colors.white,
                                borderColor: isDark ? '#3A3A3A' : '#E4E4E4',
                            },
                        ]}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.buttonDisabled]}
                    onPress={() => signInWithEmail()}
                    disabled={loading}
                >
                    <Text style={styles.primaryButtonText}>{loading ? 'Please wait...' : 'Sign in'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.secondaryButton,
                        { borderColor: isDark ? '#4A4A4A' : '#D8D8D8' },
                        loading && styles.buttonDisabled,
                    ]}
                    onPress={() => signUpWithEmail()}
                    disabled={loading}
                >
                    <Text style={[styles.secondaryButtonText, { color: isDark ? colors.white : colors.black }]}>Create account</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    card: {
        borderRadius: 18,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 15,
        marginTop: 6,
        marginBottom: 18,
    },
    fieldGroup: {
        marginBottom: 14,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    primaryButton: {
        backgroundColor: colors.green,
        borderRadius: 12,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 12,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
})