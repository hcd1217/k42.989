import imgBitcoin2 from "@/assets/images/undraw_bitcoin_p2p_re_1xqa.svg";
import imgBitcoin1 from "@/assets/images/undraw_bitcoin_re_urg.svg";
import imgBitcoin3 from "@/assets/images/undraw_profile_image_re_ic2f.svg";
import AppCard, { AppCardProps } from "@/ui/Card/AppCard";
import { Carousel, CarouselProps, Embla } from "@mantine/carousel";
import { Box, Progress } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";

export default function CarouselPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  const handleScroll = useCallback(() => {
    if (!embla) {
      return;
    }
    const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [embla, setScrollProgress]);

  useEffect(() => {
    if (embla) {
      embla.on("scroll", handleScroll);
      handleScroll();
    }
  }, [embla, handleScroll]);

  const items: AppCardProps[] = [
    {
      image: imgBitcoin1,
      title:
        "European New Users Exclusive: Enjoy 0 Fees and 500% APR!",
      tags: ["UTA", "Derivatives"],
    },
    {
      image: imgBitcoin2,
      title: "Exclusive: Enjoy 0 Fees and 500% APR!",
      tags: ["Enjoy", "Fees"],
    },
    {
      image: imgBitcoin3,
      title:
        "European New Users Exclusive: Enjoy 0 Fees and 500% APR!",
      tags: ["UTA", "Derivatives"],
    },
    {
      image: imgBitcoin2,
      title: "Exclusive: Enjoy 0 Fees and 500% APR!",
      tags: ["Enjoy", "Fees"],
    },
    {
      image: imgBitcoin1,
      title:
        "European New Users Exclusive: Enjoy 0 Fees and 500% APR!",
      tags: ["UTA", "Derivatives"],
    },
    {
      image: imgBitcoin2,
      title: "Exclusive: Enjoy 0 Fees and 500% APR!",
      tags: ["Users Exclusive", "European"],
    },
  ];
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isMediumScreen = useMediaQuery(
    "(min-width: 769px) and (max-width: 1024px)",
  );

  let slideSize = "33%";
  if (isSmallScreen) {
    slideSize = "100%";
  } else if (isMediumScreen) {
    slideSize = "50%";
  }
  return (
    <>
      <Carousel
        slideSize={slideSize}
        slideGap="md"
        loop
        align="start"
        slidesToScroll={1}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        withControls
        withKeyboardEvents
        getEmblaApi={setEmbla}
        className="carouselCards"
      >
        {items.map((_, _k) => (
          <Carousel.Slide key={_k}>
            <AppCard {..._} />
          </Carousel.Slide>
        ))}
      </Carousel>
      <Progress
        value={scrollProgress}
        maw={320}
        size="sm"
        mt="xl"
        mx="auto"
      />
    </>
  );
}

export function AppCarousel(props: Partial<CarouselProps>) {
  const autoplay = useRef(Autoplay({ delay: 500000 }));

  return (
    <>
      <Box>
        <Carousel
          translate="yes"
          plugins={[autoplay.current]}
          slideSize="25%"
          align="start"
          slidesToScroll={1}
          styles={{
            container: {
              // overflow: "unset",
            },
            viewport: {
              paddingLeft: "20px",
              marginLeft: "-30px",
            },
            root: {
              // border: "solid 1px green",
              // overflow: "unset",
              // overflowX: "hidden",
              // padding: "100px",
              // width: "unset",
              // padding: "0 30px 0 0",
            },
            slide: {
              // border: "solid 1px pink",
              padding: "30px 10px",
            },
          }}
          {...props}
          className={`app-carousel ${props.className}`}
        >
          {props.children}
        </Carousel>
      </Box>
    </>
  );
}
