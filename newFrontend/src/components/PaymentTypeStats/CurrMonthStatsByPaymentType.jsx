import React from 'react';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useQuery } from "@apollo/client";

import { useEffect, useState } from "react";
import { GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE } from '../../graphql/queries/transaction.query';

ChartJS.register(ArcElement, Tooltip, Legend);

const CurrMonthStatsByPaymentType = () => {
  const { data, loading:paymentTypeStatsLoading,error } = useQuery(GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE);
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
    if (data?.getCurrentMonthStatsByPaymentType) {
      const paymentTypes = data.getCurrentMonthStatsByPaymentType.map((stat) =>
        stat.paymentType.charAt(0).toUpperCase() + stat.paymentType.slice(1)
      );
      const totalAmounts = data.getCurrentMonthStatsByPaymentType.map((stat) => stat.totalAmount);

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
  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'white', 
        },
      },
      tooltip: {
        titleColor: 'white', 
        bodyColor: 'white', 
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };
  if(paymentTypeStatsLoading){
    return <h1>Loading....</h1>
  }
  if(error){
    return <h1>Something went wrong</h1>
  }
  return (
    <div className='flex flex-col justify-center items-center gap-6 h-full '>
     

      {
        (data?.getCurrentMonthStatsByPaymentType.length)? 
        <span className='font-semibold mt-5 text-indigo-500'>
      </span>:""
      }
      {
        data?.getCurrentMonthStatsByPaymentType && data.getCurrentMonthStatsByPaymentType.length > 0  
        ? 
        <Pie data={chartData} className='p-5' options={options} />
         : 
         <span className='font-semibold m-5'>
          <h1>No transactions this month &#128566;</h1>
        </span>
      }
    </div>
  );
};

export default CurrMonthStatsByPaymentType;
