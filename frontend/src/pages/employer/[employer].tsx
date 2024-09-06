import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart, PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useRouter } from "next/router";
import Head from "next/head";
import AppBar from "~/components/AppBar";
import Search from "~/components/Search";
import { getEmployerStats } from "~/apis/lmiaFE";
import { useQuery } from "react-query";
import { IByAddress, IByProvince, IByQuarter, IEmployerStatsResponse } from "~/types/employerStats";
import Link from "next/link";

echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, BarChart, PieChart, CanvasRenderer]);
const LoadingAnimation = () => (
    <div role="status" className="absolute top-1/2 left-1/2">
        <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
            />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
            />
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
);
const LMIAStatisticsDashboard = () => {
    const router = useRouter();
    const chartRefs = useRef<{ [key: string]: echarts.ECharts }>({}); // Refs for the charts
    const chartDOMRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // Refs for the chart DOM elements
    const { employer } = router.query;
    const { data, isError, isLoading } = useQuery<IEmployerStatsResponse>(
        ["getEmployerStats", { name: employer }],
        getEmployerStats,
    );
    useEffect(() => {
        if (!employer || !data) return;

        // NOC Chart
        let nocChart;
        if (chartRefs.current["nocChart"]) {
            nocChart = chartRefs.current["nocChart"];
        } else {
            nocChart = echarts.init(chartDOMRefs.current?.nocChart as HTMLDivElement);
            chartRefs.current["nocChart"] = nocChart;
        }
        const options: echarts.EChartsCoreOption = {
            title: { text: "LMIAs by NOC Code", left: "center" },
            responsive: true,
            maintainAspectRatio: false,
            tooltip: {
                trigger: "item",
                textStyle: {
                    overflow: "truncate",
                    width: 200,
                },
            },
            legend: {
                orient: "vertical",
                left: "right",
                type: "scroll",
                textStyle: {
                    overflow: "truncate",
                    width: 200,
                },
            },
            series: [
                {
                    name: "NOC Code",
                    type: "pie",
                    radius: "70%",
                    data: data?.payload.byOccupation.map((item: any) => ({
                        name: item._id,
                        value: item.totalPositions,
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            ],
        };
        nocChart.setOption(options);

        // // Year Chart
        const yearChart =
            chartRefs.current["yearChart"] || echarts.init(chartDOMRefs.current?.yearChart as HTMLDivElement);

        yearChart.setOption({
            title: { text: "LMIAs by Quarter", left: "center" },
            tooltip: { trigger: "axis" },
            xAxis: {
                type: "category",
                data: data?.payload.byQuarter.map((item: IByQuarter) => `${item.year} Q${item.quarter}`),
            },
            yAxis: { type: "value" },
            series: [
                {
                    data: data?.payload.byQuarter.map((item: any) => item.totalPositions),
                    type: "bar",
                },
            ],
        });

        // Province Chart
        const provinceChart =
            chartRefs.current["provinceChart"] || echarts.init(chartDOMRefs.current?.provinceChart as HTMLDivElement);
        provinceChart.setOption({
            title: { text: "LMIAs by Province", left: "center" },
            tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
            legend: { left: "right" },
            grid: { left: "3%", right: "4%", bottom: "3%", top: "5%", containLabel: true },
            xAxis: { type: "value" },
            yAxis: { type: "category", data: data?.payload.byProvince.map((item: IByProvince) => item._id || "Other") },
            series: [
                {
                    name: "LMIAs",
                    type: "bar",
                    data: data?.payload.byProvince.map((item: IByProvince) => item.totalPositions),
                },
            ],
        });

        return () => {
            // nocChart.dispose();
            // yearChart.dispose();
            // provinceChart.dispose();
        };
    }, [employer, data]);

    const handleBack = () => {
        // setSelectedEmployer(null);
    };

    return (
        <>
            <Head>
                <title>Canada LMIA Statistics</title>
            </Head>
            <div className="flex flex-col justify-start items-center grow gap-y-4">
                <AppBar />
            </div>
            <div className="p-4 space-y-4 bg-gray-100 min-h-screen rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    {/* Back to main page */}
                    <Link className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition" href="/">
                        Back
                    </Link>
                </div>

                <h2 className="text-xl font-bold  text-center mb-4">
                    {employer}
                    <p className="text-lg text-gray-700 font-semibold">
                        Total Positions {data?.payload.totalStats[0]?.totalPositions}
                    </p>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow relative">
                        <div
                            className="h-96"
                            ref={(ref) => (chartDOMRefs.current = { ...chartDOMRefs.current, nocChart: ref })}
                            id="nocChart"
                        ></div>
                        {isLoading && <LoadingAnimation />}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow relative">
                        <div
                            id="yearChart"
                            className="h-96"
                            ref={(ref) => (chartDOMRefs.current = { ...chartDOMRefs.current, yearChart: ref })}
                        ></div>
                        {isLoading && <LoadingAnimation />}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow relative">
                        <div
                            id="provinceChart"
                            className="h-96"
                            ref={(ref) => (chartDOMRefs.current = { ...chartDOMRefs.current, provinceChart: ref })}
                        ></div>
                        {isLoading && <LoadingAnimation />}
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow relative">
                        {isLoading ? (
                            <LoadingAnimation />
                        ) : (
                            <table className="w-full block overflow-auto">
                                <thead>
                                    <tr>
                                        <th>Address</th>
                                        <th className="text-center">Total Positions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.payload.byAddress.map((item: IByAddress) => (
                                        <tr key={item._id}>
                                            <td>{item._id}</td>
                                            <td className="text-center">{item.totalPositions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LMIAStatisticsDashboard;
