import { useEffect, useState } from "react";
import { MapPressEvent, Region } from "react-native-maps";
import { useReverseGeocode } from "./useReverseGeocode";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useLocation } from "@/context/LocationContext";

type Coords = { latitude: number; longitude: number };

const DEFAULT_REGION: Region = {
    latitude: 50.4501,
    longitude: 30.5234,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

export function useCurrentLocation() {
    const { setLocation } = useLocation();
    const [region, setRegion] = useState<Region>(DEFAULT_REGION);
    const [picked, setPicked] = useState<Coords | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: addressLabel = "Selected location" } = useReverseGeocode(picked);

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    if (!cancelled) setError("Location permission denied");
                    return;
                }
                const pos = await Location.getCurrentPositionAsync({});
                const coords = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                };

                if (cancelled) return;
                setPicked(coords);
                setRegion((prev) => ({ ...prev, ...coords }));
            } catch {
                if (!cancelled) setError("Unable to determine current location");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        void init();
        return () => { cancelled = true; };
    }, []);

    const onMapPress = async (e: MapPressEvent) => {
        const coords = e.nativeEvent.coordinate;
        setPicked(coords);
    };

    const onConfirm = () => {
        if (!picked) return;
        setLocation(picked, addressLabel);
        router.back();
    };

    return {
        region,
        picked,
        loading,
        error,
        addressLabel,
        onMapPress,
        onConfirm
    }
}