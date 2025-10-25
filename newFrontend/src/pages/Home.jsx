
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {formatName } from '../helpers/helperFunctions';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_SUMMARY } from '../graphql/queries/dashboard.query';

ChartJS.register(CategoryScale, LinearScale, BarElement,LogarithmicScale, Title, Tooltip, Legend);

const HomePage = ({ loggedInUser }) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState(''); 
  const [quoteLoading,setQuoteLoading]=useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  const {data,loading,error}=useQuery(GET_DASHBOARD_SUMMARY);


  useEffect(() => {
    if (!loading && data?.getDashboardSummary) {
      const summary = data.getDashboardSummary;
      setTotalExpenses(summary.totalExpenses);
      setTotalSavings(summary.totalSavings);
      setTotalInvestment(summary.totalInvestment);
      setRecentTransactions(summary.recentTransactions.slice(0, 4));
    }
  }, [data, loading]);
  
  

  // useEffect(() => {
  //   const fetchQuote = async () => {
  //     try { 
  //       setQuoteLoading(true);
  //       const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=money', {
  //         headers: { 'X-Api-Key': import.meta.env.VITE_QUOTE_API_KEY}, 
  //       });
  //       // const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=money', {
  //       //   headers: { 'X-Api-Key': ''}, 
  //       // });
  //       const data = await response.json();
  //       if (data && data.length > 0) {
  //         setQuote(data[0].quote);
  //         setAuthor(data[0].author);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching the quote:', error);
  //     }finally{
  //       setQuoteLoading(false);
  //     }
  //   };

  //   fetchQuote();
  // },[]);
 

  

  const [barGraphData, setBarGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: '', 
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });
  
  useEffect(() => {
    if (!loading && data?.getDashboardSummary) {
      const tagAmounts = {
        'Food & Dining': 0,
        'Entertainment & Leisure': 0,
        'Utilities & Bills': 0,
        'Transportation & Fuel': 0,
        'Groceries & Household': 0,
        'Repairs & Maintenance': 0,
        'Healthcare & Medical': 0,
        'Travel & Vacation': 0,
        'Shopping & Personal Care': 0,
        'Others': 0,
      };
  
      data.getDashboardSummary.tagStats.forEach((tagStat) => {
        if (tagAmounts[tagStat.tag] !== undefined) {
          tagAmounts[tagStat.tag] = tagStat.totalAmount;
        }
      });
  
      const filteredTags = Object.keys(tagAmounts).filter(tag => tagAmounts[tag] > 0);
      const filteredAmounts = filteredTags.map(tag => tagAmounts[tag]);
      const scaledAmounts = filteredAmounts.map(amount => Math.sqrt(amount));
  
      setBarGraphData({
        labels: filteredTags,
        datasets: [{
          label: 'INR', 
          data: scaledAmounts,
          originalData: filteredAmounts,
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(201, 203, 207, 0.7)',
            'rgba(255, 205, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ].slice(0, filteredTags.length), 
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ].slice(0, filteredTags.length),
          borderWidth: 2,
        }],
      });
    }
  }, [data, loading]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, 
        labels: {
          color: '#ffffff',
        },
      },
      title: {
        display: true,
        text: 'Your spendings by Tags',
        color: '#ffffff', 
        font: {
          size: 18,
        },
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
        type: 'linear',
        ticks: {
          color: '#ffffff',
          callback: function (value) {
            const originalValue = Math.pow(value, 2);
            if (originalValue >= 1000000) return `₹${(originalValue / 1000000).toFixed(1)}M`;
            if (originalValue >= 1000) return `₹${(originalValue / 1000).toFixed(1)}K`;
            return `₹${originalValue.toFixed(0)}`;
          },
        },
        grid: {
          color: '#444', 
        },
      },
      x: {
        ticks: {
          color: '#ffffff',
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    barThickness: (barGraphData.labels.length <= 3) ? 100 : undefined,
  };
  
  


  return (
    <div className="p-6 min-h-screen text-white mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* hero Section */}
        {/* <div className="col-span-1 md:col-span-3 form-Background rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Hey {formatName(loggedInUser?.fullName)},</h2>
            {quoteLoading ? ( 
                <div className="loader">.......</div>
            ) : (
              <div className="text-gray-300 font-thin pr-5">
                <blockquote className="italic">"{quote}"</blockquote>
                <p className="text-right mt-2 font-thin">- {author}</p>
              </div>
            )}

          </div>

          <img src={loggedInUser?.profilePicture} alt="profilePicture" className="h-24 w-auto mt-4 md:mt-0" loading='lazy' />
        </div> */}

        {/* Financial Summary Row */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Earnings Section */}
          <div className="bg-gradient-to-br from-red-500 via-red-500 to-red-700 text-white p-6 rounded-lg shadow">
            <p className="text-lg">Monthly Expense</p>
            <h2 className="text-3xl font-bold">
             ₹ {
                totalExpenses.toFixed(2)
              }
            </h2>
            <img src="./pngwing.com.png" alt="Graph" className="mt-4" />
          </div>

          

          {/* Savings This Month Section */}
          <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white p-6 rounded-lg shadow">
            <p className="text-lg">Monthly Savings</p>
            <h2 className="text-3xl font-bold">₹ {totalSavings.toFixed(2)}</h2>
            <img src="./pngegg.png" alt="Graph" className="mt-4" />
          </div>

          {/* Invested Amount This Month Section */}
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-6 rounded-lg shadow">
            <p className="text-lg">Monthly Investment</p>
            <h2 className="text-3xl font-bold">₹ {totalInvestment.toFixed(2)}</h2>
            <img src="./growingGraph.png" alt="Graph" className="mt-4" />
          </div>


          {/* RECENT TRANSACTIONS CARD */}
          <div className="bg-gradient-to-br from-cyan-900 to-slate-900 p-6 rounded-2xl shadow-xl border border-cyan-800/40 text-sm backdrop-blur-md">
            <p className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              Recent Transactions
            </p>

            {recentTransactions?.length > 0 ? (
              <div className="divide-y divide-gray-700/40">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="py-3 px-2 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-cyan-800/30 transition-all duration-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {transaction.description.length > 15
                          ? `${transaction.description.substring(0, 13).toUpperCase()}...`
                          : transaction.description.toUpperCase()}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(parseInt(transaction.date)).toLocaleDateString()} •{" "}
                        {formatName(transaction.category)}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end mt-2 sm:mt-0">
                      <p
                        className={`text-sm font-semibold ${
                          transaction.amount < 0 ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        ₹ {transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-gray-300 text-xs">
                        {transaction.paymentType === "upi"
                          ? "UPI"
                          : formatName(transaction.paymentType)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-6">
                No recent transactions available.
              </p>
            )}
          </div>




        </div>

        {/* TAG GRAPH Section */}
        <div className="col-span-1 md:col-span-3 p-6 rounded-lg shadow text-white">
           
            <div className='hidden md:block' style={{height:'50vh', width:'100%'}}>
            {barGraphData && barGraphData.labels.length > 0 && (
              <Bar data={barGraphData} options={options} />
            )}
          </div>
        </div>
        
      </div>


      
    </div>
  );
};

export default HomePage;


