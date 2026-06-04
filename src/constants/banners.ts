import {colors} from "@/constants/colors";

export const BANNERS = [
    {
        id: 1,
        title: 'Up to 30% offer',
        subtitle: 'Enjoy our big offer',
        color: colors.mint,
        titleColor: colors.black,
        subtitleColor: colors.green,
        buttonColor: colors.green,
        image: require('@/assets/images/banner-image-1.png')
    },
    {
        id: 2,
        title: 'Up to 25% offer',
        subtitle: 'On first buyers',
        color: colors.green,
        titleColor: colors.white,
        subtitleColor: colors.white,
        buttonColor: colors.white,
        image: require('@/assets/images/banner-image-2.png')
    },
    {
        id: 3,
        title: 'Get Same day Deliver',
        subtitle: 'on orders above 20$',
        color: colors.yellow,
        titleColor: colors.black,
        subtitleColor: colors.black,
        buttonColor: colors.white,
        image: require('@/assets/images/banner-image-3.png')
    },
]