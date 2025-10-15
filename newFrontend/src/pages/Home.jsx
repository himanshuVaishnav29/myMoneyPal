
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
          <div className="bg-red-500 text-white p-6 rounded-lg shadow">
            <p className="text-lg">Monthly Expense</p>
            <h2 className="text-3xl font-bold">
             ₹ {
                totalExpenses.toFixed(2)
              }
            </h2>
            <img src="./pngwing.com.png" alt="Graph" className="mt-4" />
          </div>

          

          {/* Savings This Month Section */}
          <div className="bg-green-600 text-white p-6 rounded-lg shadow">
            <p className="text-lg">Monthly Savings</p>
            <h2 className="text-3xl font-bold">₹ {totalSavings.toFixed(2)}</h2>
            <img src="./pngegg.png" alt="Graph" className="mt-4" />
          </div>

          {/* Invested Amount This Month Section */}
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
            <p className="text-lg">Monthly Investment</p>
            <h2 className="text-3xl font-bold">₹ {totalInvestment.toFixed(2)}</h2>
            <img src="./growingGraph.png" alt="Graph" className="mt-4" />
          </div>

          {/* RECENT TXN'S */}
          <div className="bg-cyan-900 p-4 rounded-lg shadow text-sm">
              <p className="text-lg font-semibold text-white">Recent Transactions</p>
              <div className="mt-4 space-y-2.5">
                  {recentTransactions?.map((transaction) => (
                      <div key={transaction._id} className="border-b border-gray-300 py-2 text-white">
                          <div className="flex justify-between">
                          <p>
                            {transaction.description.length >10
                              ? `${transaction.description.substring(0,8).toUpperCase()}...` 
                              : transaction.description.toUpperCase()}
                          </p>  |
                          <p>{transaction.paymentType=='upi'?"UPI":formatName(transaction.paymentType)}</p>
                          |
                          {/* <p>
                            ₹ {transaction.amount.toFixed(2).length >4
                              ? `${transaction.amount.toFixed(2).substring(0, 7)}...` 
                              : transaction.amount.toFixed(2)}
                          </p>  | */}
                              <p>{new Date(parseInt(transaction.date)).toLocaleDateString()}</p>
                          </div>
                          <div className="flex justify-between text-gray-300 text-sm">
                              <p>{formatName(transaction.category)}</p>
                              <p>₹ {transaction.amount.toFixed(2)}</p>

                          </div>
                      </div>
                  ))}

                  {recentTransactions && recentTransactions.length === 0 && (
                      <p className="text-gray-300">No recent transactions available.</p>
                  )}
              </div>
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


