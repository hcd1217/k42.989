import AppText from "@/ui/Text/AppText";
import { shuffleArray } from "@/utils";
import { Table } from "@mantine/core";
import { cloneDeep } from "lodash";
import { ReactNode } from "react";
type FieldType = {
  name: string;
  text: string;
};

export type AppTableProps<T> = {
  fields: FieldType[];
  items: T[];
  fieldTemplate: (field: FieldType, row: T) => ReactNode;
  hideHeader?: boolean;
};

export default function AppTable<T extends { id: string }>(
  props: AppTableProps<T>,
) {
  const rows = props.items.map((element) => (
    <Table.Tr key={element.id} style={{ cursor: "pointer" }}>
      {props.fields.map((field, index) => (
        <Table.Td key={index}>
          {props.fieldTemplate(field, element)}
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Table withRowBorders={false} highlightOnHover w={"100%"}>
      {!props.hideHeader && (
        <Table.Thead>
          <Table.Tr>
            {props.fields.map((t, i) => (
              <Table.Th key={i}>
                <AppText instancetype="WithThead">{t.text}</AppText>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
      )}
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const elements = [
  {
    id: 6,
    lastPrice: 12.011,
    change: getRandomNumber(-25, 100),
    token: "ETHUSDT",
    quote: "USDT",
    base: "ETH",
    chart: "Carbon",
    icon: "/images/bybit/assets/eth.svg",
  },
  {
    id: 7,
    lastPrice: 14.007,
    change: getRandomNumber(-25, 100),
    token: "BTCUSDT",
    quote: "BTC",
    base: "USDT",
    chart: "Nitrogen",
    icon: "/images/bybit/assets/btc.svg",
  },
  {
    id: 39,
    lastPrice: 88.906,
    change: getRandomNumber(-25, 90),
    token: "GMTUSDT",
    quote: "GMT",
    base: "USDT",
    chart: "Yttrium",
    icon: "/images/bybit/assets/btc.svg",
  },
  {
    id: 56,
    lastPrice: 137.33,
    change: getRandomNumber(-25, 49),
    token: "SLIM/USDT",
    quote: "SLIM",
    base: "USDT",
    chart: "Barium",
    icon: "/images/bybit/assets/btc.svg",
  },
  {
    id: 58,
    lastPrice: 140.12,
    change: getRandomNumber(-25, 57),
    token: "SRP/USDT",
    quote: "SRP",
    base: "USDT",
    chart: "Cerium",
    icon: "/images/bybit/assets/btc.svg",
  },
];

export function generateItems(total: number) {
  const _items = cloneDeep(
    elements.map((el) => ({
      ...el,
      id: el.id.toString(),
    })),
  );
  return shuffleArray(_items, total);
}
