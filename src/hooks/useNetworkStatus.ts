import * as Network from "expo-network";
import { useEffect, useState } from "react";

type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean;
};

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    let mounted = true;

    // Check initial state
    const checkNetwork = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (mounted) {
          setStatus({
            isConnected: state.isConnected ?? true,
            isInternetReachable: state.isInternetReachable ?? true,
          });
        }
      } catch {
        // Assume connected if check fails
      }
    };

    void checkNetwork();

    // Poll every 5 seconds (expo-network doesn't have a listener API)
    const interval = setInterval(() => void checkNetwork(), 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return status;
}
