import { BANNERS } from "@/src/constants/banners";
import { BannerCard } from "@/src/features/banners/components/BannerCard";
import { FlatList } from "react-native";

export function BannerList() {
  return (
    <FlatList
      data={BANNERS}
      horizontal={true}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <BannerCard
          title={item.title}
          subtitle={item.subtitle}
          color={item.color}
          titleColor={item.titleColor}
          subtitleColor={item.subtitleColor}
          buttonColor={item.buttonColor}
          image={item.image}
        />
      )}
    />
  );
};
