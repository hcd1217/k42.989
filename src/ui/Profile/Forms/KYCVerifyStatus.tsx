import useSPETranslation from "@/hooks/useSPETranslation";
import authStore from "@/store/auth";
import {
  Accordion,
  Alert,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Space,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertOctagon,
  IconCheck,
  IconMapPin,
  IconNotes,
  IconProgressAlert,
} from "@tabler/icons-react";
import { ReactNode, useMemo } from "react";
import { KYCVerifyIdentityFirstForm } from "./KYCVerifyIdentityFirstForm";
import { KYCVerifyIdentityOneForm } from "./KYCVerifyIdentityOneForm";
import { KYCVerifyIdentitySecondForm } from "./KYCVerifyIdentitySecondForm";

type AccordionLabelProps = {
  id: string;
  label: string;
  image: ReactNode;
  description: string;
  isCompleted: boolean;
  isPending: boolean;
  color: string;
  icon: React.ElementType;
  content: ReactNode;
  disabled: boolean;
};

export function KYCVerifyStatus() {
  const { kycLevel, isPendingKyc, isRejectedKyc, me } = authStore();
  const t = useSPETranslation();
  const [opened, { open, close }] = useDisclosure(false);

  const statusStep = useMemo(() => {
    return (
      <>
        {isPendingKyc && (
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
            <Space my={"md"} />
          </Box>
        )}
        {isRejectedKyc && (
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
            <Space my={"md"} />
          </Box>
        )}
      </>
    );
  }, [isPendingKyc, isRejectedKyc, t]);

  const charactersList = useMemo<
    Partial<AccordionLabelProps>[]
  >(() => {
    const getItem = (kycLv: typeof kycLevel) => {
      const _isRejected = kycLevel === kycLv && isRejectedKyc;
      const _isPending = kycLevel === kycLv && isPendingKyc;
      const _isCompleted =
        parseInt(kycLevel) >= parseInt(kycLv) &&
        !_isPending &&
        !_isRejected;
      const _color = _isCompleted
        ? "green"
        : _isPending
        ? "orange"
        : _isRejected
        ? "red"
        : "gray";
      const _icon = _isCompleted
        ? IconCheck
        : _isPending
        ? IconProgressAlert
        : _isRejected
        ? IconAlertOctagon
        : undefined;
      let _disabled = parseInt(kycLv) > parseInt(kycLevel);
      if (kycLevel === "0" && kycLv === "1") {
        _disabled = false;
      }
      if (kycLevel === "1" && kycLv === "2") {
        _disabled = false;
      }
      if (kycLevel === "2" && kycLv === "3") {
        _disabled = false;
      }
      return {
        color: _color,
        icon: _icon,
        disabled: _disabled,
      };
    };
    const fullName =
      kycLevel != "0"
        ? `${me?.kycData?.firstName} ${me?.kycData?.lastName}`
        : false;
    const lv2 = {
      isRejectedKyc: kycLevel === "2" && isRejectedKyc,
      isPendingKyc: kycLevel === "2" && isPendingKyc,
      isCompleted:
        kycLevel === "2" && !isRejectedKyc && !isPendingKyc,
      showBtn:
        (kycLevel === "2" && isRejectedKyc) ||
        (kycLevel === "1" && !isPendingKyc && !isRejectedKyc),
    };
    const lv3 = {
      isRejectedKyc: kycLevel === "3" && isRejectedKyc,
      isPendingKyc: kycLevel === "3" && isPendingKyc,
      isCompleted:
        kycLevel === "3" && !isRejectedKyc && !isPendingKyc,
      showBtn:
        (kycLevel === "3" && isRejectedKyc) ||
        (kycLevel === "2" && !isPendingKyc && !isRejectedKyc),
    };
    return [
      {
        id: "1",
        image: "1",
        label: t("Personal details confirmed"),
        description: "",
        content: (
          <Box px={0}>
            <Text fz={14}>{t("Your confirmed details")}</Text>
            <Space my={"xs"} />
            {fullName && (
              <Flex gap={10}>
                <IconNotes />
                <Text>{fullName}</Text>
              </Flex>
            )}

            <Space my={"xs"} />
            {kycLevel === "0" && (
              <Button onClick={open}>{t("Complete now")}</Button>
            )}
          </Box>
        ),
        isCompleted: !isPendingKyc && kycLevel === "1",
        isPending: isPendingKyc && kycLevel === "1",
        ...getItem("1"),
      },
      {
        id: "2",
        image: "2",
        label: t("Verify identity"),
        description: "",
        content: (
          <Box px={10}>
            <Text fz={14}>
              {t("Provide a document confirm your name")}
            </Text>
            <Space my={"xs"} />
            {fullName && (
              <Flex gap={10}>
                <IconNotes />
                <Text>{fullName}</Text>
              </Flex>
            )}
            <Space my={"xs"} />
            {kycLevel === "2" && statusStep}
            <Space my={"xs"} />
            {lv2.showBtn && (
              <Button onClick={open}>{t("Complete now")}</Button>
            )}
          </Box>
        ),
        isCompleted: !isPendingKyc && kycLevel === "2",
        isPending: isPendingKyc && kycLevel === "2",
        ...getItem("2"),
      },
      {
        id: "3",
        image: "3",
        label: t("Verify residential address"),
        description: "",
        content: (
          <Box px={10}>
            <Text fz={14}>
              {t("You will need to provide proof of residence")}
            </Text>
            <Space my={"xs"} />
            {fullName && (
              <Flex gap={10}>
                <IconMapPin />
                <Text>{me?.kycData?.address}</Text>
              </Flex>
            )}
            <Space my={"xs"} />
            {kycLevel === "3" && statusStep}
            <Space my={"xs"} />
            {lv3.showBtn && (
              <Button onClick={open}>{t("Complete now")}</Button>
            )}
          </Box>
        ),
        isCompleted: !isPendingKyc && kycLevel === "3",
        isPending: isPendingKyc && kycLevel === "3",
        ...getItem("3"),
      },
    ];
  }, [
    statusStep,
    me?.kycData?.address,
    me?.kycData?.firstName,
    me?.kycData?.lastName,
    isPendingKyc,
    isRejectedKyc,
    kycLevel,
    t,
    open,
  ]);

  const titleModal = useMemo(() => {
    return {
      "0": t("KYC Information"),
      "1": t("Verify identity"),
      "2": t("Verify identity"),
      "3": t("Verify residential address"),
    }[kycLevel];
  }, [kycLevel, t]);

  const defaultStep = useMemo(() => {
    const getStep = (lv: typeof kycLevel) => {
      return lv;
    };
    return {
      "0": "1",
      "1": getStep("2"),
      "2": getStep("2"),
      "3": getStep("3"),
    }[kycLevel];
  }, [kycLevel]);

  const items = useMemo(() => {
    return charactersList.map((item) => (
      <Accordion.Item value={item.id as string} key={item.label}>
        <Accordion.Control disabled={item.disabled}>
          <Group wrap="nowrap">
            <Avatar
              radius="xl"
              size="md"
              color={item.color}
              variant="filled"
            >
              {item.icon ? <item.icon /> : item.image}
            </Avatar>
            <div>
              <Text>{item.label}</Text>
            </div>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>{item.content}</Accordion.Panel>
      </Accordion.Item>
    ));
  }, [charactersList]);

  const modalSteps = useMemo(() => {
    let s: typeof kycLevel = kycLevel;
    if (kycLevel === "2" && isRejectedKyc) {
      s = "1";
    }
    if (kycLevel === "3" && isRejectedKyc) {
      s = "2";
    }
    return s;
  }, [kycLevel, isRejectedKyc]);

  return (
    <Box>
      <Accordion
        chevronPosition="right"
        variant="contained"
        defaultValue={defaultStep}
      >
        {items}
      </Accordion>

      <Modal
        fullScreen
        opened={opened}
        onClose={close}
        styles={{
          title: {
            flex: 1,
          },
        }}
        title={titleModal}
      >
        <Box>
          {modalSteps === "0" && (
            <Box>
              <KYCVerifyIdentityFirstForm />
            </Box>
          )}
          {modalSteps === "1" && (
            <Box>
              <KYCVerifyIdentityOneForm />
            </Box>
          )}
          {modalSteps === "2" && (
            <Box>
              <KYCVerifyIdentitySecondForm />
            </Box>
          )}
          {modalSteps === "3" && (
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
      </Modal>
    </Box>
  );
}
