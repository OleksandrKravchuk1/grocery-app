export const RESTAURANT_COORD = { latitude: 50.4501, longitude: 30.5234 };
export const DEFAULT_USER_COORD = { latitude: 50.4550, longitude: 30.5300 };

export const STEPS = [
  { id: 'pending', aliases: ['pending'], label: 'Order placed' },
  { id: 'processing', aliases: ['processing'], label: 'Preparing' },
  { id: 'shipped', aliases: ['shipped', 'delivering'], label: 'On the way' },
  { id: 'delivered', aliases: ['delivered', 'completed'], label: 'Delivered' },
];