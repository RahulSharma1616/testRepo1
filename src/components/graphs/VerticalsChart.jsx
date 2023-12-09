import React, { useMemo} from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";

const fetchVerticalChartData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:4000/analytics/getDataforPlotting"
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching vertical chart data");
  }
};

function VerticalHoursChart({ isProfileModalOpen }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["verticalChartData"],
    queryFn: fetchVerticalChartData,
  });

  const chartData = useMemo(() => {
    //send empty data when fetching
    if (isLoading) {
      return {
        categories: [],
        billedHours: [],
        nonBilledHours: [],
        expectedHours: [],
      };
    }

    //send error message if error present
    if (error) {
      console.error("Error fetching data: ", error);
      return {
        categories: [],
        billedHours: [],
        nonBilledHours: [],
        expectedHours: [],
      };
    }

    // logic to format the fetched data to render on the screen
    const categories = Object.keys(data);
    const billedHours = [];
    const nonBilledHours = [];
    const expectedHours = [];

    for (const category in data) {
      billedHours.push(data[category].billableHours + 30);
      nonBilledHours.push(data[category].nonBillableHours);
      expectedHours.push(data[category].expectedHours);
    }

    const modifiedLabels = categories.map((label) => label.split(" "));

    return {
      categories: modifiedLabels,
      billedHours: billedHours,
      nonBilledHours: nonBilledHours,
      expectedHours: expectedHours,
    };
  });

  const options = {
    // format rendered chart styles
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
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: !isProfileModalOpen,
      },
    },
    stroke: {
      width: 0,
      colors: ["#0c9fe8"],
    },
    dataLables: {
      formatter: (val) => {
        return val / 1000 + "K";
      },
      offsetY: -20,
      style: {
        fontSize: "5px",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        rotate: 0,
      },
      title: {
        text: "Verticals",
        style: {
          fontSize: "20px",
          fontWeight: 500,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
      },
    },

    colors: ["#1ad6a1", "#0cad9b", "#3c7bcf"],
    yaxis: {
      title: {
        text: "Hours",
        style: {
          fontSize: "20px",
          fontWeight: 500,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
      },
      // if val > 1000 render with K
      labels: {
        formatter: (val) => {
          if (val < 1000) return val;
          return val / 1000 + "K";
        },
      },
    },
  };

  return (
    <div className="chart">
      <ReactApexChart
        options={options}
        series={[
          {
            name: "Non-Billed Hours",
            group: "Total Hours",
            data: chartData.nonBilledHours,
          },
          {
            name: "Billed Hours",
            group: "Total Hours",
            data: chartData.billedHours,
          },
          {
            name: "Expected Hours",
            group: "Expecteds Hours",
            data: chartData.expectedHours,
          },
        ]}
        type="bar"
        height={350}
        width={820}
      />
    </div>
  );
}

export default VerticalHoursChart;
