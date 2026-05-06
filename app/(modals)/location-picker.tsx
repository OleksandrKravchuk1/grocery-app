import {useEffect, useState} from "react";
import {ActivityIndicator, Button, StyleSheet, Text, useColorScheme, View} from "react-native";
import MapView, {MapPressEvent, Marker, Region} from "react-native-maps";
import * as Location from "expo-location";
import {router} from "expo-router";
import {useLocation} from "@/context/LocationContext";
import {colors} from "@/constants/colors";

type Coords = { latitude: number; longitude: number };

const DEFAULT_REGION: Region = {
    latitude: 50.4501,
    longitude: 30.5234,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

export default function LocationPickerModal() {
    const {setLocation} = useLocation();
    const colorScheme = useColorScheme();
    const [region, setRegion] = useState<Region>(DEFAULT_REGION);
    const [picked, setPicked] = useState<Coords | null>(null);
    const [addressLabel, setAddressLabel] = useState("Selected location");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const resolveAddress = async (coords: Coords) => {
        try {
            const result = await Location.reverseGeocodeAsync(coords);
            const first = result[0];
            if (!first) return "Selected location";

            const parts = [first.street, first.city, first.region]
                .map((p) => p?.trim())
                .filter(Boolean) as string[];

            const uniqueParts = parts.filter(
                (part, index, arr) =>
                    index === arr.findIndex((p) => p.toLowerCase() === part.toLowerCase())
            );

            return uniqueParts.join(", ") || "Selected location";
        } catch {
            return "Selected location";
        }
    };

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            try {
                const {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    if (!cancelled) setError("Location permission denied");
                    return;
                }
                const pos = await Location.getCurrentPositionAsync({});
                const coords = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                };
                const label = await resolveAddress(coords);
                if (cancelled) return;
                setPicked(coords);
                setRegion((prev) => ({...prev, ...coords}));
                setAddressLabel(label);
            } catch {
                if (!cancelled) setError("Unable to determine current location");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        void init();
        return () => {
            cancelled = true;
        };
    }, []);

    const onMapPress = async (e: MapPressEvent) => {
        const coords = e.nativeEvent.coordinate;
        setPicked(coords);
        setAddressLabel(await resolveAddress(coords));
    };

    const onConfirm = () => {
        if (!picked) return;
        setLocation(picked, addressLabel);
        router.back();
    };

    if (loading) return <ActivityIndicator style={{flex: 1}} accessibilityLabel="Loading location picker"/>;
    if (error) return <View style={styles.center} accessibilityRole="alert"><Text>{error}</Text></View>;

    return (
        <View style={styles.container} accessibilityViewIsModal>
            <MapView
                style={styles.map}
                initialRegion={region}
                onPress={onMapPress}
                accessibilityLabel="Map for selecting your delivery location"
                accessibilityHint="Tap on the map to choose a location and then confirm the selected address below"
            >
                {picked && <Marker coordinate={picked} draggable onDragEnd={onMapPress as any}/>}
            </MapView>

            <View style={[styles.footer, {backgroundColor: colorScheme === 'dark' ? colors.darkGrey : colors.white}]}>
                <Text style={{color: colorScheme === 'dark' ? colors.white : colors.black}} numberOfLines={2} accessibilityRole="text">
                    {addressLabel}
                </Text>
                <Button title="Use this location" onPress={onConfirm} accessibilityLabel="Use this location"/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1
    },
    footer: {
        padding: 16,
        gap: 10,
        backgroundColor: "white"
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

});
