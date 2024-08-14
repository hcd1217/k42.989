import useSPETranslation from "@/hooks/useSPETranslation";
import { Container, Image, Space } from "@mantine/core";
import ServiceWrapper from "..";
import DetailImg from "../image/detail.png";
import HomePageImg from "../image/home.png";
import PromoterReferralLinkOtherImg from "../image/promoter-referral-link-other.png";
import PromoterReferralLinkImg from "../image/promoter-referral-link.png";
import ViewMoreImg from "../image/view-more.png";
import "../style.module.scss";

// cspell:ignore Luhansk

export default function CopyTradingReferrals() {
  const t = useSPETranslation();

  return (
    <Container>
      <ServiceWrapper />
      <Space my={"xl"} />
      <h1>Beginners Guide for Copy Trading Referrals</h1>
      <p>
        Crypto Copy Invest Copy Trading offers a simple and
        transparent way for users to copy excellent strategies. Novice
        traders can choose a suitable strategy from veteran traders,
        building a mutually beneficial relationship.
      </p>
      <p>
        By copy trading, you synchronize your trades with those of
        copied traders to obtain higher yields, while the copied
        traders will earn a share of your profits.
      </p>
      <h2>
        How to Start Copy Trading on Crypto Copy Invest (for
        Referrals)
      </h2>
      <p>
        This guide to futures copy trading will help you start your
        copy trading journey on Crypto Copy Invest.
      </p>
      <p>
        <span> Step 1:</span> Click <span>Copy Trading </span>in the
        upper navigation bar to enter the Copy Trading page.
      </p>
      <Image src={HomePageImg} alt="Copy Trade" />
      <p>
        <span> Step 2: </span>Choose the trader you want to share, and
        click <span>Copy</span>
      </p>
      <Image src={PromoterReferralLinkImg} />
      <p>
        <span>Step 3:</span> You get the referral link of the master
        and can share it with others, and others can directly enter
        the website through the referral link you share to set up copy
        trading settings
      </p>
      <p>
        <span> Note:</span>{" "}
        {t(
          "Everyone's referral link is different, others should set up copy trading settings in the referral link you share, so that you can have the promoter profit share",
        )}
      </p>
      <Image src={PromoterReferralLinkOtherImg} />
      <p>
        <span> Step 4:</span> You can click <span>More</span> to see
        more details , and click<span> My Referrals</span>, Here you
        can see the Referral link you shared and promoter profit share
      </p>
      {/* TODO: image */}
      <Image src={ViewMoreImg} />
      <Image src={DetailImg} />
      <Space my={"xl"} />
    </Container>
  );
}
