export interface Slide {
  id: string
  image: string
  alt: string
  title: string
  description: string
}

export const SLIDES: Slide[] = [
  {
    id: "pulpit-rock",
    image: "https://picsum.photos/id/1015/640/360",
    alt: "A dramatic cliff face overlooking a deep blue fjord under a partly cloudy sky",
    title: "Pulpit Rock",
    description: "A breathtaking overlook of Norway's iconic Lysefjord.",
  },
  {
    id: "everest-base-camp",
    image: "https://picsum.photos/id/1036/640/360",
    alt: "A yellow mountaineering tent pitched in thick snow with massive Himalayan peaks in the background",
    title: "Everest Base Camp",
    description: "An alpine refuge nestled beneath towering snowy massifs.",
  },
  {
    id: "uyuni-salt-flats",
    image: "https://picsum.photos/id/1056/640/360",
    alt: "A mirror-like reflection of a vast sky filled with white clouds on a thin layer of water over salt flats",
    title: "Salar de Uyuni",
    description: "Where the infinite sky meets the earth's largest salt desert.",
  },
  {
    id: "golden-gate",
    image: "https://picsum.photos/id/1061/640/360",
    alt: "The suspension towers of a historic red bridge cutting through rolling morning fog",
    title: "Golden Gate",
    description: "An engineering marvel resting quietly in the coastal mist.",
  },
  {
    id: "bamboo-forest",
    image: "https://picsum.photos/id/1063/640/360",
    alt: "Sunlight filtering through a dense grove of towering green bamboo stalks",
    title: "Arashiyama",
    description: "A serene path winding through whispering green stalks.",
  },
  {
    id: "deep-canyon",
    image: "https://picsum.photos/id/1065/640/360",
    alt: "Layered red rock canyon walls plunging into a river carved valley at sunset",
    title: "Grand Canyon",
    description: "Millions of years of geological history carved by a single river.",
  },
]
