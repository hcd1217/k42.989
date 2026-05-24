import { Application } from "@/common/types";

const CACHE_DATA: Application = {
  "version": "1.0.0",
  "applications": {
    "name": "Crypto Copy Invest",
    "logo": {
      "pc": "/images/logo.png",
      "mobile": "/images/logo.png"
    },
    "features": {
      "register": {
        "email": true,
        "mobile": true
      },
      "symbols": []
    },
    "layout": {
      "header": {
        "common": {
          "menu": [
            {
              "type": "link",
              "label": "Spot trading",
              "url": "/trade/spot/BTC/USDT"
            },
            {
              "type": "link",
              "label": "Futures",
              "url": "/trade/futures/BTC/USDT"
            },
            {
              "type": "link",
              "label": "Copy trading",
              "url": "/copy-trading"
            },
            {
              "type": "link",
              "label": "About Us",
              "url": "/about"
            }
          ]
        }
      },
      "footer": {
        "common": {
          "copyRight": "©2024 Crypto Copy Invest. All rights reserved.",
          "privacyTerms": {
            "label": "Privacy Policy",
            "url": "/privacy-policy"
          },
          "termOfService": {
            "label": "Terms of Service",
            "url": "/terms-conditions"
          },
          "socials": [],
          "groups": [
            {
              "name": "About",
              "links": [
                {
                  "label": "Privacy Policy",
                  "url": "/privacy-policy"
                },
                {
                  "label": "Term and Conditions",
                  "url": "/terms-conditions"
                },
                {
                  "label": "Risk Disclosure",
                  "url": "/risk-disclosure"
                }
              ]
            },
            {
              "name": "Support",
              "links": [
                {
                  "label": "Contact us",
                  "url": "/inquiry"
                },
                {
                  "label": "About Us",
                  "url": "/about"
                }
              ]
            }
          ]
        }
      }
    },
    "lang": {
      "dictionaries": {
        "en": {
          "Sample": "Sample"
        },
        "ja": {
          "Sample": "サンプル"
        }
      }
    }
  }
};

export default function useSPEMetadata() {
  return { data: CACHE_DATA };
}
