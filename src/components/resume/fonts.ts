import { Font } from "@react-pdf/renderer";

// Import font files
import CrimsonRegular from "../../assets/fonts/CrimsonText-Regular.ttf";
import CrimsonBold from "../../assets/fonts/CrimsonText-Bold.ttf";

// Register the font
Font.register({
  family: "CrimsonText",
  fonts: [
    {
      src: CrimsonRegular,
      fontWeight: 400
    },
    {
      src: CrimsonBold,
      fontWeight: 700
    }
  ]
});

export const fonts = {
  crimsonText: "CrimsonText",
  crimsonTextBold: "CrimsonText"
};
