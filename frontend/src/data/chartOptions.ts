import { EChartsOption } from "echarts";

export type IChartType = "bar" | "line";
export default function getChartOptions(yParam: string, xAxisData: any[], yAxisData: any[], chartType: IChartType) {
  const legend = { data: [yParam] };

  const options = {
    title: {},
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend,
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: xAxisData,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        data: yAxisData,
        emphasis: { focus: "series" },
        name: yParam,
        type: "line",
      },
    ],
    barMaxWidth: "20%",
  };
  switch (chartType) {
    case "bar":
      options.series[0].type = chartType;
      break;
    case "line":
      options.series[0].type = chartType;
      break;

    default:
      throw new Error(`Unsupported chart type ${chartType}!`);
  }

  return options as EChartsOption;
}
