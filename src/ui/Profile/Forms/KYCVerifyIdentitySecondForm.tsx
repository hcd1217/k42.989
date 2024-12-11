import { userKycDataSchema } from "@/common/schema";
import { IS_DEV } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import useSPEUploader from "@/hooks/useSPEUploader";
import useSPEUserSettings from "@/hooks/useSPEUserSettings";
import { PictureUploader } from "@/ui/AvatarUploader";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Image,
  InputError,
  InputLabel,
  List,
  LoadingOverlay,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconInfoCircle,
  IconProgressCheck,
  IconTrash,
} from "@tabler/icons-react";
import { z } from "zod";
import { MsgNoticeCapture } from "./MsgNoticeCapture";
const picEx =
  "https://fastly.picsum.photos/id/38/200/300.jpg?hmac=-3xmMd1qccZR3fLPMvwj8D3GgMIIDCKTpXJspTKuZW0";
type UserKycData = z.infer<typeof userKycDataSchema>;

export function KYCVerifyIdentitySecondForm() {
  // const { isPendingKyc } = authStore();
  const isPendingKyc = false;
  const t = useSPETranslation();
  const {
    uploadFile,
    setFile,
    loading: _loadingFile,
  } = useSPEUploader({
    onSuccess(file, type) {
      if (type === "KYC_DATA_LEVEL_2") {
        form.setFieldValue("images.kycLvl2", file);
      }
    },
  });
  const { submitKycData, loading } =
    useSPEUserSettings<UserKycData>("KYC_DATA");
  const form = useForm<UserKycData>({
    mode: "uncontrolled",
    initialValues: {
      images: {
        kycLvl2: IS_DEV ? picEx : "",
      },
    },
    validate: {
      images: (value) => {
        return value?.kycLvl2
          ? null
          : t("Please upload document picture");
      },
    },
  });

  return (
    <>
      <Box>
        <Alert
          icon={<IconProgressCheck />}
          title={t(
            "KYC Level 1 Verified Successfully: Please Provide Additional Documents for Address Verification",
          )}
        >
          <Text>
            {t(
              "Congratulations! Your KYC Level 1 has been successfully verified. To complete the full verification process, please upload documents to verify your residential address. This step is required to finalize your KYC.",
            )}
          </Text>
        </Alert>
      </Box>
      <Space mb={"lg"} />
      <form onSubmit={(e) => submitKycData(e, form)}>
        <SimpleGrid cols={1} spacing={20}>
          <div>
            <Space my={"xs"} />
            <Alert
              variant="light"
              color="primary"
              icon={<IconInfoCircle />}
              pb={4}
            >
              <Text>
                {t(
                  "Make sure the document shows your photo, full name, date of birth and date of issue.",
                )}
              </Text>
            </Alert>
            <Alert
              variant="light"
              color="primary"
              icon={<IconInfoCircle />}
              pt={0}
            >
              <Text style={{ whiteSpace: "pre-line" }}>
                {t(
                  "Address verification documents\n・Resident registration card\n・Utility bills [electricity, water, gas]\n・Credit card statement",
                )}
              </Text>
              <Text mt={4}>
                <span>{t("*")} </span>
                {t("Date of issue must be within the last 3 months")}
              </Text>
            </Alert>
            <Space my={"xs"} />
            <SimpleGrid
              cols={{
                xs: 1,
                md: 2,
              }}
            >
              <div>
                <Text c={"green"} fw={"bold"}>
                  {t("Do")}
                </Text>
                <List>
                  <List.Item>
                    <Text fz={14}>
                      {t("Photo is clear and sharp")}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text fz={14}>
                      {t("Details can be read clearly")}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text fz={14}>
                      {t("High or good photo quality")}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text fz={14}>
                      {t("All 4 comers of the document are visible")}
                    </Text>
                  </List.Item>
                </List>
              </div>
              <div>
                <Text c={"red"} fw={"bold"}>
                  {t("Don't")}
                </Text>
                <List>
                  <List.Item>
                    <Text fz={14}>
                      {t("Photo is blurry and not focused")}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text fz={14}>
                      {t("Details cannot be read clearly")}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text fz={14}>
                      {t("Poor photo quality (too dark or bright)")}
                    </Text>
                  </List.Item>
                  <List.Item>
                    <Text fz={14}>
                      {t("Not all corners are visible")}
                    </Text>
                  </List.Item>
                </List>
              </div>
            </SimpleGrid>
          </div>
          <Box pos={"relative"}>
            <LoadingOverlay
              visible={_loadingFile}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            <div>
              <Box mb={"lg"}>
                <MsgNoticeCapture />
              </Box>
              {form.getValues().images?.kycLvl2 || isPendingKyc ? (
                <Box
                  h={"300px"}
                  pos={"relative"}
                  bd={"solid 1px"}
                  py={"sm"}
                >
                  {!isPendingKyc && (
                    <ActionIcon
                      onClick={() => {
                        form.setFieldValue("images.kycLvl2Front", "");
                      }}
                      variant="transparent"
                      pos={"absolute"}
                      top={10}
                      right={10}
                    >
                      <IconTrash color="red" />
                    </ActionIcon>
                  )}
                  <Image
                    mah={"100%"}
                    mx={"auto"}
                    maw={"100%"}
                    w={"auto"}
                    src={form.getValues().images?.kycLvl2}
                  />
                </Box>
              ) : (
                <Box>
                  <PictureUploader
                    multiple={false}
                    h={"300px"}
                    title={t("Upload Avatar")}
                    onDrop={(files: FileWithPath[]) => {
                      setFile(files[0]);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        uploadFile(
                          files[0],
                          "KYC_DATA_LEVEL_2",
                          `${Date.now()}_kyc_lvl2`,
                        );
                      };
                      reader.readAsDataURL(files[0]);
                    }}
                  />
                </Box>
              )}
              <InputLabel
                w={"100%"}
                c={"dimmed"}
                ta={"center"}
                fw={"bold"}
                required
              >
                {t("Front of document")}
              </InputLabel>
            </div>
          </Box>
          <InputError size="lg">{form.errors["images"]}</InputError>
          <Button
            disabled={loading || isPendingKyc}
            loading={loading}
            type="submit"
            size="lg"
            gradient={{ from: "primary", to: "yellow", deg: 90 }}
          >
            {t("Submit document")}
          </Button>
        </SimpleGrid>
      </form>
    </>
  );
}
