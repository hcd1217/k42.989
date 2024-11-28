import BRAND from "@/brands";
import { Helmet, HelmetData } from "react-helmet-async";

type HeadProps = {
  title?: string;
  description?: string;
};

const helmetData = new HelmetData({});

export const Head = ({
  title = "",
  description = "",
}: HeadProps = {}) => {
  return (
    <Helmet
      helmetData={helmetData}
      title={
        title ? `${title} | ${BRAND.configs.APP_NAME}` : undefined
      }
      defaultTitle={BRAND.configs.APP_NAME}
    >
      <meta name="description" content={description} />
    </Helmet>
  );
};
