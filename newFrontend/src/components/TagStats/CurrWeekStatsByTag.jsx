import React from 'react';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useQuery } from "@apollo/client";

import { useEffect, useState } from "react";
import { GET_CURRENT_WEEK_STATS_BY_TAG } from '../../graphql/queries/transaction.query';

ChartJS.register(ArcElement, Tooltip, Legend);

const CurrWeekStatsByTag = () => {
    const { data, loading:weekStatsLoading,error} = useQuery(GET_CURRENT_WEEK_STATS_BY_TAG);


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
                spacing:0,
            },
        ],
    });

    useEffect(() => {
        if (data?.getCurrentWeekStatsByTag) {
            const tags = data.getCurrentWeekStatsByTag.map((stat) =>
                stat.tag.charAt(0).toUpperCase() + stat.tag.slice(1)
            );
            const totalAmounts = data.getCurrentWeekStatsByTag.map((stat) => stat.totalAmount);

            const backgroundColors = [];
            const borderColors = [];

            tags.forEach((tag) => {
                switch (tag) {
                    case "Food & Dining":
                        backgroundColors.push("rgba(255, 206, 86, 1)");
                        borderColors.push("rgba(255, 206, 86, 1)");
                        break;
                    case "Entertainment & Leisure":
                        backgroundColors.push("rgba(153, 102, 255, 1)");
                        borderColors.push("rgba(153, 102, 255, 1)");
                        break;
                    case "Utilities & Bills":
                        backgroundColors.push("rgba(255, 159, 64, 1)");
                        borderColors.push("rgba(255, 159, 64, 1)");
                        break;
                    case "Transportation & Fuel":
                        backgroundColors.push("rgba(54, 162, 235, 1)");
                        borderColors.push("rgba(54, 162, 235, 1)");
                        break;
                    case "Groceries & Household":
                        backgroundColors.push("rgba(75, 192, 192, 1)");
                        borderColors.push("rgba(75, 192, 192, 1)");
                        break;
                    case "Repairs & Maintenance":
                        backgroundColors.push("rgba(201, 203, 207, 1)");
                        borderColors.push("rgba(201, 203, 207, 1)");
                        break;
                    case "Healthcare & Medical":
                        backgroundColors.push("rgba(255, 99, 132, 1)");
                        borderColors.push("rgba(255, 99, 132, 1)");
                        break;
                    case "Travel & Vacation":
                        backgroundColors.push("rgba(75, 192, 192, 1)");
                        borderColors.push("rgba(75, 192, 192, 1)");
                        break;
                    case "Shopping & Personal Care":
                        backgroundColors.push("rgba(54, 162, 235, 1)");
                        borderColors.push("rgba(54, 162, 235, 1)");
                        break;
                    default:
                        backgroundColors.push("rgba(153, 102, 255, 1)");
                        borderColors.push("rgba(153, 102, 255, 1)");
                        break;
                }
            });
            setChartData((prev) => ({
                labels: tags,
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
                // labels: {
                //     color: 'white',
                // },
                display:true
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
    if(weekStatsLoading){
        return <h1>Loading....</h1>
    }
    if(error){
        return <h1>Something went wrong</h1>
    }
    return (
        <div className="flex flex-col justify-center items-center gap-6 h-full text-white">
            {data?.getCurrentWeekStatsByTag.length ? (
                <span className="font-semibold mt-5 text-indigo-500">
                    This week Stats by Tag
                </span>
            ) : (
                ""
            )}
            {data?.getCurrentWeekStatsByTag.length > 0 ? (
                <Pie data={chartData} className="p-5" options={options} />
            ) : (
                <span className="font-semibold m-5">
                    <h1>No data found &#128566;</h1>
                </span>
            )}
        </div>
    );
};

export default CurrWeekStatsByTag;
