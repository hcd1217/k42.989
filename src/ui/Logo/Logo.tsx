// import svgLogo from "@/assets/images/logo.svg";
// import svgLogo from "@/assets/images/logo.svg";
// import svgLogoLight from "@/assets/images/logo_light.svg";
import svgLogo from "@/assets/images/logo/logo-dark-horizontal.svg";
import svgLogoLight from "@/assets/images/logo/logo-light-horizontal.svg";

import { Image } from "@mantine/core";

export function AppLogo() {
  return (
    <>
      <Image darkHidden src={svgLogoLight} width={200} />
      <Image lightHidden src={svgLogo} w={200} />
    </>
  );
}

export function AppLogoVertical() {
  return (
    <>
      <Image darkHidden src={svgLogoLight} />
      <Image lightHidden src={svgLogo} />
    </>
  );
}

export { svgLogo, svgLogoLight };
