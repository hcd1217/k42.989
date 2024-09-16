import { userKycDataSchema } from "@/common/schema";
import useSPETranslation from "@/hooks/useSPETranslation";
import useSPEUserSettings from "@/hooks/useSPEUserSettings";
import { Language } from "@/services/languages";
import authStore from "@/store/auth";
import {
  Button,
  Flex,
  InputError,
  InputLabel,
  Radio,
  Select,
  SimpleGrid,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck } from "@tabler/icons-react";
import { useMemo } from "react";
import { z } from "zod";

// type GenderType = "MALE" | "FEMALE";
const years = Array.from(
  { length: 2024 - 1970 + 1 },
  (_, idx) => 1970 + idx,
);
const dates = Array.from({ length: 31 }, (_, idx) => idx + 1);
// const monthsEn = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];
// const monthsJa = [
//   "1月",
//   "2月",
//   "3月",
//   "4月",
//   "5月",
//   "6月",
//   "7月",
//   "8月",
//   "9月",
//   "10月",
//   "11月",
//   "12月",
// ];

type UserKycData = z.infer<typeof userKycDataSchema> & {
  date?: string;
  month?: string;
  year?: string;
};

export function KYCVerifyIdentityFirstForm() {
  const { isPendingKyc } = authStore();

  const { loading, submitKycData } =
    useSPEUserSettings<UserKycData>("KYC_DATA");
  const form = useForm<UserKycData>({
    mode: "uncontrolled",
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      date: "",
      month: "",
      year: "",
    },
    onValuesChange(values) {
      if (values.date && values.month && values.year) {
        form.setFieldValue(
          "dateOfBirth",
          [
            values.year,
            values.month?.replace("月", "").padStart(2, "0") || "",
            values.date?.padStart(2, "0") || "",
          ].join("/"),
        );
      } else {
        form.setFieldValue("dateOfBirth", "");
      }
    },
    validate: {
      firstName: (value) => {
        return value ? null : t("Required");
      },
      lastName: (value) => {
        return value ? null : t("Required");
      },
      address: (value) => {
        return value ? null : t("Required");
      },
      gender: (value) => {
        return value ? null : t("Required");
      },
      dateOfBirth: (value) => {
        return value ? null : t("Required");
      },
    },
  });
  const t = useSPETranslation();
  const activeMonths = useMemo(() => {
    const lang = localStorage.__LANGUAGE__;
    if (lang === Language.EN) {
      return Array.from({ length: 12 }, (_, idx) => idx + 1);
    }
    return Array.from({ length: 12 }, (_, idx) => idx + 1);
  }, []);

  return (
    <>
      <Space mb={"lg"} />
      <form onSubmit={(e) => submitKycData(e, form)}>
        <SimpleGrid cols={1} spacing={20}>
          <TextInput
            withAsterisk
            label={t("First Name")}
            description={t(
              "Your first name as it appears on your ID",
            )}
            key={form.key("firstName")}
            {...form.getInputProps("firstName")}
            disabled={isPendingKyc}
          />
          <TextInput
            key={form.key("lastName")}
            {...form.getInputProps("lastName")}
            withAsterisk
            label={t("Last Name")}
            description={t("Your last name as it appears on your ID")}
            disabled={isPendingKyc}
          />
          <div>
            <Radio.Group
              name="favoriteFramework"
              label={t("Your gender")}
              size="lg"
              key={form.key("gender")}
              withAsterisk
              {...form.getInputProps("gender")}
            >
              <Flex gap={20} pt={10}>
                <Radio
                  value="MALE"
                  label={t("Male")}
                  styles={{
                    body: {
                      alignItems: "center",
                    },
                  }}
                  disabled={isPendingKyc}
                />
                <Radio
                  value="FEMALE"
                  label={t("Female")}
                  styles={{
                    body: {
                      alignItems: "center",
                    },
                  }}
                  disabled={isPendingKyc}
                />
              </Flex>
            </Radio.Group>
          </div>
          <div>
            <InputLabel size="lg">{t("Date of Birth")}</InputLabel>
            <Flex gap={10}>
              <Select
                placeholder={t("Day")}
                searchable
                defaultChecked
                allowDeselect={false}
                data={dates.map((y) => y.toString())}
                key={form.key("date")}
                {...form.getInputProps("date")}
                renderOption={(item) => {
                  return (
                    <Flex
                      w={"100%"}
                      justify={"space-between"}
                      align={"center"}
                    >
                      <Text>{item.option.label}</Text>
                      {item.checked && <IconCheck />}
                    </Flex>
                  );
                }}
                disabled={isPendingKyc}
              />
              <Select
                placeholder={t("Month")}
                searchable
                defaultChecked
                allowDeselect={false}
                data={activeMonths.map((y) => y.toString())}
                renderOption={(item) => {
                  return (
                    <Flex
                      w={"100%"}
                      justify={"space-between"}
                      align={"center"}
                    >
                      <Text>{item.option.label}</Text>
                      {item.checked && <IconCheck />}
                    </Flex>
                  );
                }}
                key={form.key("month")}
                {...form.getInputProps("month")}
                disabled={isPendingKyc}
              />
              <Select
                placeholder={t("Year")}
                searchable
                defaultChecked
                allowDeselect={false}
                data={years.map((y) => y.toString())}
                renderOption={(item) => {
                  return (
                    <Flex
                      w={"100%"}
                      justify={"space-between"}
                      align={"center"}
                    >
                      <Text>{item.option.label}</Text>
                      {item.checked && <IconCheck />}
                    </Flex>
                  );
                }}
                key={form.key("year")}
                {...form.getInputProps("year")}
                disabled={isPendingKyc}
              />
            </Flex>
            <InputError size="lg">
              {form.errors["dateOfBirth"]}
            </InputError>
          </div>
          <TextInput
            key={form.key("address")}
            {...form.getInputProps("address")}
            withAsterisk
            label={t("Residential address")}
            disabled={isPendingKyc}
          />
          <Button
            disabled={loading || isPendingKyc}
            loading={loading}
            type="submit"
            size="lg"
            gradient={{ from: "primary", to: "yellow", deg: 90 }}
          >
            {t("Confirm")}
          </Button>
        </SimpleGrid>
      </form>
    </>
  );
}
