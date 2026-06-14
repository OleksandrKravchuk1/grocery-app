import { ProductBadge } from "@/types/product";

export function getMockBadges(productId?: number): ProductBadge[] {
  if (!productId) return [];

  const weights = ["1 kg", "500 g", "1 item", "250 g", "2 kg"];
  const times = ["15 mins", "20 mins", "30 mins", "10 mins"];
  const tags = ["Organic", "Local", "Fresh", "Premium"];

  return [
    { icon: "package", text: weights[productId % weights.length] },
    { icon: "clock", text: times[productId % times.length] },
    { icon: "shield", text: tags[productId % tags.length] },
  ];
}