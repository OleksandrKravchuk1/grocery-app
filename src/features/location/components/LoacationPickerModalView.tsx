import { Button, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { ErrorView } from "@/src/components/ui/view/ErrorView";
import { LoadingView } from "@/src/components/ui/view/LoadingView";
import { useTheme } from "@/src/constants/theme";
import { useCurrentLocation } from "@/src/hooks/useCurrentLocation";

export function LocationPickerModalView() {
  const theme = useTheme();
  const { region, picked, loading, error, addressLabel, onMapPress, onConfirm } = useCurrentLocation();

  if (loading) return <LoadingView accessibilityLabel="Loading location picker" />;
  if (error) return <ErrorView message={error} />;

  return (
    <View style={styles.container} accessibilityViewIsModal>
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={onMapPress}
        accessibilityLabel="Map for selecting your delivery location"
        accessibilityHint="Tap on the map to choose a location and then confirm the selected address below"
      >
        {picked && <Marker coordinate={picked} draggable onDragEnd={onMapPress as any} />}
      </MapView>

      <View style={[styles.footer, { backgroundColor: theme.screen }]}>
        <Text style={{ color: theme.text }} numberOfLines={2} accessibilityRole="text">
          {addressLabel}
        </Text>
        <Button title="Use this location" onPress={onConfirm} accessibilityLabel="Use this location" />
      </View>
    </View>
  )
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