import { ErrorView } from '@/src/components/ui/view/ErrorView';
import { LoadingView } from '@/src/components/ui/view/LoadingView';
import { useAppTheme } from "@/src/context/ThemeContext";
import { OrderCard } from '@/src/features/order/components/OrderCard';
import { useOrders } from "@/src/features/order/hooks/useOrders";
import { FlatList, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrderEmptyComponent } from './OrderEmptyComponent';

export function OrdersScreen() {
  const { colors: theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const { data: orders = [], isLoading, error, refetch } = useOrders();

  if (error) return <ErrorView message="Failed to load orders. Please try again." onRetry={refetch} />;

  if (isLoading) return <LoadingView accessibilityLabel="Loading orders..." />;

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.screen }]}>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <OrderCard item={item} />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={OrderEmptyComponent}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  shopButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
