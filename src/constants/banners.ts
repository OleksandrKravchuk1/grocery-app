import { palette } from "@/src/constants/colors";

export const BANNERS = [
  {
    id: 1,
    title: 'Up to 30% offer',
    subtitle: 'Enjoy our big offer',
    color: palette.mint,
    titleColor: palette.black,
    subtitleColor: palette.green,
    buttonColor: palette.green,
    image: require('@/assets/images/banner-image-1.png')
  },
  {
    id: 2,
    title: 'Up to 25% offer',
    subtitle: 'On first buyers',
    color: palette.green,
    titleColor: palette.white,
    subtitleColor: palette.white,
    buttonColor: palette.white,
    image: require('@/assets/images/banner-image-2.png')
  },
  {
    id: 3,
    title: 'Get Same day Deliver',
    subtitle: 'on orders above 20$',
    color: palette.yellow,
    titleColor: palette.black,
    subtitleColor: palette.black,
    buttonColor: palette.white,
    image: require('@/assets/images/banner-image-3.png')
  },
]