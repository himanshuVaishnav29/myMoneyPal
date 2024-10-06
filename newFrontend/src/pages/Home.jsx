// import React from 'react'
// import CategoryStats from '../components/CategoryStats'
// import CurrWeekStatsByCategory from '../components/CurrWeekStatsByCategory'
// import CurrWeekStatsByPaymentType from '../components/CurrWeekStatsByPaymentType'
// import CurrMonthStatsByCategory from '../components/CurrMonthStatsByCategory'
// import PaymentTypeStats from '../components/PaymentTypeStats'
// import CurrMonthStatsByPaymentType from '../components/CurrMonthStatsByPaymentType'


// const Home = () => {
//   return (
//     <div className='p-5'>
//       <div className='grid md:grid:cols-2 xl:grid-cols-3 gap-4'>
//         <CategoryStats/>
//         <CurrWeekStatsByCategory/>
//         <CurrMonthStatsByCategory/>

//         <PaymentTypeStats/>
//         <CurrWeekStatsByPaymentType/>
//         <CurrMonthStatsByPaymentType/>
//       </div>
       
//     </div>
//   )
// }

// export default Home















// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// // Register the required components
// Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // Dummy data for the bar chart
// const data = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//   datasets: [
//     {
//       label: 'Ample',
//       data: [300, 200, 250, 400, 500, 150],
//       backgroundColor: 'rgba(54, 162, 235, 0.5)',
//     },
//     {
//       label: 'Pixel Admin',
//       data: [150, 300, 200, 300, 350, 200],
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//   ],
// };

// // Configuration for the chart
// const options = {
//   scales: {
//     y: {
//       beginAtZero: true,
//     },
//   },
// };

// const Home = ({loggedInUser}) => {
//   return (
//     <div className="p-10  min-h-screen">
//       {/* Top Section */}
//       <div className="grid grid-cols-3 gap-8 mb-10">
//         {/* Left Side - Download Section */}
//         <div className="bg-white rounded-lg p-6 shadow-lg col-span-2 flex items-center">
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Hey {loggedInUser?.fullName},</h2>
//             <p className="text-gray-500">Download Latest Report</p>
//             <button className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg">
//               Download
//             </button>
//           </div>
//           <div className="ml-auto">
//             {/* Image placeholder */}
//             <img src="https://avatar.iran.liara.run/public/boy?username=himanshu@gmail.com" alt="Illustration" className="w-32 h-auto" />
//           </div>
//         </div>

//         {/* Right Side - Sales Overview */}
//         <div className="bg-white rounded-lg p-6 shadow-lg">
//           <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
//           <div className="flex space-x-2 items-center mb-4">
//             <span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
//             <span className="text-gray-500 text-sm">Ample</span>
//             <span className="w-3 h-3 rounded-full bg-red-400 inline-block ml-4"></span>
//             <span className="text-gray-500 text-sm">Pixel Admin</span>
//           </div>
//           {/* Chart */}
//           <Bar data={data} options={options} />
//         </div>
//       </div>

//       {/* Bottom Section - Stats */}
//       <div className="grid grid-cols-3 gap-8">
//         {/* Earnings */}
//         <div className="bg-orange-200 rounded-lg p-6 shadow-lg text-white">
//           <h2 className="text-xl font-bold mb-2"></h2>
//           <p className="text-4xl font-bold">$93,438.78</p>
//           <p className="text-sm mt-2">Monthly Revenue</p>
//         </div>

//         {/* Monthly Sales */}
//         <div className="bg-white rounded-lg p-6 shadow-lg">
//           <h2 className="text-lg font-bold mb-2">Monthly Sales</h2>
//           <p className="text-4xl font-bold">3,246</p>
//           <p className="text-sm mt-2 text-gray-500">Total Sales</p>
//           {/* Add any extra content or chart here if needed */}
//         </div>

//         {/* Another Stat Section */}
//         <div className="bg-white rounded-lg p-6 shadow-lg">
//           <h2 className="text-lg font-bold mb-2">Other Stats</h2>
//           <div className="h-24 bg-blue-100 rounded-lg"></div> {/* Placeholder for other stat */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;





// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register the components for the chart
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const HomePage = () => {
//   // Dummy data for the Sales Overview chart
//   const data = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Ample',
//         data: [300, 400, 300, 500, 600, 200],
//         backgroundColor: 'rgba(56, 189, 248, 0.5)', // Teal background for "Ample"
//         borderColor: 'rgba(56, 189, 248, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Pixel Admin',
//         data: [200, 300, 400, 300, 500, 400],
//         backgroundColor: 'rgba(253, 165, 125, 0.5)', // Orange background for "Pixel Admin"
//         borderColor: 'rgba(253, 165, 125, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: false,
//       },
//     },
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* Download Section */}
//         <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
//           <div className="space-y-4">
//             <h2 className="text-2xl font-bold">Hey Julia,</h2>
//             <p className="text-gray-600">Download Latest Report</p>
//             <button className="bg-teal-500 text-white px-4 py-2 rounded">Download</button>
//           </div>
//           <img src="https://via.placeholder.com/150" alt="Download Report" className="h-24 w-auto mt-4 md:mt-0" />
//         </div>
        
//         {/* Earnings Section */}
//         <div className="bg-green-400 text-black p-6 rounded-lg shadow">
//           <p className="text-black-600">Monthly Savings</p>
//           <h2 className="text-3xl font-bold">Rs 500</h2>
//         </div>
        
