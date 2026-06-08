import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CreditCardViewProps } from '../types/payment';
import { formatCardNumberForFace, formatExpiryForFace, getCardTheme } from '../utilities/card';

export function CreditCardView({
  cardholderName,
  cardNumber,
  expiryDate,
  cvv,
  brand,
  flipped,
}: CreditCardViewProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - 32;
  const cardHeight = cardWidth / 1.62;

  const rotateY = useSharedValue(0);

  useEffect(() => {
    rotateY.value = withTiming(flipped ? 180 : 0, { duration: 500 });
  }, [flipped, rotateY]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spin = rotateY.value;
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${spin}deg` }
      ],
      opacity: spin > 90 ? 0 : 1,
      zIndex: spin > 90 ? 0 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const spin = rotateY.value - 180;
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${spin}deg` }
      ],
      opacity: spin > -90 ? 1 : 0,
      zIndex: spin > -90 ? 1 : 0,
    };
  });

  const theme = getCardTheme(brand);

  return (
    <View style={[styles.cardContainer, { width: cardWidth, height: cardHeight }]}>
      {/* FRONT OF THE CARD */}
      <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
        <LinearGradient
          colors={theme.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Glassmorphic glow overlay */}
          <View style={styles.cardGlow} />

          <View style={styles.header}>
            <View style={styles.chip} />
            <Text style={[styles.brandText, { color: theme.logoColor }]}>
              {theme.brandName}
            </Text>
          </View>

          <Text style={styles.cardNumberText}>
            {formatCardNumberForFace(cardNumber)}
          </Text>

          <View style={styles.footer}>
            <View>
              <Text style={styles.labelText}>CARDHOLDER</Text>
              <Text style={styles.valueText}>
                {cardholderName.toUpperCase() || 'NAME SURNAME'}
              </Text>
            </View>
            <View style={styles.expiryContainer}>
              <Text style={styles.labelText}>EXPIRES</Text>
              <Text style={styles.valueText}>
                {formatExpiryForFace(expiryDate)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* BACK OF THE CARD */}
      <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
        <LinearGradient
          colors={theme.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.magneticStrip} />

          <View style={styles.signatureAndCvvContainer}>
            <View style={styles.signatureStrip}>
              <Text style={styles.signatureText}>Authorized Signature</Text>
            </View>
            <View style={styles.cvvStrip}>
              <Text style={styles.cvvText}>{cvv || '•••'}</Text>
            </View>
          </View>

          <View style={styles.backFooter}>
            <Text style={styles.disclaimerText}>
              This mock card is properties of Grocery App Dev. If found, please return to Grocery Store.
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignSelf: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  gradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    transform: [{ rotate: '-45deg' }, { scaleY: 1.5 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    width: 45,
    height: 35,
    borderRadius: 6,
    backgroundColor: '#e5c158',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  cardNumberText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
    fontFamily: 'Courier',
    marginVertical: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  labelText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 9,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  valueText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  expiryContainer: {
    alignItems: 'flex-end',
  },
  magneticStrip: {
    height: 40,
    backgroundColor: '#111',
    marginHorizontal: -24,
    marginTop: 8,
  },
  signatureAndCvvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  signatureStrip: {
    flex: 4,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  signatureText: {
    color: '#333',
    fontSize: 10,
    fontStyle: 'italic',
  },
  cvvStrip: {
    flex: 1,
    height: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cvvText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Courier',
  },
  backFooter: {
    marginTop: 'auto',
  },
  disclaimerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 8,
    lineHeight: 11,
    textAlign: 'center',
  },
});
