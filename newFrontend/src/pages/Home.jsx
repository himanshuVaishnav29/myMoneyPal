
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
import { GET_TRANSACTIONS_BY_USER } from '../graphql/queries/transaction.query';

ChartJS.register(CategoryScale, LinearScale, BarElement,LogarithmicScale, Title, Tooltip, Legend);

const HomePage = ({ loggedInUser }) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState(''); 
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  const {data,loading,error}=useQuery(GET_TRANSACTIONS_BY_USER);


  useEffect(() => {
      if (data) {
          const transactions = data.getAllTransactionsByUser;
          const lastTransactions = transactions.slice(-4).reverse(); 
          setRecentTransactions(lastTransactions);
      }
  }, [data]);

    
  useEffect(() => {
    let expenses = 0;
    let investment = 0;
    let savings = 0;
    if (data && data.getAllTransactionsByUser ) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
  
      data.getAllTransactionsByUser.forEach((transaction) => {
        const transactionDate = new Date(parseInt(transaction.date)); 
        if ( transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear ) {
          if (transaction.category === 'expense') {
            expenses += transaction.amount;
          } else if (transaction.category === 'investment') {
            investment += transaction.amount;
          } else if (transaction.category === 'saving') {
            savings += transaction.amount;
          }
        }
      });
    }
    setTotalExpenses(expenses);
    setTotalInvestment(investment);
    setTotalSavings(savings);
  }, [data]);
  
  

  useEffect(() => {
    const fetchQuote = async () => {
      try { 
        const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=money', {
          headers: { 'X-Api-Key': import.meta.env.VITE_QUOTE_API_KEY}, 
        });
        // const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=money', {
        //   headers: { 'X-Api-Key': ''}, 
        // });
        const data = await response.json();
        if (data && data.length > 0) {
          setQuote(data[0].quote);
          setAuthor(data[0].author);
        }
      } catch (error) {
        console.error('Error fetching the quote:', error);
      }
    };

    fetchQuote();
  }, []);


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
    if (!loading && data?.getAllTransactionsByUser) {
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
  
      data?.getAllTransactionsByUser.forEach((transaction) => {
        if (tagAmounts[transaction.tag] !== undefined) {
          tagAmounts[transaction.tag] += transaction.amount;
        }
      });
  
    
      const filteredTags = Object.keys(tagAmounts).filter(tag => tagAmounts[tag] > 0);
      const filteredAmounts = filteredTags.map(tag => tagAmounts[tag]);
  
     
      setBarGraphData({
        labels: filteredTags,
        datasets: [
          {
            label: 'INR', 
            data: filteredAmounts,
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 99, 132, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
              'rgba(201, 203, 207, 0.5)',
              'rgba(255, 205, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
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
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data]);
  
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
    },
    scales: {
      y: {
        beginAtZero: true,
        // type: 'linear',
        type:'logarithmic',
        ticks: {
          color: '#ffffff', 
          callback: function (value) {
            if (value >= 1000000) return `${value / 1000000}M`;
            if (value >= 1000) return `${value / 1000}K`;
            return value;
          },
          autoSkip:false,
        },
        afterBuildTicks: function (scale) {
          const ticks = scale.ticks;
          scale.ticks = ticks.filter((tick, index) => {
            return index % 5 === 0 || tick.value === 1; 
          });
        },

        grid: {
          color: '#444', 
        },
      },
     
      x: {
        ticks: {
          color: '#ffffff', 
        },
      },
    },
    barThickness: (barGraphData.labels.length <= 3) ? 100 : undefined,
  };
  
  


  return (
    <div className="p-6 min-h-screen text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* hero Section */}
        <div className="col-span-1 md:col-span-3 form-Background rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Hey {formatName(loggedInUser?.fullName)},</h2>
            {/* <p className="text-pink-600">Today's Thought</p> */}
            <div className="text-gray-300 font-thin pr-5">
              <blockquote className="italic">"{quote}"</blockquote>
              <p className="text-right mt-2 font-thin">- {author}</p>
            </div>
            {/* <button className="bg-teal-500 text-white px-4 py-2 rounded">Download</button> */}
          </div>


          {/* <div className="card">
            <p className="time-text"><span>11:11</span><span class="time-sub-text">PM</span></p>
            <p className="day-text">Wednesday, June 15th</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" stroke-width="0" fill="currentColor" stroke="currentColor" className="moon"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path></svg>
          </div> */}



          <img src={loggedInUser?.profilePicture} alt="profilePicture" className="h-24 w-auto mt-4 md:mt-0" loading='lazy' />
        </div>

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
                              <p>{transaction.description.toUpperCase()}</p> |
                              <p>₹ {transaction.amount.toFixed(2)}</p> |
                              <p>{new Date(parseInt(transaction.date)).toLocaleDateString()}</p>
                          </div>
                          <div className="flex justify-between text-gray-300 text-sm">
                              <p>{transaction.paymentType=='upi'?"UPI":formatName(transaction.paymentType)}</p>
                              <p>{formatName(transaction.category)}</p>
                              {/* <p>{(transaction.location)?transaction.location:""}</p> */}

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


