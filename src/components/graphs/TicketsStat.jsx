import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { useCookies } from "react-cookie";

export default function TicketsStat() {
  const [cookies] = useCookies(["token"]);
  const [data, setData] = useState({});

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:4000/analytics/tickets",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then((response) => {
      setData({
        labels: response.data.labels,
        datasets: [
          {
            label: ["Open vs Closed"],
            backgroundColor: [ "#0084ff", "#345678"],
            data: response.data.data,
          },
        ],
      });
    });
  }, []);

  if (Object.keys(data).length === 0) {
    return <div>Loading...</div>; // Add a loading indicator until the data is fetched
  }

  return <Pie data={data} height={400}/>;
}
