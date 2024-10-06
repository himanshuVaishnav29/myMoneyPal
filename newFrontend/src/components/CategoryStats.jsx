import React from 'react'
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useMutation, useQuery } from "@apollo/client";
import { GET_STATS_BY_CATEGORY } from "../graphql/queries/transaction.query";
import { GET_AUTHETICATED_USER } from "../graphql/queries/user.query";
import { useEffect, useState } from "react";
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryStats = () => {
    // const { data: authUserData } = useQuery(GET_AUTHETICATED_USER);
    // const [logout, { loading, client }] = useMutation(LOGOUT, {
    //   refetchQueries: ["GetAuthenticatedUser"],
    // });
    const { data, categoryStatsLoading } = useQuery(GET_STATS_BY_CATEGORY);

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
            cutout: 130,
          },
        ],
      });
    
      useEffect(() => {
        if (data?.getStatsByCategory) {
          const categories = data.getStatsByCategory.map((stat) =>
            stat.category.charAt(0).toUpperCase() + stat.category.slice(1)
          );
          const totalAmounts = data.getStatsByCategory.map((stat) => stat.totalAmount);
    
          const backgroundColors = [];
          const borderColors = [];
    
          categories.forEach((category) => {
            if (category === "Saving") {
              backgroundColors.push("rgba(75, 192, 192)");
              borderColors.push("rgba(75, 192, 192)");
            } else if (category === "Expense") {
              backgroundColors.push("rgba(255, 99, 132)");
              borderColors.push("rgba(255, 99, 132)");
            } else if (category === "Investment") {
              backgroundColors.push("rgba(54, 162, 235)");
              borderColors.push("rgba(54, 162, 235)");
            }
          });
          setChartData((prev) => ({
            labels: categories,
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
    // <div className='flex justify-center'>
    //     	<Doughnut data={chartData} />
    // </div>

    // <div className='flex  justify-center items-center gap-6 h-full bg-white'>
    //     <div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]'>
    //       <span className='center'>Recent</span>
    //         <Doughnut data={chartData} />
    //     </div>
    // </div>

    <div className="flex flex-col justify-center items-center gap-6 h-full">
      {data?.getStatsByCategory.length ? (
        <span className="font-semibold mt-5 text-indigo-500">
          All time Stats by Category
        </span>
      ) : (
        ""
      )}
      {data?.getStatsByCategory.length > 0 ? (
        <Doughnut data={chartData} className="p-5" />
      ) : (
        <span className="font-semibold m-5">
          <h1>No data found &#128566;</h1>
        </span>
      )}
    </div>
  );
}

export default CategoryStats;

