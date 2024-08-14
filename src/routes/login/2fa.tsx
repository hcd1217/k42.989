import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Stack,
  Grid,
  TextInput,
  InputProps,
} from "@mantine/core";
import classes from "./login.module.scss";

export default function MfaModal({
  onSubmit,
}: {
  onSubmit: (code: string) => void;
}) {
  const [codes, setCode] = useState<(number | undefined)[]>(
    Array(6).fill(undefined),
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const inputs = document.querySelectorAll("input[data-autofocus]");
    inputs.forEach((input) => (input as HTMLInputElement).focus());
  }, [index]);

  const handleSubmit = useCallback(() => {
    onSubmit(codes.join(""));
  }, [codes, onSubmit]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        event.key === "Backspace" &&
        index > 0 &&
        !event.currentTarget.value
      ) {
        setIndex((state) => state - 1);
      }

      if (event.key === "ArrowLeft" && index > 0) {
        setIndex((state) => state - 1);
      }
      if (event.key === "ArrowRight" && index < 5) {
        setIndex((state) => state + 1);
      }

      if (event.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit, index],
  );

  const onChange = useCallback(
    (value: number | undefined, idx: number) => {
      const newCode = [...codes];
      newCode[idx] = value || undefined;
      setCode(newCode);
      if (value !== undefined && idx < 5) {
        setIndex(idx + 1);
      }
    },
    [codes],
  );

  return (
    <Stack>
      <Grid>
        {codes.map((code, idx) => (
          <Grid.Col span={2} key={idx}>
            <Input
              active={index === idx ? "true" : undefined}
              defaultValue={code}
              onKeyDown={(event) => handleKeyDown(event)}
              onChange={(value) => onChange(value, idx)}
            />
          </Grid.Col>
        ))}
      </Grid>
      <Button onClick={handleSubmit}>Submit</Button>
    </Stack>
  );
}

interface Props extends InputProps {
  active: "true" | undefined;
  defaultValue: number | undefined;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (value?: number) => void;
}

const Input = ({
  defaultValue,
  onKeyDown,
  onChange,
  active,
}: Props) => {
  const [current, setCurrent] = useState<number | undefined | string>(
    defaultValue,
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value || "";

      if (value === "") {
        setCurrent(undefined);
        onChange(undefined);
        return;
      }
      const newValue = value
        .toString()
        .replace(current?.toString() || "", "");

      if (newValue === "") {
        return;
      }

      const v = parseInt(newValue);
      if (isNaN(v)) {
        return;
      }

      setCurrent(newValue);
      onChange(Number(newValue));
    },
    [current, onChange],
  );

  return (
    <TextInput
      value={current || ""}
      data-autofocus={active ? "true" : undefined}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      step={1}
      px={0}
      classNames={{ input: classes.textCenter }}
      type="number"
    />
  );
};
