// import useOrderBook from "@/hooks/useOrderBook";
// import { Box, Flex, HoverCard, NumberFormatter, SimpleGrid, Space, Text } from "@mantine/core";
// import { useInterval } from "@mantine/hooks";
// import { IconArrowUp, IconFlagFilled } from "@tabler/icons-react";
// import { useEffect, useMemo, useState } from "react";
// import NumberFormat from "../NumberFormat";

export function OrderHorizontalOrderBookTrade() {
  return <></>;
  // const { data, isLoading } = useOrderBook()

  // const green = useMemo(() => {
  //   return data?.a ?? []
  // }, [data])

  // const red = useMemo(() => {
  //   return data?.b ?? []
  // }, [data])

  // const [status, setStatus] = useState<"newData" | "">('');

  // const interval = useInterval(() => setStatus((s) => s === "newData" ? "" : "newData"), 1000);

  // useEffect(() => {
  //   interval.start();
  //   return interval.stop;
  // }, []);

  // return (
  //   <>
  //     <Flex align={"center"} gap={20} pl={5} component="div">
  //       <Flex align={"center"} gap={5}>
  //         <IconArrowUp color={"#23b26b"} fontWeight={"bold"} />
  //         <Text fw={700} fz={"20px"} c={"#23b26b"}>
  //           0.022822
  //         </Text>
  //       </Flex>
  //       <HoverCard
  //         width={200}
  //         position="top"
  //         styles={{
  //           dropdown: {
  //             background: "light-dark(white, #333537)",
  //           },
  //         }}
  //       >
  //         <HoverCard.Target>
  //           <Flex
  //             align={"center"}
  //             gap={5}
  //             styles={{
  //               root: {
  //                 cursor: "help",
  //               },
  //             }}
  //           >
  //             <IconFlagFilled color="#f6a600" size={16} />
  //             <Box style={{ borderBottom: "dashed 1px #f6a600" }}>
  //               <Text fw={"bolder"} fz={16} c={"#f6a600"}>
  //                 0.022832
  //               </Text>
  //             </Box>
  //           </Flex>
  //         </HoverCard.Target>
  //         <HoverCard.Dropdown>
  //           <Text fz={12}>
  //             Mark price is derived by index price and funding rate,
  //             and reflects the fair market price. Liquidation is
  //             triggered by mark price.
  //           </Text>
  //           <Space mb={10} />
  //           <Text c={"#f6a600"} fz={12} className="cursor-pointer">
  //             Click here for details
  //           </Text>
  //         </HoverCard.Dropdown>
  //       </HoverCard>
  //     </Flex>
  //     <Space mb={10} />
  //     <SimpleGrid
  //       cols={2}
  //       styles={{
  //         container: {},
  //         root: {
  //           gap: 10,
  //         },
  //       }}
  //     >
  //       <div className="table-root">
  //         <div className="table-header">
  //           <Flex className="table-row">
  //             <Box className="table-cell" flex={"0 0 50%"}>
  //               <Box h={"24px"}>
  //                 <Box className="row-item-head--text" h={"100%"}>
  //                   <Flex
  //                     justify={"start"}
  //                     align={"center"}
  //                     h={"100%"}
  //                   >
  //                     <div>Qty(ETH)</div>
  //                   </Flex>
  //                 </Box>
  //               </Box>
  //             </Box>
  //             <Box className="table-cell" flex={"0 0 50%"}>
  //               <Flex
  //                 h={"24px"}
  //                 pl={5}
  //                 align={"center"}
  //                 justify={"end"}
  //               >
  //                 <div className="row-item-head--text">
  //                   <div>Price(USDT)</div>
  //                 </div>
  //               </Flex>
  //             </Box>
  //           </Flex>
  //         </div>
  //         <div className="table-body">
  //           {[...Array(15)].map((item, i) => (
  //             <HoverCard
  //               width={230}
  //               openDelay={0}
  //               closeDelay={0}
  //               shadow="md"
  //               key={i}
  //               position="left"
  //               withinPortal
  //               withArrow
  //               arrowPosition="center"
  //               arrowSize={14}
  //             >
  //               <HoverCard.Target>
  //                 <Flex className={"table-row table-row-default"}>
  //                   <Box className="table-cell" flex={"0 0 50%"}>
  //                     <Box h={"100%"} className="relative">
  //                       <Box
  //                         className="progress_bar"
  //                         left={0}
  //                         top={0}
  //                         h={"100%"}
  //                         w={`${Math.random() * 100}%`}
  //                         pos={"absolute"}
  //                         style={{
  //                           background:
  //                             "light-dark(#e7f6ed, #162a24)",
  //                         }}
  //                       ></Box>
  //                       <Flex
  //                         className="cell-text progress_bar_text"
  //                         align={"center"}
  //                         justify={"start"}
  //                       >
  //                         <Text
  //                           fz={12}
  //                           styles={{
  //                             root: {
  //                               color: "light-dark(#121214, #fff)",
  //                             },
  //                           }}
  //                         >
  //                           {/* <NumberFormatter
  //                             thousandSeparator
  //                             value={(Math.random() * 10e3).toFixed(
  //                               2,
  //                             )}
  //                           /> */}
  //                           <NumberFormat value={green[i][0]} decimalPlaces={2}/>
  //                         </Text>
  //                       </Flex>
  //                     </Box>
  //                   </Box>
  //                   <Box className="table-cell" flex={"0 0 50%"}>
  //                     <Box h={"100%"} pl={5} pos={"relative"}>
  //                       <Box
  //                         className="progress_bar"
  //                         right={0}
  //                         top={0}
  //                         h={"100%"}
  //                         w={`${Math.random() * 100}%`}
  //                         pos={"absolute"}
  //                         style={{
  //                           background:
  //                             "light-dark(#e7f6ed, #162a24)",
  //                           zIndex: 0,
  //                         }}
  //                       ></Box>
  //                       <Flex
  //                         align={"center"}
  //                         justify={"end"}
  //                         pos={"relative"}
  //                         styles={{
  //                           root: {
  //                             zIndex: 1,
  //                           },
  //                         }}
  //                       >
  //                         <div className="cell-text long">
  //                           <Text fz={12} c={"#23b26b"}>
  //                             {/* <NumberFormatter
  //                               thousandSeparator
  //                               value={(Math.random() * 10e6).toFixed(
  //                                 3,
  //                               )}
  //                             /> */}
  //                             <NumberFormat value={green[i][1]} decimalPlaces={2}/>
  //                           </Text>
  //                         </div>
  //                       </Flex>
  //                     </Box>
  //                   </Box>
  //                 </Flex>
  //               </HoverCard.Target>
  //               <HoverCard.Dropdown
  //                 styles={{
  //                   dropdown: {
  //                     background: "light-dark(#f3f5f7, #26282c)",
  //                   },
  //                 }}
  //               >
  //                 <Box className="space-y-5">
  //                   <Flex justify={"space-between"}>
  //                     <Text fz={12}>Avg. Price</Text>
  //                     <Text
  //                       fz={12}
  //                       fw={"bold"}
  //                       styles={{
  //                         root: {
  //                           color: "light-dark(#121214, #fff)",
  //                         },
  //                       }}
  //                     >
  //                       = 61,423.93
  //                     </Text>
  //                   </Flex>
  //                   <Flex justify={"space-between"}>
  //                     <Text fz={12}>Total Qty (BTC)</Text>
  //                     <Text
  //                       fz={12}
  //                       fw={"bold"}
  //                       styles={{
  //                         root: {
  //                           color: "light-dark(#121214, #fff)",
  //                         },
  //                       }}
  //                     >
  //                       0.885551
  //                     </Text>
  //                   </Flex>
  //                   <Flex justify={"space-between"}>
  //                     <Text fz={12}>Total Qty (USDT)</Text>
  //                     <Text
  //                       fz={12}
  //                       fw={"bold"}
  //                       styles={{
  //                         root: {
  //                           color: "light-dark(#121214, #fff)",
  //                         },
  //                       }}
  //                     >
  //                       54.394K
  //                     </Text>
  //                   </Flex>
  //                 </Box>
  //               </HoverCard.Dropdown>
  //             </HoverCard>
  //           ))}
  //         </div>
  //       </div>
  //       <div className="table-root">
  //         <div className="table-header">
  //           <Flex className="table-row" align={"center"}>
  //             <Box className="table-cell" flex={"0 0 50%"}>
  //               <Flex
  //                 pr={5}
  //                 align={"center"}
  //                 justify={"end"}
  //               >
  //                 <div className="row-item-head--text">
  //                   <div>Price(USDT)</div>
  //                 </div>
  //               </Flex>
  //             </Box>
  //             <Box className="table-cell" flex={"0 0 50%"}>
  //               <Box h={"24px"}>
  //                 <Box className="row-item-head--text" h={"100%"}>
  //                   <Flex justify={"end"} align={"center"} h={"100%"}>
  //                     <div>Qty(ETH)</div>
  //                   </Flex>
  //                 </Box>
  //               </Box>
  //             </Box>
  //           </Flex>
  //         </div>
  //         <div className="table-body">
  //           {[...Array(15)].map((item, i) => (
  //             <HoverCard
  //               width={230}
  //               openDelay={0}
  //               closeDelay={0}
  //               shadow="md"
  //               key={i}
  //               position="left"
  //               withinPortal
  //               withArrow
  //               arrowPosition="center"
  //               arrowSize={14}
  //             >
  //               <HoverCard.Target>
  //                 <Flex className="table-row table-row-default">
  //                   <Box className="table-cell" flex={"0 0 50%"}>
  //                     <Box h={"100%"} pl={5} pos={"relative"}>
  //                       <Box
  //                         className="progress_bar"
  //                         left={0}
  //                         top={0}
  //                         h={"100%"}
  //                         w={`${Math.random() * 100}%`}
  //                         pos={"absolute"}
  //                         style={{
  //                           background:
  //                             "light-dark(#feeaea, #35191d)",
  //                           zIndex: 0,
  //                         }}
  //                       ></Box>
  //                       <Flex
  //                         align={"center"}
  //                         justify={"end"}
  //                         pos={"relative"}
  //                         style={{ zIndex: 1 }}
  //                       >
  //                         <div className="cell-text long">
  //                           <Text fz={12} c={"#f0444b"}>
  //                             {/* <NumberFormatter
  //                               thousandSeparator
  //                               value={(Math.random() * 10e4).toFixed(
  //                                 3,
  //                               )}
  //                             /> */}
  //                             <NumberFormat value={red[i][0]} decimalPlaces={2}/>
  //                           </Text>
  //                         </div>
  //                       </Flex>
  //                     </Box>
  //                   </Box>
  //                   <Box className="table-cell" pr={5} flex={"0 0 50%"}>
  //                     <div className="relative">
  //                       <Box
  //                         className="progress_bar"
  //                         right={0}
  //                         top={0}
  //                         h={"100%"}
  //                         w={`${Math.random() * 100}%`}
  //                         pos={"absolute"}
  //                         style={{
  //                           background:
  //                             "light-dark(#feeaea, #35191d)",
  //                         }}
  //                       ></Box>
  //                       <Flex
  //                         h={"100%"}
  //                         className="cell-text text-right progress_bar_text"
  //                         align={"center"}
  //                         justify={"end"}
  //                       >
  //                         <Text
  //                           fz={12}
  //                           styles={{
  //                             root: {
  //                               color: "light-dark(#151517, #ffffff)",
  //                             },
  //                           }}
  //                         >
  //                           {/* <NumberFormatter
  //                             thousandSeparator
  //                             value={(Math.random() * 10e6).toFixed(
  //                               2,
  //                             )}
  //                           /> */}
  //                           <NumberFormat value={red[i][1]} decimalPlaces={2}/>
  //                         </Text>
  //                       </Flex>
  //                     </div>
  //                   </Box>
  //                 </Flex>
  //               </HoverCard.Target>
  //               <HoverCard.Dropdown
  //                 styles={{
  //                   dropdown: {
  //                     background: "light-dark(#f3f5f7, #26282c)",
  //                   },
  //                 }}
  //               >
  //                 <Box className="space-y-5">
  //                   <Flex justify={"space-between"}>
  //                     <Text fz={12}>Avg. Price</Text>
  //                     <Text
  //                       fz={12}
  //                       fw={"bold"}
  //                       styles={{
  //                         root: {
  //                           color: "light-dark(#121214, #fff)",
  //                         },
  //                       }}
  //                     >
  //                       = 61,423.93
  //                     </Text>
  //                   </Flex>
  //                   <Flex justify={"space-between"}>
  //                     <Text fz={12}>Total Qty (BTC)</Text>
  //                     <Text
  //                       fz={12}
  //                       fw={"bold"}
  //                       styles={{
  //                         root: {
  //                           color: "light-dark(#121214, #fff)",
  //                         },
  //                       }}
  //                     >
  //                       0.885551
  //                     </Text>
  //                   </Flex>
  //                   <Flex justify={"space-between"}>
  //                     <Text fz={12}>Total Qty (USDT)</Text>
  //                     <Text
  //                       fz={12}
  //                       fw={"bold"}
  //                       styles={{
  //                         root: {
  //                           color: "light-dark(#121214, #fff)",
  //                         },
  //                       }}
  //                     >
  //                       54.394K
  //                     </Text>
  //                   </Flex>
  //                 </Box>
  //               </HoverCard.Dropdown>
  //             </HoverCard>
  //           ))}
  //         </div>
  //       </div>
  //     </SimpleGrid>

  //     <Space mt={10} />
  //     <HoverCard
  //       width={280}
  //       shadow="md"
  //       position="top"
  //       styles={{
  //         dropdown: {
  //           background: "light-dark(#f3f5f7, #26282c)",
  //         },
  //       }}
  //     >
  //       <HoverCard.Target>
  //         <Box px={10}>
  //           <Box pos={"relative"} className="cursor-pointer">
  //             <Box
  //               w={`${35}%`}
  //               h={20}
  //               pos={"absolute"}
  //               left={0}
  //               top={"50%"}
  //               style={{
  //                 transform: "translateY(-50%)",
  //                 clipPath:
  //                   "polygon(0 0, 100% 0, calc(100% - 5px) 100%, 0% 100%)",
  //                 background: "light-dark(#e7f6ed, #172b23)",
  //               }}
  //             />
  //             <Box
  //               w={`${65}%`}
  //               h={20}
  //               pos={"absolute"}
  //               right={0}
  //               top={"50%"}
  //               style={{
  //                 transform: "translateY(-50%)",
  //                 clipPath:
  //                   "polygon(calc(0% + 5px) 0, 100% 0, 100% 100%, 0% 100%)",
  //                 background: "light-dark(#feeaea, #35191e)",
  //               }}
  //             />
  //             <Flex
  //               justify={"space-between"}
  //               align={"center"}
  //               pos={"relative"}
  //               h={"100%"}
  //               styles={{
  //                 root: {
  //                   zIndex: 1,
  //                 },
  //               }}
  //             >
  //               <Flex align={"center"} gap={4} h={"100%"}>
  //                 <Flex
  //                   align={"center"}
  //                   justify={"center"}
  //                   fz={10}
  //                   fw={600}
  //                   bd={"solid 1px #23b26b"}
  //                   w={20}
  //                   h={20}
  //                   style={{
  //                     textAlign: "center",
  //                     borderRadius: "2px",
  //                   }}
  //                   c={"#23b26b"}
  //                 >
  //                   B
  //                 </Flex>
  //                 <Text
  //                   c={"#23b26b"}
  //                   fz={12}
  //                   fw={500}
  //                 >{`${35}%`}</Text>
  //               </Flex>
  //               <Flex align={"center"} gap={4} h={"100%"}>
  //                 <Text
  //                   c={"#f0444b"}
  //                   fz={12}
  //                   fw={500}
  //                 >{`${65}%`}</Text>
  //                 <Flex
  //                   align={"center"}
  //                   justify={"center"}
  //                   fz={10}
  //                   fw={600}
  //                   bd={"solid 1px #f0444b"}
  //                   w={20}
  //                   h={20}
  //                   style={{
  //                     textAlign: "center",
  //                     borderRadius: "2px",
  //                   }}
  //                   c={"#f0444b"}
  //                 >
  //                   S
  //                 </Flex>
  //               </Flex>
  //             </Flex>
  //           </Box>
  //         </Box>
  //       </HoverCard.Target>
  //       <HoverCard.Dropdown>
  //         <Text size="sm">
  //           Bid-Ask Ratio for the Top 20 Levels within the BTCUSDT
  //           Order Book
  //         </Text>
  //       </HoverCard.Dropdown>
  //     </HoverCard>
  //   </>
  // );
}
