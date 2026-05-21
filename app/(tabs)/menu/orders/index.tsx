import Animated from 'react-native-reanimated';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrderCard } from '@/components/OrderCard';
import { ErrorView } from '@/components/ui/ErrorView';
import { LoadingView } from '@/components/ui/LoadingView';
import { useTheme } from "@/constants/theme";
import { useOrders } from "@/hooks/useOrders";
import { MaterialIcons } from "@expo/vector-icons";

export default function OrdersScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const { data: orders = [], isLoading, error, refetch } = useOrders();

    const renderEmpty = () => {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.screen }]}>
                <MaterialIcons name="shopping-bag" size={64} color={theme.muted} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No Orders Yet</Text>
                <Text style={[styles.emptyMessage, { color: theme.muted }]}>
                    Start shopping to place your first order
                </Text>
            </View>
        );
    }

    if (error) {
        return <ErrorView message="Failed to load orders. Please try again." onRetry={refetch} />;
    }

    if (isLoading) {
        return <LoadingView />;
    }

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
                    { paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
    },
    emptyMessage: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
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
