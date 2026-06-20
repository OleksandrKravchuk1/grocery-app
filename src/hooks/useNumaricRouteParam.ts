import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

export function useNumericRouteParam(paramName: string): number {
  const params = useLocalSearchParams();
  const rawValue = params[paramName];

  return useMemo(() => {
    const raw = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    return Number(raw);
  }, [rawValue]);
}