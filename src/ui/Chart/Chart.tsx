import { shuffleArray } from "@/utils";
import { useMantineColorScheme } from "@mantine/core";
import ApexCharts, { ApexOptions } from "apexcharts";
import _, { set } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type _TYPES =
  | "Default"
  | "Sparkline"
  | "Areapercent"
  | "Line"
  | "SingLine"
  | "Bar"
  | "Pie";
type Instance = ApexOptions;

type Custom = {
  instancetype: _TYPES;
  chartSeries: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chartOptions: Instance;
};

export const randomizeArraySparkline = () => [
  {
    data: shuffleArray([47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62]),
  },
];

const optionsSparkline = (chartId: string): Instance => {
  return {
    series: [],
    chart: {
      id: `chart_${chartId}_apex`,
      background: "rgba(0, 0, 0, 0)",
      type: "area",
      height: 40,
      width: 100,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: false,
      },
    },
    colors: ["#00E396"],
    fill: {
      opacity: 0.4,
      colors: ["#00E396"],
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    xaxis: {
      crosshairs: {
        width: 1,
      },
    },
    yaxis: {
      min: 0,
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  };
};

const optionsAreapercent = (chartId: string): Instance => {
  return {
    series: [],
    chart: {
      id: `chart_${chartId}_apex`,
      background: "rgba(0, 0, 0, 0)",
      type: "area",
      height: 100,
      width: 155,
      toolbar: {
        show: false,
      },
    },
    colors: ["#00E396"],
    fill: {
      opacity: 0.4,
      colors: ["#00E396"],
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "gray",
        },
        formatter: (value) => {
          return value + "%";
        },
      },
      // tickAmount: 0,
      // min: 0
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      stepSize: 0,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    grid: {
      // show: false,
      strokeDashArray: 2,
    },
  };
};

