import { GenericObject } from "@/common/types";
import useSPETranslation from "@/hooks/useSPETranslation";
import axios from "@/services/apis";
import logger from "@/services/logger";
import { SPEResponse } from "@/types";
import { ONE_MINUTE } from "@/utils";
import { error, success } from "@/utils/notifications";
import { Box, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import MonacoEditor from "@monaco-editor/react";
import Form, { FormProps, IChangeEvent } from "@rjsf/core";
import { RJSFSchema, RegistryWidgetsType } from "@rjsf/utils";
import { customizeValidator } from "@rjsf/validator-ajv8";
import Ajv2020 from "ajv/dist/2020.js";
import { cloneDeep, set } from "lodash";
import React, {
  FormEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as fields from "./fields";
import * as templates from "./templates";
import * as widgets from "./widgets";

const toJson = (val: unknown) => JSON.stringify(val, null, 2);
const AJV8_2020 = customizeValidator({ AjvClass: Ajv2020 });
const customWidgets: RegistryWidgetsType = { ...widgets };

const isDev = ["localhost", "127.0.0.1", "0.0.0.0"].includes(
  window.location.hostname,
);

const test = isDev && false;

type OmittedForm = Omit<FormProps, "formData" | "validator">;

type AppFormProps = OmittedForm & {
  w?: number | string;
  api?: string;
  formData: GenericObject;
  onSuccess?: (res: any) => void; // eslint-disable-line
  formDataConverter?: (res: any) => any; // eslint-disable-line
  xFlag?: boolean;
  msgSuccess?: string;
  showJsonOutput?: boolean;
  messages?: {
    titleSuccess?: string;
    msgSuccess?: string;
    titleError?: string;
    msgError?: string;
  };
};

// TODO: refactor typed of this component
// eslint-disable-next-line react/display-name
const AppForm = forwardRef(
  (
    { xFlag = false, showJsonOutput = false, ...props }: AppFormProps,
    ref,
  ) => {
    const t = useSPETranslation();
    const [visible, { toggle, close }] = useDisclosure(false);
    const [counter, setCounter] = useState(0);
    const [schema, setSchema] = useState<RJSFSchema>(props.schema);
    const [uiSchema, setUiSchema] = useState(props.uiSchema);
    const [paused, setPause] = useState(0);
    const [formData, updateFormData] = useState(
      cloneDeep(props.formData),
    );

    const formRef = useRef<React.ElementRef<typeof Form>>(null);

    const onFormDataSubmit = useCallback(
      (evt: IChangeEvent, event: FormEvent<unknown>) => {
        logger.trace("submitted formData", evt.formData);
        logger.trace("submit event", event);
        logger.trace("submitting form data", evt.formData, props.api);
        if (props.api) {
          const rawData = { ...evt.formData };
          const params =
            props.formDataConverter?.(rawData) ?? rawData;
          toggle();
          axios
            .post<SPEResponse>(props.api, params)
            .then((res) => {
              if (res.data.code === 0) {
                props.onSuccess?.(res.data.result);
                success(
                  props.messages?.titleSuccess ??
                    t("The form was submitted successfully."),
                  props.messages?.msgSuccess ??
                    t("The action was success"),
                );
              } else {
                // Error handling
                error(
                  props.messages?.titleError ??
                    t("Something went wrong"),
                  res.data.message ?? props.messages?.msgError,
                );
              }
            })
            .finally(() => {
              close();
            });
        } else {
          close();
        }
      },
      [close, props, t, toggle],
    );

    const onFormDataChange = useCallback(
      (props: IChangeEvent, id?: string) => {
        if (paused > Date.now()) {
          return;
        }
        id && logger.trace("Field changed, id: ", id, props);
        // logger.trace(
        //   "1 formData updated (onFormDataChange)",
        //   props.formData,
        // );
        updateFormData(props.formData);
      },
      [paused],
    );

    // TODO: remove XFlag
    const updateFields = useCallback(
      (updated: Record<string, unknown>) => {
        xFlag && setPause(Date.now() + ONE_MINUTE);
        updateFormData((prevFormData: unknown) => {
          let d = cloneDeep(prevFormData) as GenericObject;
          Object.entries(updated).forEach(([field, value]) => {
            d = set(d, field, value);
          });
          return { ...d };
        });
        if (xFlag) {
          setPause(0);
          setCounter((prev) => prev + 1);
        }
      },
      [xFlag],
    );

    useImperativeHandle(
      ref,
      () => {
        return {
          formRef,
          toggle,
          close,
          setSchema,
          setUiSchema,
          submit: formRef.current?.submit,
          setFormData: updateFormData,
        };
      },
      [close, toggle],
    );

    return (
      <>
        <Box w={props.w ?? 500} pos="relative">
          <Form
            disabled={paused > 0}
            key={counter}
            ref={formRef}
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            validator={AJV8_2020}
            fields={{ ...fields }}
            widgets={customWidgets}
            templates={{
              ButtonTemplates: {
                SubmitButton: templates.SubmitButton,
              },
              ...templates,
            }}
            showErrorList={false}
            extraErrorsBlockSubmit={false}
            extraErrors={{}}
            onChange={onFormDataChange}
            onSubmit={props.onSubmit ?? onFormDataSubmit}
            formContext={{
              formData,
              updateFields,
              updateFormData,
              updateField: (field: string, value: unknown) => {
                updateFields({ [field]: value });
              },
              submit: () => {
                formRef.current?.submit();
              },
            }}
          />
          <LoadingOverlay
            visible={visible}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        </Box>
        {showJsonOutput && test && <JsonForm formData={formData} />}
      </>
    );
  },
);

export default AppForm;

function JsonForm({ formData }: { formData: GenericObject }) {
  return (
    <Box h={"300px"} mt={10}>
      <MonacoEditor
        language="json"
        value={toJson(formData)}
        theme="vs-dark"
        options={{
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          formatOnType: true,
          formatOnPaste: true,
        }}
      />
    </Box>
  );
}
