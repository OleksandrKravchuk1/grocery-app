export const getStatusColor = (status: string, theme: any) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return theme.accent;
    case 'pending':
      return '#FF9800';
    case 'processing':
      return '#3B82F6';
    case 'shipped':
    case 'delivering':
      return '#8B5CF6';
    case 'cancelled':
      return theme.danger;
    default:
      return theme.muted;
  }
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

export function getStatusLabel(status: string) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'Order accepted';
    case 'processing':
      return 'Preparing your food...';
    case 'shipped':
    case 'delivering':
      return 'Courier is on the way 🛵';
    case 'delivered':
    case 'completed':
      return 'Delivered! 🎉';
    default:
      return status;
  }
}