const optionsLine = (chartId: string): Instance => {
  return {
    chart: {
      id: `chart_${chartId}_apex`,
      background: "rgba(0, 0, 0, 0)",
      type: "line",
      height: "100%",
      stacked: false,
      width: "100%",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#f29525", "#008ffb"],
    fill: {
      opacity: 1,
      colors: ["#00E396"],
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    series: [
      {
        name: "Series A",
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
      },
      {
        name: "Series B",
        data: [20, 29, 37, 36, 44, 45, 50, 58],
      },
    ],
    xaxis: {
      categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
    },
    yaxis: [
      {
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
        tickAmount: 7,
        min: 0,
        labels: {
          style: {
            colors: "gray",
          },
          formatter: (value) => {
            return value?.toString() + "%";
          },
        },
      },
      {
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          style: {
            colors: "gray",
          },
        },
      },
    ],
    tooltip: {
      // shared: true,
      x: {
        format: "yyyy-MM-dd",
      },
      custom: function ({ series, dataPointIndex, w }) {
        const val_0 = series[0][dataPointIndex];
        const val_1 = series[1][dataPointIndex];
        const [color1, color2] = w.config.colors;

        // let d = new Date(w.globals.timescaleLabels[dataPointIndex].dateString).toLocaleDateString()
        const d = w.globals.categoryLabels[dataPointIndex];
        // ==== SERIES ROI
        const previousValue_0 =
          w.globals.series[0][dataPointIndex - 1];
        const previousValue_1 =
          w.globals.series[1][dataPointIndex - 1];
        const previousValue_12 =
          w.globals.series[1][dataPointIndex - 2];

        let seriesROI_0 = "0.00%";
        let seriesROI_1 = "0.00%";
        let seriesROI = "0.00%";

        if (previousValue_0 !== undefined) {
          const isGreaterThanZero = val_0 - previousValue_0 > 0;
          const isLessThanZero = val_0 - previousValue_0 < 0;
          let color = "";
          if (isGreaterThanZero) {
            color = "text-green";
          } else if (isLessThanZero) {
            color = "text-red";
          }
          seriesROI_0 = `<span class="${color}">${(
            ((val_0 - previousValue_0) / previousValue_0) *
            100
          ).toFixed(2)}%</span>`;
        }
        if (previousValue_1 !== undefined) {
          const isGreaterThanZero = val_1 - previousValue_1 > 0;
          const isLessThanZero = val_1 - previousValue_1 < 0;
          let color = "";
          if (isGreaterThanZero) {
            color = "text-green";
          } else if (isLessThanZero) {
            color = "text-red";
          }
          seriesROI_1 = `<span class="${color}">${(
            ((val_1 - previousValue_1) / previousValue_1) *
            100
          ).toFixed(2)}%</span>`;
        }
        if (previousValue_12 != undefined) {
          const todayROI =
            ((val_1 - previousValue_1) / previousValue_1) * 100;
          const preROI =
            ((previousValue_1 - previousValue_12) /
              previousValue_12) *
            100;
          const resultROI = todayROI - preROI;
          const isGreaterThanZero = resultROI > 0;
          const isLessThanZero = resultROI < 0;
          let color = "";
          if (isGreaterThanZero) {
            color = "text-green";
          } else if (isLessThanZero) {
            color = "text-red";
          }
          seriesROI = `<span class="${color}">${resultROI.toFixed(
            2,
          )}%</span>`;
        }

        return `<div class="panel-tooltip-chart">
          <div class="item-tooltip-date">${d}</div>
          <div class="item-tooltip">
            <div class="item-tooltip-label">
            <div class="item-tooltip-label-box" style="background: ${color1}"></div>
            <div>${w.globals.seriesNames[0]}</div>
            </div>
            <div class="item-tooltip-value">${seriesROI_0}</div>
          </div>
          <div class="item-tooltip">
            <div class="item-tooltip-label">
            <span class="item-tooltip-label-box" style="background: ${color2}"></span>
            <span>${w.globals.seriesNames[1]}</span>
            </div>
            <div class="item-tooltip-value">${seriesROI_1}</div>
          </div>
          <div class="item-tooltip">
          <div class="item-tooltip-label">Daily ROI</div>
            <div class="item-tooltip-value">${seriesROI}</div>
          </div>
        </div>`;
      },
    },
    grid: {
      // show: false,
      strokeDashArray: 2,
    },
    title: {
      text: "Earnings",
      align: "left",
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetY: 0,
      markers: {
        width: 15,
        height: 3,
        radius: 0,
        offsetY: -3,
        offsetX: -3,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
  };
};

const optionsSignLine = (chartId: string): Instance => {
  return {
    chart: {
      id: `chart_${chartId}_apex`,
      background: "rgba(0, 0, 0, 0)",
      type: "line",
      height: "100%",
      stacked: false,
      width: "100%",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#f29525", "#008ffb"],
    fill: {
      opacity: 1,
      colors: ["#00E396"],
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    series: [
      {
        name: "Series A",
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
      },
      {
        name: "Series B",
        data: [20, 29, 37, 36, 44, 45, 50, 58],
      },
    ],
    xaxis: {
      categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
    },
    yaxis: [
      {
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
        tickAmount: 7,
        min: 0,
        labels: {
          style: {
            colors: "gray",
          },
        },
      },
    ],

    grid: {
      // show: false,
      strokeDashArray: 2,
    },
    title: {
      text: "Earnings",
      align: "left",
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetY: 0,
      markers: {
        width: 15,
        height: 3,
        radius: 0,
        offsetY: -3,
        offsetX: -3,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
  };
};

const optionsBar = (chartId: string): Instance => {
  return {
    series: [],
    chart: {
      id: `chart_${chartId}_apex`,
      background: "rgba(0, 0, 0, 0)",
      type: "bar",
      height: "100%",
      width: "100%",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#f29525", "#008ffb"],
    fill: {
      opacity: 1,
      colors: ["#40c057"],
    },
    stroke: {
      curve: "smooth",
      width: 0,
    },
    yaxis: {
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      tickAmount: 7,
      min: 0,
      labels: {
        style: {
          colors: "gray",
        },
        formatter: (value) => {
          return value.toString() + "%";
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: 30,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      // type: "datetime",
      labels: {
        // format: 'dd/MM'
      },
      tickAmount: 7,
    },
    tooltip: {
      // shared: true,
      custom: function ({ series, dataPointIndex, w }) {
        const val_0 = series[0][dataPointIndex];
        const [color1, color2] = w.config.colors;

        // let d = new Date(w.globals.timescaleLabels[dataPointIndex].dateString).toLocaleDateString()
        const d = w.globals.labels[dataPointIndex];
        // ==== SERIES ROI
        const previousValue_0 =
          w.globals.series[0][dataPointIndex - 1];

        let seriesROI_0 = "0.00%";
        const seriesROI_1 = "0.00%";
        const seriesROI = "0.00%";

        if (previousValue_0 !== undefined) {
          const isGreaterThanZero = val_0 - previousValue_0 > 0;
          const isLessThanZero = val_0 - previousValue_0 < 0;
          let color = "";
          if (isGreaterThanZero) {
            color = "text-green";
          } else if (isLessThanZero) {
            color = "text-red";
          }
          seriesROI_0 = `<span class="${color}">${(
            ((val_0 - previousValue_0) / previousValue_0) *
            100
          ).toFixed(2)}%</span>`;
        }
        // if (previousValue_1 !== undefined) {
        //   let isGreaterZero = val_1 - previousValue_1 > 0
        //   let isLessZero = val_1 - previousValue_1 < 0
        //   seriesROI_1 = `<span class="${isGreaterZero ? "text-green" : isLessZero ? "text-red" : ""}">${((val_1 - previousValue_1) / previousValue_1 * 100).toFixed(2)}%)</span>`;
        // }
        // if(previousValue_12 != undefined) {
        //   let todayROI = (val_1 - previousValue_1) / previousValue_1 * 100
        //   let preROI = (previousValue_1 - previousValue_12) / previousValue_12 * 100
        //   let resultROI = todayROI - preROI
        //   let isGreaterZero = resultROI > 0
        //   let isLessZero = resultROI < 0
        //   seriesROI = `<span class="${isGreaterZero ? "text-green" : isLessZero ? "text-red" : ""}">${resultROI.toFixed(2)}%)</span>`;
        // }

        return `<div class="panel-tooltip-chart">
          <div class="item-tooltip-date">${d}</div>
          <div class="item-tooltip">
            <div class="item-tooltip-label">
            <div class="item-tooltip-label-box" style="background: ${color1}"></div>
            <div>Daily Profit</div>
            </div>
            <div class="item-tooltip-value">${seriesROI_0}</div>
          </div>
          <div class="item-tooltip">
            <div class="item-tooltip-label">
            <span class="item-tooltip-label-box" style="background: ${color2}"></span>
            <span>Realized P&L</span>
            </div>
            <div class="item-tooltip-value">${seriesROI_1}</div>
          </div>
          <div class="item-tooltip">
          <div class="item-tooltip-label">Unrealized PnL Change</div>
            <div class="item-tooltip-value">${seriesROI}</div>
          </div>
        </div>`;
      },
    },
    grid: {
      // show: false,
      strokeDashArray: 2,
    },
    title: {
      text: "Earnings",
      align: "left",
    },
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
      offsetY: 0,
      markers: {
        width: 15,
        height: 3,
        radius: 0,
        offsetY: -3,
        offsetX: -3,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
  };
};

const optionsPie = (chartId: string): Instance => {
  return {
    chart: {
      height: "100%",
      width: "100%",
      type: "donut",
      id: `chart_${chartId}_apex`,
      background: "rgba(0, 0, 0, 0)",
      events: {
        dataPointMouseEnter: function (event, chartContext, config) {
          const totalLabel = document.querySelector(
            ".apexcharts-datalabel-label",
          );
          if (totalLabel) {
            totalLabel.innerHTML =
              config.w.config.series[config.dataPointIndex];
          }
        },
        dataPointMouseLeave: function () {
          const totalLabel = document.querySelector(
            ".apexcharts-datalabel-label",
          );
          if (totalLabel) {
            totalLabel.textContent = "400";
          }
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: false,
              show: true,
              // label: "Total",
              fontSize: "24px",
              fontWeight: "bold",
              formatter: function (w) {
                const _m = _.max(w.globals.seriesTotals);
                return `${_m?.toString()}`;
              },
            },
            value: {
              fontSize: "24px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
  };
};

type InstancePropsByType = {
  [k in _TYPES]: Instance;
};

const _props: Partial<InstancePropsByType> = {
  Default: {},
  Sparkline: optionsSparkline(uuidv4()),
  Areapercent: optionsAreapercent(uuidv4()),
  Line: optionsLine(uuidv4()),
  Bar: optionsBar(uuidv4()),
  Pie: optionsPie(uuidv4()),
  SingLine: optionsSignLine(uuidv4()),
};

type InstanceProps = Partial<Custom>;

type Series = ApexAxisChartSeries | ApexNonAxisChartSeries;

export default function AppChart(props: InstanceProps) {
  const { colorScheme } = useMantineColorScheme();

  const refChart = useRef<HTMLDivElement>(null);
  const [chartId] = useState<string>(`chart_${uuidv4()}_apex`);
  const [options] = useState<Instance>(
    _props[props.instancetype ?? "Sparkline"] ?? {},
  );
  const [series] = useState<Series>(props.chartSeries ?? []);

  const updateSeries = useCallback(() => {
    const _chart = ApexCharts.getChartByID(chartId);
    if (_chart && props.chartOptions) {
      _chart?.updateOptions(props.chartOptions);
    }
  }, [chartId, props.chartOptions]);

  useEffect(() => {
    if (refChart.current) {
      const _chart = ApexCharts.getChartByID(chartId);
      const isDark = colorScheme === "dark";
      if (_chart) {
        _chart.updateOptions({
          theme: {
            mode: isDark ? "dark" : "light",
          },
        });
      }
    }
  }, [colorScheme, refChart, chartId]);

  useEffect(() => {
    const isDark = colorScheme === "dark";
    if (refChart.current != null) {
      const _options = { ...options };
      const ops = set(_options, "chart.id", chartId);
      const _chart = ApexCharts.getChartByID(chartId);
      if (_chart) {
        _chart.updateOptions(ops).then(() => {
          if (series) {
            _chart.updateSeries(series);
          }
        });
      } else {
        const chart = new ApexCharts(refChart.current, {
          ...ops,
          ...props.chartOptions,
          theme: {
            mode: isDark ? "dark" : "light",
          },
        });
        chart.render().then(() => {
          if (series) {
            chart.updateSeries(series);
          }
        });
      }
    }
  }, [chartId, options, props.chartOptions, series, colorScheme]);

  useEffect(() => {
    updateSeries();
  }, [props.chartOptions, updateSeries]);

  return <div ref={refChart} id={chartId} />;
}
