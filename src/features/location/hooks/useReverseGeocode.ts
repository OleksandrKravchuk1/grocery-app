import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";

type Coords = { latitude: number; longitude: number };

async function resolveAddress(coords: Coords): Promise<string> {
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
}

export function useReverseGeocode(coords: Coords | null) {
    return useQuery({
        queryKey: ["address", coords?.latitude, coords?.longitude],
        queryFn: () => resolveAddress(coords!),
        enabled: !!coords,
        staleTime: Infinity,
    });
}