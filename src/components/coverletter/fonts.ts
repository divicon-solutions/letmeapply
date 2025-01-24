import { Font } from "@react-pdf/renderer";

// Import the font file
import ArialFont from "@/app/fonts/Arial.woff";

// Register the font
Font.register({
  family: "Arial",
  src: ArialFont,
});

export const fonts = {
  arial: "Arial",
};
