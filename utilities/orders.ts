import { useTheme } from "@/constants/theme";

const theme = useTheme();

export const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'completed':
            return theme.accent;
        case 'pending':
            return '#FF9800';
        case 'cancelled':
            return theme.danger;
        default:
            return theme.muted;
    };
};

export const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateString;
    }
};