import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useCookies } from "react-cookie";

export default function TimesheetsFilled() {
  const [cookies] = useCookies(["token"]);
  const [data, setData] = useState({});

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:4000/analytics/timesheets-filled",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then((response) => {
      setData({
        labels: ["% Timesheets Filled"], // Labels for the x-axis
        datasets: [
          {
            label: "Filled On-Time",
            data: [response.data.data[0]],
            backgroundColor: ["#0cad9b"],
          },
          {
            label: "Not Filled On-Time",
            data: [response.data.data[1]],
            backgroundColor: ["#3c7bcf"],
          },
        ],
      });
    });
  }, []);

  if (Object.keys(data).length === 0) {
    return <div>Loading...</div>; // Add a loading indicator until the data is fetched
  }

  return <Bar data={data} height={350} width={440} />;
}
