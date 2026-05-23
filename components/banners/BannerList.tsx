import {FlatList} from "react-native";
import {BANNERS} from "@/constants/banners";
import BannerCard from "@/components/banners/BannerCard";

const BannerList = () => {
    return (
        <FlatList
            data={BANNERS}
            horizontal={true}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
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

export default BannerList;