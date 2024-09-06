import { userKycDataSchema } from "@/common/schema";
import useSPETranslation from "@/hooks/useSPETranslation";
import useSPEUserSettings from "@/hooks/useSPEUserSettings";
import { PictureUploader } from "@/ui/AvatarUploader";
import { requiredFieldValidate } from "@/utils/validates";
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
  Title,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconCheck,
  IconInfoCircle,
  IconTrash,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import phoneCodes from "@/ui/Form/widgets/mocks/phone-code.json";
import useUploader from "@/hooks/useUploader";

type UserKycData = z.infer<typeof userKycDataSchema>;
const getImageByPhone = memoize((code: string) => {
  return phoneCodes.find((p) => p.value === code)?.image;
});
export function KYCVerifyIdentityOneForm() {
  const t = useSPETranslation();
  const [countries] = useState(phoneCodes);
  const [_values, setValues] = useState<UserKycData>();
  const {
    uploadFile,
    setFile,
    loading: _loadingFile,
  } = useUploader({
    onSuccess(file, type) {
      if (type === "KYC_DATA_LEVEL_1_FRONT") {
        form.setFieldValue("images.kycLvl1Front", file);
      }
      if (type === "KYC_DATA_LEVEL_1_BACK") {
        form.setFieldValue("images.kycLvl1Back", file);
      }
    },
  });
  const { submit, loading } =
    useSPEUserSettings<UserKycData>("KYC_DATA");
  const form = useForm<UserKycData>({
    mode: "uncontrolled",
    initialValues: {
      country: "",
      idType: undefined,
      images: {
        kycLvl1Front: "",
        kycLvl1Back: "",
      },
    },
    onValuesChange(values) {
      setValues(values);
    },
    validate: {
      country: (value) => {
        try {
          requiredFieldValidate().parse(value);
          return null;
        } catch (error: unknown) {
          return t("Please choose country");
        }
      },
      idType: (value) => {
        try {
          requiredFieldValidate().parse(value);
          return null;
        } catch (error: unknown) {
          return t("Please choose document type");
        }
      },
      images: (value) => {
        try {
          requiredFieldValidate().parse(value?.kycLvl1Front);
          requiredFieldValidate().parse(value?.kycLvl1Back);
          return null;
        } catch (error: unknown) {
          return t("Please upload document picture");
        }
      },
    },
  });

  const values = useMemo(() => {
    const _v = form.getValues();
    const formData = {
      ..._v,
    };
    return formData;
  }, [form]);

  const _countryInfo = useMemo(() => {
    const i = phoneCodes.find((i) => i.value === _values?.country);
    return {
      image: i?.image,
      country: _values?.country ?? "",
    };
  }, [_values]);

  const _labelDoc = useMemo(() => {
    return `${t("3. Take photo of ")} ${_values?.idType ?? ""} ${t(
      " document",
    )}`;
  }, [t, _values]);

  return (
    <>
      <Title order={2}>{t("Verify identity")}</Title>
      <Space mb={"lg"} />

      <form onSubmit={(e) => submit(e, form, values)}>
        <SimpleGrid cols={1} spacing={20}>
          <div>
            <InputLabel size="lg">
              {t(
                "1. Select the country/region that issued your identity document",
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
                    <Flex w={"100%"} align={"center"} gap={10}>
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
              />
            </Box>
          </div>
          <div>
            <InputLabel size="lg">
              {t("2. Select your identity document")}
            </InputLabel>
            <Radio.Group
              name="favoriteFramework"
              size="lg"
              withAsterisk
              key={form.key("idType")}
              {...form.getInputProps("idType")}
            >
              <Flex gap={20} pt={10} direction={"column"}>
                {["ID", "DRIVER_LICENSE", "PASSPORT", "OTHER"].map(
                  (val, idx) => (
                    <Radio
                      key={idx}
                      value={val}
                      label={val}
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
            <InputLabel size="lg">{_labelDoc}</InputLabel>
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
                  Do
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
                {form.getValues().images?.kycLvl1Front ? (
                  <Box h={"300px"} pos={"relative"}>
                    <Image
                      mah={"100%"}
                      mx={"auto"}
                      maw={"100%"}
                      src={form.getValues().images?.kycLvl1Front}
                    />
                    <ActionIcon
                      onClick={() => {
                        form.setFieldValue("images.kycLvl1Front", "");
                      }}
                      variant="transparent"
                      pos={"absolute"}
                      top={10}
                      right={10}
                    >
                      <IconTrash color="red" />
                    </ActionIcon>
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
                          // setPreview(reader.result as string);
                          uploadFile(
                            files[0],
                            "KYC_DATA_LEVEL_1_FRONT",
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
                {form.getValues().images?.kycLvl1Back ? (
                  <Box h={"300px"} pos={"relative"}>
                    <Image
                      mah={"100%"}
                      mx={"auto"}
                      maw={"100%"}
                      src={form.getValues().images?.kycLvl1Back}
                    />
                    <ActionIcon
                      onClick={() => {
                        form.setFieldValue("images.kycLvl1Back", "");
                      }}
                      variant="transparent"
                      pos={"absolute"}
                      top={10}
                      right={10}
                    >
                      <IconTrash color="red" />
                    </ActionIcon>
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
                          // setPreview(reader.result as string);
                          uploadFile(
                            files[0],
                            "KYC_DATA_LEVEL_1_BACK",
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
            disabled={loading}
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
