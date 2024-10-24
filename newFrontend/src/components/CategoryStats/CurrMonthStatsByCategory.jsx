import React from 'react'
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {  useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_CURRENT_MONTH_STATS_BY_CATEGORY } from '../../graphql/queries/transaction.query';

ChartJS.register(ArcElement, Tooltip, Legend);

const CurrMonthStatsByCategory = () => {

  const { data, loading:categoryStatsLoading,error } = useQuery(GET_CURRENT_MONTH_STATS_BY_CATEGORY);


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
        if (data?.getCurrentMonthStatsByCategory) {
          const categories = data.getCurrentMonthStatsByCategory.map((stat) =>
            stat.category.charAt(0).toUpperCase() + stat.category.slice(1)
          );
          const totalAmounts = data.getCurrentMonthStatsByCategory.map((stat) => stat.totalAmount);
    
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

    if(categoryStatsLoading){
      return <h1>Loading....</h1>
    }
    if(error){
      return <h1>Something went wrong</h1>
    }
  return (
    <div className='flex flex-col justify-center items-center gap-6 h-full '>
            

        {
            (data?.getCurrentMonthStatsByCategory.length)? 
            <span className='font-semibold mt-5 text-indigo-500'>
                 This month stats by Category
            </span>:""
        }
        {

          (data?.getCurrentMonthStatsByCategory.length>0)?
          <Doughnut data={chartData} className='p-5' options={options}/>
          :
          
          <span className='font-semibold m-5'>
              <h1>No transactions this month &#128566;</h1>
          </span>
        }

    </div>  
  )
}

export default CurrMonthStatsByCategory;