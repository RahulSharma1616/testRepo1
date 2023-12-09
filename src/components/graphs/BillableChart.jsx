import axios from "axios";
import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";

const fetchBillableChartData = async () => {
  const response = await axios.get(
    "http://localhost:4000/analytics/getDataforPlotting"
  );
  return response.data;
};

function BillableChart() {
  const { data, error,isLoading } = useQuery({
    queryKey: ["billableChartData"],
    queryFn: fetchBillableChartData,
  });

  const chartData = React.useMemo(() => {
    if (isLoading) {
      return {
        billableHours: 100,
        nonBillableHours: 0,
        totalHours: 100,
      };
    }

    if (error) {
      console.error("Error fetching data: ", error);
      return {
        billableHours: 0,
        nonBillableHours: 0,
        totalHours: 0,
      };
    }

    const billableHours = Object.values(data).reduce(
      (a, b) => a + b.billableHours,
      100
    );
    const nonBillableHours = Object.values(data).reduce(
      (a, b) => a + b.nonBillableHours,
      0
    );
    const totalHours = billableHours + nonBillableHours;

    return {
      billableHours,
      nonBillableHours,
      totalHours,
    };
  }, [data, error]);

  const billablePercentage = (
    (chartData.billableHours / chartData.totalHours) *
    100
  ).toFixed(2);
  const nonBillablePercentage = (
    (chartData.nonBillableHours / chartData.totalHours) *
    100
  ).toFixed(2);

  const series = [
    billablePercentage,
    nonBillablePercentage,
    chartData.totalHours,
  ];

  const options = React.useMemo(
    () => ({
      noData: {
        text: "Loading...",
        align: "center",
        verticalAlign: "middle",
        offsetY: 0,
        offsetX: 0,
        style: {
          color: "green",
          fontSize: "16px",
        },
      },
      chart: {
        height: 390,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: ["#1ab7ea", "#0084ff", "#345678"],
      labels: ["Billable Hours", "Non-Billable Hours", "Total Hours"],
      legend: {
        show: true,
        floating: true,
        fontSize: "12px",
        position: "left",
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0,
        },
        formatter: function (seriesName, opts) {
          if (seriesName === "Total Hours")
            return (
              seriesName +
              ":  " +
              opts.w.globals.series[opts.seriesIndex] +
              " hours"
            );
          return (
            seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + " %"
          );
        },
        itemMargin: {
          vertical: 1,
        },
      },
    }),
    [chartData]
  );

  return (
    <div style={{ paddingLeft: "50px" }}>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={300}
        width={390}
      />
      <div style={{ paddingLeft: "130px" }}>
        <h6
          style={{
            fontSize: "20px",
            fontWeight: 500,
            fontFamily:
              'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          }}
        >
          Billable Hours
        </h6>
      </div>
    </div>
  );
}

export default BillableChart;