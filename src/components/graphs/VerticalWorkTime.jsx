import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useCookies } from "react-cookie";

export default function VerticalWorkTime() {
  const [cookies] = useCookies(["token"]);
  const [data, setData] = useState({});

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:4000/analytics/vertical-time",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then((response) => {
      setData({
        labels: response.data.labels,
        datasets: [
          {
            label: "Overtime",
            data: response.data.greaterThanExpected,
            backgroundColor: ["#0cad9b"],
          },
          {
            label: "Undertime",
            data: response.data.smallerThanExpected,
            backgroundColor: ["#3c7bcf"],
          },
        ],
      });
    });
  }, []);

  const options = {
    indexAxis: "y", // or 'x'

    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  if (Object.keys(data).length === 0) {
    return <div>Loading...</div>; // Add a loading indicator until the data is fetched
  }

  return <Bar data={data} options={options} height={350} width={440} />;
}
