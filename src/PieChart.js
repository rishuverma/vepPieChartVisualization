import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
const PieChart = ({ dataForPieChart }) => {
  console.log("i am callled");
  console.log("i got this", dataForPieChart);
  let dataForPieChart2 = {
    labels: ["a", "b"],
    datasets: [
      {
        label: "yo",
        data: [25, 75],
        backgroundColor: ["rgba(20,50,45,20)", "rgba(34,75,14,45)"],
      },
    ],
  };
  return (
    <div className="card" style={{ height: "300px" }}>
      <div
        className="card-body"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <Pie data={dataForPieChart} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};
export default PieChart;
