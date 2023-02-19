import React, { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

ChartJS.register(ArcElement, Tooltip, Legend);

function DashBoardPage() {
  const { auth } = useAuth();

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  // Retrive top 3 common risk
  useEffect(() => {
    axios
      .get("/risk", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        const newRiskTable = response.data;

        const counts = {};
        // Count occurrences of each unique risk
        newRiskTable.forEach((risk) => {
          counts[risk.scenarioName] = (counts[risk.scenarioName] || 0) + 1;
        });

        // Sort the results based on count
        const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        // Return the top 3
        const top3 = sortedCounts.slice(0, 3);

        // Split the top dictionary into key and value
        const keys = top3.map((item) => item[0]);
        const values = top3.map((item) => item[1]);

        setData({
          labels: keys,
          datasets: [
            {
              label: "# of Occurrence",
              data: values,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <NavigationBar
        loggedIn={true}
        username={auth?.username}
        role={auth?.role}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <h1>My Dashboard</h1>
        <h3>Top 3 Common Risks</h3>
        <div>
          <Pie data={data} />
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;