//         {/* Monthly Sales Section */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <p className="text-lg">Monthly Sales</p>
//           <h2 className="text-3xl font-bold">3,246</h2>
//           <img src="https://via.placeholder.com/100x50" alt="Sales Graph" className="mt-4" />
//         </div>
        
//         {/* Sales Overview Section */}
//         <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
//           <div className="flex justify-between mb-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
//               <span>Ample</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
//               <span>Pixel Admin</span>
//             </div>
//           </div>
          
//           {/* Chart Section */}
//           <Bar data={data} options={options} />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default HomePage;







// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register components for the chart
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const HomePage = ({loggedInUser}) => {
//   // Dummy data for the Sales Overview chart
//   const data = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Ample',
//         data: [300, 400, 300, 500, 600, 200],
//         backgroundColor: 'rgba(56, 189, 248, 1)', // Teal background for "Ample"
//         borderColor: 'rgba(56, 189, 248, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Pixel Admin',
//         data: [200, 300, 400, 300, 500, 400],
//         backgroundColor: 'rgba(253, 165, 125, 1)', // Orange background for "Pixel Admin"
//         borderColor: 'rgba(253, 165, 125, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: false,
//       },
//     },
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//         {/* Download Section */}
//         <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
//           <div className="space-y-4">
//             <h2 className="text-2xl font-bold">Hey {loggedInUser?.fullName},</h2>
//             <p className="text-gray-600">Download Latest Report</p>
//             <button className="bg-teal-500 text-white px-4 py-2 rounded">Download</button>
//           </div>
//           <img src={loggedInUser?.profilePicture} alt="Download Report" className="h-24 w-auto mt-4 md:mt-0" />
//         </div>

//         {/* Financial Summary Row */}
//         <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Earnings Section */}
//           <div className="bg-red-400 text-white p-6 rounded-lg shadow">
//             <p className="text-lg">Monthly Expense</p>
//             <h2 className="text-3xl font-bold">₹ 93,438.78</h2>
//             {/* Dummy Graph */}
//             <img src="./pngwing.com.png" alt="Graph" className="mt-4" />
//           </div>

//           {/* Monthly Sales Section */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p className="text-lg">Monthly Sales</p>
//             <h2 className="text-3xl font-bold">₹ 3,246</h2>
//             <p className="text-gray-600">Sales this Month</p>
//             {/* Dummy Graph */}
//             <img src="" alt="Graph" className="mt-4" />
//           </div>

//           {/* Savings This Month Section */}
//           <div className="bg-green-400 text-white p-6 rounded-lg shadow">
//             <p className="text-lg">Money Saved</p>
//             <h2 className="text-3xl font-bold">₹ 2,340.56</h2>
//             {/* Dummy Graph */}
//             <img src="./pngegg.png" alt="Graph" className="mt-4" />
//           </div>

//           {/* Invested Amount This Month Section */}
//           <div className="bg-blue-400 text-white p-6 rounded-lg shadow">
//             <p className="text-lg">Invested this Month</p>
//             <h2 className="text-3xl font-bold">₹ 5,678.90</h2>
//             {/* Dummy Graph */}
//             <img src="./growingGraph.png" alt="Graph" className="mt-4" />
//           </div>
//         </div>

//         {/* Sales Overview Section */}
//         <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
//           <div className="flex justify-between mb-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
//               <span>Ample</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
//               <span>Pixel Admin</span>
//             </div>
//           </div>
          
//           {/* Chart Section */}
//           <Bar data={data} options={options} />
//         </div>
        
//       </div>
//     </div>
//   );
// };

// export default HomePage;





//latest new 

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS_BY_USER } from '../graphql/queries/transaction.query';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
          headers: { 'X-Api-Key': '3lz50qj/ONi4BZ/WHTtS9Q==AIJidJ0ZL2MMlSwS'}, 
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


  const barGraphData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ample',
        data: [300, 400, 300, 500, 600, 200],
        backgroundColor: 'rgba(56, 189, 248, 1)', 
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pixel Admin',
        data: [200, 300, 400, 300, 500, 400],
        backgroundColor: 'rgba(253, 165, 125, 1)', 
        borderColor: 'rgba(253, 165, 125, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* hero Section */}
        <div className="col-span-1 md:col-span-3 form-Background rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Hey {loggedInUser?.fullName},</h2>
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



          <img src={loggedInUser?.profilePicture} alt="profilePicture" className="h-24 w-auto mt-4 md:mt-0" />
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
          <div className="bg-cyan-900 p-6 rounded-lg shadow text-sm">
              <p className="text-lg font-semibold text-white">Recent Transactions</p>
              <div className="mt-4 space-y-2.5">
                  {recentTransactions?.map((transaction) => (
                      <div key={transaction._id} className="border-b border-gray-300 py-2 text-white">
                          <div className="flex justify-between">
                              <p>{transaction.description}</p> |
                              <p>₹ {transaction.amount.toFixed(2)}</p> |
                              <p>{new Date(parseInt(transaction.date)).toLocaleDateString()}</p>
                          </div>
                          <div className="flex justify-between text-gray-300 text-sm">
                              <p>{transaction.paymentType}</p>
                              <p>{transaction.category}</p>
                              <p>{(transaction.location)?transaction.location:""}</p>

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
        {/* <div className="col-span-1 md:col-span-3 p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
              <span>Ample</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>Pixel Admin</span>
            </div>
          </div>
          <Bar data={barGraphData} options={options} />
        </div> */}
        
      </div>
    </div>
  );
};

export default HomePage;


