/* Status that we get from our backend endpoint */
export type DeliveryStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
}

export interface DeliveryStatusResponse {
  status: DeliveryStatus;
  location: DeliveryLocation | null;
}
