import React from 'react';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useQuery } from "@apollo/client";
import { GET_STATS_BY_PAYMENT_TYPE } from "../graphql/queries/transaction.query";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const PaymentTypeStats = () => {
  const { data, paymentTypeStatsLoading } = useQuery(GET_STATS_BY_PAYMENT_TYPE);
  // console.log(data, "GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE");

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "₹",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 0,
        spacing: 5,
      },
    ],
  });

  useEffect(() => {
    if (data?.getStatsByPaymentType) {
      const paymentTypes = data.getStatsByPaymentType.map((stat) =>
        stat.paymentType.charAt(0).toUpperCase() + stat.paymentType.slice(1)
      );
      const totalAmounts = data.getStatsByPaymentType.map((stat) => stat.totalAmount);

      const backgroundColors = [];
      const borderColors = [];

      paymentTypes.forEach((paymentType) => {
        if (paymentType === "Cash") {
          backgroundColors.push("rgba(255, 206, 86, 1)");
          borderColors.push("rgba(255, 206, 86, 1)");
        } else if (paymentType === "Card") {
          backgroundColors.push("rgba(54, 162, 235, 1)");
          borderColors.push("rgba(54, 162, 235, 1)");
        } else if (paymentType === "Upi") {
          backgroundColors.push("rgba(255, 99, 132, 1)");
          borderColors.push("rgba(255, 99, 132, 1)");
        }
      });

      setChartData((prev) => ({
        labels: paymentTypes,
        datasets: [
          {
            ...prev.datasets[0],
            data: totalAmounts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
          },
        ],
      }));
    }
  }, [data]);

  return (
    <div className='flex flex-col justify-center items-center gap-6 h-full text-white'>
      

      {
        (data?.getStatsByPaymentType.length)? 
        <span className='font-semibold mt-5 text-indigo-500'>
          All time Stats by Payment Type
        </span>:""
      }
      {
      (data?.getStatsByPaymentType.length>0) ? 
        <Pie data={chartData} className='p-5' />
       : (
        <span className='font-semibold m-5'>
          <h1>No data found  &#128566;</h1>
        </span>
      )}
    </div>
  );
};

export default PaymentTypeStats;
