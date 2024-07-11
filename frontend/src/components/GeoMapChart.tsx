import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";

import {
  TitleComponent,
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  VisualMapComponent,
  ToolboxComponent,
} from "echarts/components";
import { MapChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { ECharts, EChartsType } from "echarts";
import canJSON from "../data/can.json";
import { geoAlbers } from "d3-geo";

echarts.use([
  TitleComponent,
  DatasetComponent,
  VisualMapComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MapChart,
  CanvasRenderer,
  MarkLineComponent,
]);

const canJson = canJSON as any;
const projection = geoAlbers();
echarts.registerMap("Canada", canJson);

interface IGeoMapChart {
  data: any;
  isLoading: boolean;
}

const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

const GeoMapChart = (props: IGeoMapChart) => {
  const { data, isLoading } = props;
  useEffect(() => {
    if (chartInstRef.current) {
      if (isLoading) {
        chartInstRef.current.showLoading();
      } else {
        chartInstRef.current.hideLoading();
      }
    }
  }, [isLoading]);
  useEffect(() => {
    if (chartInstRef.current && data) {
      const geoData = data.payload
        .map((item: any) => ({ name: item.province, value: item.count }))
        .filter((item: any) => {
          return CANADIAN_PROVINCES.includes(item.name);
        });
      const sortedData = geoData.sort((a: any, b: any) => a.value - b.value);
      const option = {
        title: {
          text: "Canada LMIA Stats",
          subtext: "Data from statscan",
          sublink: "https://www.statcan.gc.ca/en/start",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
        },
        visualMap: {
          left: "right",
          min: sortedData[0].value,
          max: sortedData[sortedData.length - 1].value,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026",
            ],
          },
          text: ["High", "Low"],
          calculable: true,
        },
        series: [
          {
            name: "Positive LMIAs",
            type: "map",
            map: "Canada",
            projection: {
              project: function (point: any) {
                return projection(point);
              },
              unproject: function (point: any) {
                return projection.invert && projection.invert(point);
              },
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            data: geoData,
          },
        ],
      };
      chartInstRef.current.setOption(option, true);
      chartInstRef.current.hideLoading();
    }
  }, [data]);
  const chartDivRef = useRef<HTMLDivElement | null>(null);
  const chartInstRef = useRef<ECharts | null>(null);

  useEffect(() => {
    if (chartDivRef.current) {
      const geoChart = echarts.getInstanceByDom(chartDivRef.current) || echarts.init(chartDivRef.current);
      geoChart.showLoading();
      chartInstRef.current = geoChart as unknown as EChartsType;
    }
  }, []);
  return <div id={"foo"} ref={chartDivRef} style={{ width: "90vw", height: "80vh" }} />;
};

export default GeoMapChart;
