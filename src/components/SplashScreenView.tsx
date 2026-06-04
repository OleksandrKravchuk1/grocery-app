import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';

export const SplashScreenView = () => {
    return (
        <View style={styles.container}>
            <MaskedView
                style={{flex: 1, flexDirection: 'row', height: '100%'}}
                maskElement={
                    <View style={styles.maskedContainer}>
                        <Text style={styles.maskedText}>grabber</Text>
                    </View>
                }
            >
                <Animated.View
                    style={[styles.gradient, {
                        animationName: {
                            to: {
                                transform: [{rotate: '360deg'}],
                            },
                        },
                        animationDuration: '3s',
                        animationIterationCount: 3,
                    },]}
                >
                </Animated.View>
            </MaskedView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },

    maskedContainer: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    maskedText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'black',
    },
    gradient: {
        experimental_backgroundImage: 'linear-gradient(90deg, #a9d97c 0%, #68cf38 50%, #38b564 100%)',
        width: '100%',
        height: '100%',
    },
});

export default SplashScreenView;