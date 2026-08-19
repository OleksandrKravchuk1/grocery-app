import { useTheme } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  status: string;
};

const STEPS = [
  { id: 'pending', label: 'Order placed' },
  { id: 'processing', label: 'Preparing' },
  { id: 'delivering', label: 'On the way' },
  { id: 'completed', label: 'Delivered' },
];

export function OrderTimeline({ status: currentStatusStr }: Props) {
  const theme = useTheme();

  const currentStatus = currentStatusStr?.toLowerCase() || 'pending';

  // Find current step index
  let currentIndex = STEPS.findIndex(s => s.id === currentStatus);
  if (currentIndex === -1) {
    if (currentStatus === 'cancelled') currentIndex = 0; // Show only first step if cancelled
    else currentIndex = 0;
  }

  const isCancelled = currentStatus === 'cancelled';

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        const isLast = index === STEPS.length - 1;

        let iconColor = theme.muted;
        let iconName: any = "ellipse-outline";

        if (isCancelled && isCurrent) {
          iconColor = theme.danger;
          iconName = "close-circle";
        } else if (isPast || isCurrent) {
          iconColor = theme.accent;
          iconName = isPast ? "checkmark-circle" : "radio-button-on";
        }

        return (
          <View key={step.id} style={styles.stepRow}>
            {/* Timeline graphics */}
            <View style={styles.timelineCol}>
              <Ionicons name={iconName} size={24} color={iconColor} />
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: isPast && !isCancelled ? theme.accent : theme.border }
                  ]}
                />
              )}
            </View>

            {/* Text info */}
            <View style={styles.textCol}>
              <Text
                style={[
                  styles.label,
                  {
                    color: isFuture || isCancelled && !isCurrent ? theme.muted : theme.text,
                    fontWeight: isCurrent ? '700' : '500'
                  }
                ]}
              >
                {isCancelled && isCurrent ? 'Cancelled' : step.label}
              </Text>
              {isCurrent && !isCancelled && (
                <Text style={[styles.subLabel, { color: theme.accent }]}>
                  {currentStatus === 'delivering' ? 'Courier is arriving soon' : 'In progress'}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  timelineCol: {
    alignItems: 'center',
    width: 32,
    marginRight: 12,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
    borderRadius: 1,
  },
  textCol: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 16,
  },
  label: {
    fontSize: 16,
  },
  subLabel: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
});
