import React from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:4000/analytics/getDataOfProjects");
    return response.data.projectArray;
  } catch (error) {
    throw new Error("Error fetching project data");
  }
};

function ProjectChart({ isProfileModalOpen }) {
  const { data, error, status } = useQuery({ queryKey: ["projectData"], queryFn: fetchData});

  const chartData = React.useMemo(() => {

    if(error) {
      console.error("Error fetchng data:", error.message);
      return [];
    }

    if (!data) return [];
    const projectNames = [];
    const projectHours = [];
    const expectedHours = [];

    for (const key in data) {
      const project = data[key];
      if (!project.projectName.toLowerCase().includes("holiday")) {
        projectNames.push(project.projectName.split(" "));
        projectHours.push(project.hours);
        expectedHours.push(project.expectedHours);
      }
    }

    return [
      { name: "Actual Hours", data: projectHours },
      { name: "Expected Hours", data: expectedHours },
    ];
  }, [data,error]);

  const chartOptions = React.useMemo(() => ({
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
      id: "project-chart",
      toolbar: {
        show: !isProfileModalOpen,
      },
    },
    xaxis: {
      labels: {
        rotate: 0,
      },
      categories: chartData.map(({ name }) => name),
      title: {
        text: "Projects",
        style: {
          fontSize: "20px",
          fontWeight: 500,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
      },
    },
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
      labels: {
        formatter: (val) => {
          if (val < 1000) return val;
          return val / 1000 + "K";
        },
      },
    },
    colors: ["#3c7bcf", "#0cad9b"],
    toolbar: {
      show: false,
      tools: {
        selection: false,
      },
    },
  }), [chartData]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="project-chart">
      <ReactApexChart
        options={chartOptions}
        series={chartData}
        type="bar"
        height={350}
        width={820}
      />
    </div>
  );
}

export default ProjectChart;