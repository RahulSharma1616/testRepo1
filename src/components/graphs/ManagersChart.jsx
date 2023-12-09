import React from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";

const fetchManagersChartData = async () => {
  const response = await axios.get(
    "http://localhost:4000/analytics/getDataOfManagers"
  );
  return response.data.managersData;
};

function ManagersChart({ isProfileModalOpen }) {
  const { data, error, status } = useQuery({
    queryKey: ["managersChartData"],
    queryFn: fetchManagersChartData,
  });

  const chartData = React.useMemo(() => {
    if (status === "loading") {
      return {
        categories: [],
        actualHours: [],
        expectedHours: [],
      };
    }

    if (status === "error") {
      console.error("Error fetching data: ", error);
      return {
        categories: [],
        actualHours: [],
        expectedHours: [],
      };
    }

    const managerNames = [];
    const actualHours = [];
    const expectedHours = [];

    for (const key in data) {
      const managerData = data[key];
      managerNames.push(managerData.manager);
      actualHours.push(managerData.hours);
      expectedHours.push(managerData.expectedHours);
    }

    return {
      categories: managerNames,
      actualHours: actualHours,
      expectedHours: expectedHours,
    };
  }, [data, error]);

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
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      colors: ["#3c7bcf", "#0cad9b"],
      xaxis: {
        title: {
          text: "Hours",
          style: {
            fontSize: "20px",
            fontWeight: 500,
            fontFamily:
              'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          },
        },
        categories: chartData.categories,
      },
      yaxis: {
        title: {
          text: "Managers",
          style: {
            fontSize: "20px",
            fontWeight: 500,
            fontFamily:
              'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          },
        },
      },
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: !isProfileModalOpen,
        },
      },
    }),
    [chartData]
  );

  return (
    <div className="horizontal-bar-chart">
      <ReactApexChart
        options={options}
        series={[
          {
            name: "Actual Hours",
            data: chartData.actualHours,
          },
          {
            name: "Expected Hours",
            data: chartData.expectedHours,
          },
        ]}
        type="bar"
        height={350}
        width={510}
      />
    </div>
  );
}

export default ManagersChart;
