// Registro mínimo (2 herramientas demo)
import ColorSharpen from "../../tools/color-sharpen/Tool";
import colorSharpenMeta from "../../tools/color-sharpen/meta";

import VideoConverter from "../../tools/video-converter/Tool";
import vidConvMeta from "../../tools/video-converter/meta";

const tools = [
  { slug: colorSharpenMeta.slug, name: colorSharpenMeta.name, description: colorSharpenMeta.description, component: ColorSharpen },
  { slug: vidConvMeta.slug, name: vidConvMeta.name, description: vidConvMeta.description, component: VideoConverter },
];
export default tools;
