import useSPETranslation from "@/hooks/useSPETranslation";
import authStore from "@/store/auth";
import { KYCVerifyIdentityFirstForm } from "@/ui/Profile";
import { KYCVerifyIdentityOneForm } from "@/ui/Profile/Forms/KYCVerifyIdentityOneForm";
import { KYCVerifyIdentitySecondForm } from "@/ui/Profile/Forms/KYCVerifyIdentitySecondForm";
import {
  Alert,
  Anchor,
  Box,
  Breadcrumbs,
  Card,
  Container,
  Text,
} from "@mantine/core";
import {
  IconChevronRight,
  IconProgressAlert,
} from "@tabler/icons-react";

// TODO: rename this component to match the file name
export default function Page() {
  const t = useSPETranslation();
  const { kycLevel, isPendingKyc, isRejectedKyc } = authStore();

  return (
    <>
      <Container>
        {/* {location.pathname} */}
        <Breadcrumbs
          my={20}
          separator={<IconChevronRight color="gray" size={14} />}
        >
          <Anchor fz={16} fw={400} href="/user">
            {t("My Account")}
          </Anchor>
          <Anchor fz={16} fw={400}>
            {t("KYC Verification")}
          </Anchor>
        </Breadcrumbs>
        <Card
          p={"32px"}
          shadow="0 0 24px 0 rgba(18,18,20,.1)"
          padding="xs"
          radius="25px"
          maw={"700px"}
          w={"100%"}
          mx={"auto"}
        >
          {isPendingKyc ? (
            <Box>
              <Alert
                icon={<IconProgressAlert />}
                title={t(
                  "Your KYC Verification is in Progress: Please Wait for Approval",
                )}
              >
                <Text>
                  {t(
                    "Your KYC verification is currently under review. Please wait for the approval of your documents. If you need assistance, contact support for further guidance.",
                  )}
                </Text>
              </Alert>
            </Box>
          ) : isRejectedKyc ? (
            <Box>
              <Alert
                c={"red"}
                icon={<IconProgressAlert />}
                title={t(
                  "KYC Verification Rejected: Action Required to Resubmit Your Information",
                )}
              >
                <Text>
                  {t(
                    "Unfortunately, your KYC verification has been rejected due to discrepancies in the provided information. Please review your details and resubmit the required documents to proceed with the verification process. If you need assistance, contact support for further guidance.",
                  )}
                </Text>
              </Alert>
            </Box>
          ) : (
            <Box>
              {kycLevel === "0" && (
                <Box>
                  <KYCVerifyIdentityFirstForm />
                </Box>
              )}
              {kycLevel === "1" && (
                <Box>
                  <KYCVerifyIdentityOneForm />
                </Box>
              )}
              {kycLevel === "2" && (
                <Box>
                  <KYCVerifyIdentitySecondForm />
                </Box>
              )}
              {kycLevel === "3" && (
                <Box>
                  <Alert
                    c={"green"}
                    icon={<IconProgressAlert />}
                    title={t(
                      "Congratulations! Your KYC Verification is Complete",
                    )}
                  >
                    <Text>
                      {t(
                        "Thank you for completing the KYC verification process. Your account is now fully verified and you can proceed with trading on the platform.",
                      )}
                    </Text>
                  </Alert>
                </Box>
              )}
            </Box>
          )}
        </Card>
      </Container>
    </>
  );
}
