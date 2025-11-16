import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_MONTH_STATS_BY_TAG } from '../../graphql/queries/transaction.query';
import ComponentLoader from '../Skeletons/ComponentLoader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CurrMonthStatsByTagBar = () => {
    const { data, loading, error } = useQuery(GET_CURRENT_MONTH_STATS_BY_TAG);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Amount (₹)',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 2,
        }],
    });

    useEffect(() => {
        if (data?.getCurrentMonthStatsByTag) {
            const tags = data.getCurrentMonthStatsByTag.map(stat => stat.tag);
            const amounts = data.getCurrentMonthStatsByTag.map(stat => stat.totalAmount);
            const scaledAmounts = amounts.map(amount => Math.sqrt(amount));

            const colors = [
                'rgba(255, 206, 86, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(201, 203, 207, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(153, 102, 255, 0.7)',
            ];

            const borderColors = colors.map(color => color.replace('0.7', '1'));

            setChartData({
                labels: tags,
                datasets: [{
                    label: 'Amount (₹)',
                    data: scaledAmounts,
                    originalData: amounts,
                    backgroundColor: colors.slice(0, tags.length),
                    borderColor: borderColors.slice(0, tags.length),
                    borderWidth: 2,
                }],
            });
        }
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'This Month Stats by Tag',
                color: '#f472b6',
                font: { size: 16, weight: 'bold' },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const originalValue = context.dataset.originalData[context.dataIndex];
                        if (originalValue >= 1000000) return `₹${(originalValue / 1000000).toFixed(1)}M`;
                        if (originalValue >= 1000) return `₹${(originalValue / 1000).toFixed(1)}K`;
                        return `₹${originalValue.toFixed(2)}`;
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#ffffff',
                    callback: function(value) {
                        const originalValue = Math.pow(value, 2);
                        if (originalValue >= 1000000) return `₹${(originalValue / 1000000).toFixed(1)}M`;
                        if (originalValue >= 1000) return `₹${(originalValue / 1000).toFixed(1)}K`;
                        return `₹${originalValue.toFixed(0)}`;
                    },
                },
                grid: { color: '#444' },
            },
            x: {
                ticks: {
                    color: '#ffffff',
                    maxRotation: 45,
                    minRotation: 45,
                },
                grid: { color: '#444' },
            },
        },
    };

    if (loading) return <ComponentLoader />;
    if (error) return <div className="text-white text-center">Something went wrong</div>;

    return (
        <div className="h-full w-full">
            {data?.getCurrentMonthStatsByTag?.length > 0 ? (
                <Bar data={chartData} options={options} />
            ) : (
                <div className="text-white text-center">No data found 😶</div>
            )}
        </div>
    );
};

export default CurrMonthStatsByTagBar;