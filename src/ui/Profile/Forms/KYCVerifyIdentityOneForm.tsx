import { userKycDataSchema } from "@/common/schema";
import { IS_DEV } from "@/domain/config";
import useSPETranslation from "@/hooks/useSPETranslation";
import useSPEUploader from "@/hooks/useSPEUploader";
import useSPEUserSettings from "@/hooks/useSPEUserSettings";
import authStore from "@/store/auth";
import { ImageType } from "@/types";
import { PictureUploader } from "@/ui/AvatarUploader";
import phoneCodes from "@/ui/Form/widgets/mocks/phone-code.json";
import {
  ActionIcon,
  Alert,
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  InputError,
  InputLabel,
  List,
  LoadingOverlay,
  memoize,
  Radio,
  Select,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconCheck,
  IconInfoCircle,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

type UserKycData = z.infer<typeof userKycDataSchema>;
const getImageByPhone = memoize((code: string) => {
  return phoneCodes.find((p) => p.value === code)?.image;
});
const picEx =
  "https://fastly.picsum.photos/id/38/200/300.jpg?hmac=-3xmMd1qccZR3fLPMvwj8D3GgMIIDCKTpXJspTKuZW0";
const getCountryValue = memoize((country: string) => {
  return phoneCodes.find((p) => {
    return p.value.includes(country);
  })?.value;
});

// prettier-ignore
export function KYCVerifyIdentityOneForm() {
  const t = useSPETranslation();
  const isPendingKyc = false;
  const { me } = authStore();

  const [countries] = useState(phoneCodes);
  const [_values, setValues] = useState<UserKycData>();
  const {
    uploadFile,
    setFile,
    loading: _loadingFile,
  } = useSPEUploader({
    onSuccess(file, type) {
      if (type === ImageType.KYC_DATA_LEVEL_1_FRONT) {
        form.setFieldValue("images.kycLvl1Front", file);
      }
      if (type === ImageType.KYC_DATA_LEVEL_1_BACK) {
        form.setFieldValue("images.kycLvl1Back", file);
      }
    },
  });
  const { submitKycData, loading } =
    useSPEUserSettings<UserKycData>("KYC_DATA");
  const form = useForm<UserKycData>({
    mode: "uncontrolled",
    initialValues: {
      country: isPendingKyc
        ? getCountryValue(me?.kycData?.country as string)
        : "",
      idType: isPendingKyc ? me?.kycData?.idType : undefined,
      images: {
        kycLvl1Front: isPendingKyc
          ? me?.kycData?.images?.kycLvl1Front
          : IS_DEV
            ? picEx
            : "",
        kycLvl1Back: isPendingKyc
          ? me?.kycData?.images?.kycLvl1Back
          : IS_DEV
            ? picEx
            : "",
      },
    },
    onValuesChange(values) {
      setValues(values);
    },
    validate: {
      country: (value) => {
        return value ? null : t("Please choose country");
      },
      idType: (value) => {
        return value ? null : t("Please choose document type");
      },
      images: (value) => {
        if (value?.kycLvl1Front && value?.kycLvl1Back) {
          return null;
        }
        return t("Please upload document picture");
      },
    },
  });

  const _countryInfo = useMemo(() => {
    const i = phoneCodes.find(
      (i) =>
        i.value ===
        (isPendingKyc
          ? getCountryValue(me?.kycData?.country as string)
          : _values?.country),
    );
    return {
      image: i?.image,
      country: _values?.country ?? "",
    };
  }, [_values, isPendingKyc, me?.kycData?.country]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      return;
    }
    form.setValues(me?.kycData ?? {});
    setLoaded(true);
  }, [me?.kycData, form, loaded, setLoaded]);

  return (
    <>
      <form onSubmit={(e) => submitKycData(e, form)}>
        <SimpleGrid cols={1} spacing={20}>
          <div>
            <InputLabel size="lg">
              1.{" "}
              {t(
                "Select the country/region that issued your identity document",
              )}
            </InputLabel>
            <Space my={"xs"} />
            <Box>
              <Select
                leftSection={
                  <>
                    <Avatar size={"sm"} src={_countryInfo.image} />
                  </>
                }
                placeholder={t("Country")}
                size="lg"
                searchable
                allowDeselect={false}
                data={countries.map((y) => ({
                  value: y.value,
                  label: y.country,
                  image: y.image,
                }))}
                renderOption={(item) => {
                  return (
                    <Flex
                      w={"100%"}
                      align={"center"}
                      gap={10}
                    >
                      <Avatar
                        size={"sm"}
                        src={getImageByPhone(item.option.value)}
                      />
                      <Box>
                        <Text>{item.option.label}</Text>
                      </Box>
                      <Box ml={"auto"}>
                        {item.checked && <IconCheck />}
                      </Box>
                    </Flex>
                  );
                }}
                key={form.key("country")}
                {...form.getInputProps("country")}
                disabled={isPendingKyc}
              />
            </Box>
          </div>
          <div>
            <InputLabel size="lg">
              2. {t("Select your identity document")}
            </InputLabel>
            <Radio.Group
              name="favoriteFramework"
              size="lg"
              withAsterisk
              key={form.key("idType")}
              {...form.getInputProps("idType")}
              readOnly={isPendingKyc}
            >
              <Flex gap={20} pt={10} direction={"column"}>
                {["ID", "DRIVER_LICENSE", "PASSPORT", "OTHER"].map(
                  (val, idx) => (
                    <Radio
                      key={idx}
                      value={val}
                      label={t(val)}
                      disabled={isPendingKyc}
                      styles={{
                        body: {
                          alignItems: "center",
                        },
                      }}
                    />
                  ),
                )}
              </Flex>
            </Radio.Group>
          </div>
          <div>
            <InputLabel size="lg">
              2. {t("Take photo of document")}
            </InputLabel>
            <Space my={"xs"} />
            <Alert
              variant="light"
              color="primary"
              icon={<IconInfoCircle />}
            >
              {t(
                "Make sure the document shows your photo, full name, date of birth and date of issue.",
              )}
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
            <SimpleGrid
              cols={{
                xs: 1,
                md: 2,
              }}
            >
              <div>
                {form.getValues().images?.kycLvl1Front ||
                isPendingKyc ? (
                    <Box
                      h={"300px"}
                      pos={"relative"}
                      bd={"solid 1px"}
                      py={"sm"}
                    >
                      <Image
                        mah={"100%"}
                        mx={"auto"}
                        maw={"100%"}
                        w={"auto"}
                        src={form.getValues().images?.kycLvl1Front}
                      />
                      {!isPendingKyc && (
                        <ActionIcon
                          onClick={() => {
                            form.setFieldValue(
                              "images.kycLvl1Front",
                              "",
                            );
                          }}
                          variant="transparent"
                          pos={"absolute"}
                          top={10}
                          right={10}
                        >
                          <IconTrash color="red" />
                        </ActionIcon>
                      )}
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
                              ImageType.KYC_DATA_LEVEL_1_FRONT,
                              `${Date.now()}_kyc_lvl1_front`,
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
              <div>
                {form.getValues().images?.kycLvl1Back ||
                isPendingKyc ? (
                    <Box
                      h={"300px"}
                      pos={"relative"}
                      bd={"solid 1px"}
                      py={"sm"}
                    >
                      <Image
                        mah={"100%"}
                        mx={"auto"}
                        maw={"100%"}
                        w={"auto"}
                        src={form.getValues().images?.kycLvl1Back}
                      />
                      {!isPendingKyc && (
                        <ActionIcon
                          onClick={() => {
                            form.setFieldValue(
                              "images.kycLvl1Back",
                              "",
                            );
                          }}
                          variant="transparent"
                          pos={"absolute"}
                          top={10}
                          right={10}
                        >
                          <IconTrash color="red" />
                        </ActionIcon>
                      )}
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
                              "KYC_DATA_LEVEL_1_BACK",
                              `${Date.now()}_kyc_lvl1_back`,
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
                  {t("Back of document")}
                </InputLabel>
              </div>
            </SimpleGrid>
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
