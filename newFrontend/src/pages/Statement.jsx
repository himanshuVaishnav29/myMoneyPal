// import React, { useState, useEffect } from "react";
// import { useLazyQuery } from '@apollo/client';
// import { GET_TRANSACTIONS_BY_USER } from '../graphql/queries/transaction.query';

// const Statement = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [filteredTransactions, setFilteredTransactions] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [category, setCategory] = useState("");
//   const [paymentType, setPaymentType] = useState("");
//   const [searchPerformed, setSearchPerformed] = useState(false); // To track whether the search has been performed

//   const categories = ["expense", "saving", "investment"];
//   const paymentTypes = ["upi", "cash", "card"];

//   const [getTransactions, { data, loading, error }] = useLazyQuery(GET_TRANSACTIONS_BY_USER, {
//     fetchPolicy: 'network-only'
//   });

//   // Use effect to load data into transactions when search is performed
//   useEffect(() => {
//     if (data && data.getAllTransactionsByUser) {
//       setTransactions(data.getAllTransactionsByUser);
//     }
//   }, [data]);

//   const handleSearch = () => {
//     // Fetch transactions using the query
//     getTransactions();

//     // Apply filters after data is fetched
//     if (transactions.length > 0) {
//       const filtered = transactions.filter((transaction) => {
//         const isWithinDateRange =
//           (!startDate || new Date(parseInt(transaction.date)) >= new Date(startDate)) &&
//           (!endDate || new Date(parseInt(transaction.date)) <= new Date(endDate));

//         const isCategoryMatch = !category || transaction.category === category;
//         const isPaymentTypeMatch =
//           !paymentType || transaction.paymentType === paymentType;

//         return isWithinDateRange && isCategoryMatch && isPaymentTypeMatch;
//       });

//       setFilteredTransactions(filtered);
//       setSearchPerformed(true); // Set to true after search
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Transaction Statement</h1>

//       {/* Search Filters */}
//       <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Start Date</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">End Date</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">Category</label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2"
//           >
//             <option value="">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">Payment Type</label>
//           <select
//             value={paymentType}
//             onChange={(e) => setPaymentType(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2"
//           >
//             <option value="">All Payment Types</option>
//             {paymentTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Search Button */}
//       <button
//         onClick={handleSearch}
//         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//       >
//         Search
//       </button>

//       {/* Transactions Table */}
//       <div className="mt-6">
//         {searchPerformed ? (
//           filteredTransactions.length > 0 ? (
//             <table className="min-w-full bg-white border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-600">
//                   <th className="p-2 border">Description</th>
//                   <th className="p-2 border">Payment Type</th>
//                   <th className="p-2 border">Category</th>
//                   <th className="p-2 border">Amount</th>
//                   <th className="p-2 border">Location</th>
//                   <th className="p-2 border">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTransactions.map((transaction) => (
//                   <tr key={transaction._id} className="text-center">
//                     <td className="p-2 border">{transaction.description}</td>
//                     <td className="p-2 border">{transaction.paymentType}</td>
//                     <td className="p-2 border">{transaction.category}</td>
//                     <td className="p-2 border">{transaction.amount}</td>
//                     <td className="p-2 border">{transaction.location || "N/A"}</td>
//                     <td className="p-2 border">
//                       {new Date(parseInt(transaction.date)).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p className="text-center text-gray-500">No transactions found.</p>
//           )
//         ) : (
//           <p className="text-center text-gray-500">Please perform a search to view transactions.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Statement;



//without xl featuure 


// import React, { useState, useEffect } from "react";
// import { useMutation } from "@apollo/client";
// import { USER_FILTER_REQUEST } from "../graphql/mutations/transaction.mutation";

// const Statement = () => {
//   const [filteredTransactions, setFilteredTransactions] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [category, setCategory] = useState("");
//   const [paymentType, setPaymentType] = useState("");
//   const [searchPerformed, setSearchPerformed] = useState(false);

//   const categories = ["expense", "saving", "investment"];
//   const paymentTypes = ["upi", "cash", "card"];

//   const [filterTransactions, { data, loading, error }] = useMutation(USER_FILTER_REQUEST, {
//     fetchPolicy: "network-only",
//   });

//   useEffect(() => {
//     if (data && data.userFilterRequest) {
//       setFilteredTransactions(data.userFilterRequest);
//       setSearchPerformed(true); // Mark search as performed
//     }
//   }, [data]);

//   const handleSearch = () => {
//     filterTransactions({
//       variables: {
//         input: {
//           startDate,
//           endDate,
//           category,
//           paymentType,
//         },
//       },
//     });
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Transaction Statement</h1>

//       {/* Search Filters */}
//       <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Start Date</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">End Date</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">Category</label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2"
//           >
//             <option value="">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">Payment Type</label>
//           <select
//             value={paymentType}
//             onChange={(e) => setPaymentType(e.target.value)}
//             className="w-full border border-gray-300 rounded-md p-2"
//           >
//             <option value="">All Payment Types</option>
//             {paymentTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Search Button */}
//       <button
//         onClick={handleSearch}
//         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//       >
//         Search
//       </button>
      

//       {/* Transactions Table */}
//       <div className="mt-6 overflow-x-auto">
//         {loading && <p className="text-center text-gray-500">Loading...</p>}
//         {error && <p className="text-center text-red-500">Error loading data.</p>}
//         {searchPerformed && filteredTransactions.length > 0 ? (
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead className="bg-gray-200 text-gray-600">
//               <tr className="bg-gray-200 text-gray-600">
//                 <th className="p-2 border">Description</th>
//                 <th className="p-2 border">Payment Type</th>
//                 <th className="p-2 border">Category</th>
//                 <th className="p-2 border">Amount</th>
//                 <th className="p-2 border">Location</th>
//                 <th className="p-2 border">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTransactions.map((transaction) => (
//                 <tr key={transaction._id} className="text-center">
//                   <td className="p-2 border">{transaction.description}</td>
//                   <td className="p-2 border">{transaction.paymentType}</td>
//                   <td className="p-2 border">{transaction.category}</td>
//                   <td className="p-2 border">{transaction.amount}</td>
//                   <td className="p-2 border">{transaction.location || "N/A"}</td>
//                   <td className="p-2 border">
//                     {new Date(parseInt(transaction.date)).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           searchPerformed && <p className="text-center text-gray-500">No transactions found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Statement;




import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { USER_FILTER_REQUEST, EXPORT_AS_CSV } from "../graphql/mutations/transaction.mutation";
import { saveAs } from "file-saver";

const Statement = () => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const categories = ["expense", "saving", "investment"];
  const paymentTypes = ["upi", "cash", "card"];

  const [filterTransactions, { data, loading, error }] = useMutation(USER_FILTER_REQUEST, {
    fetchPolicy: "network-only",
  });

  const [exportCsv, { data: exportData, loading: exportLoading, error: exportError }] = useMutation(EXPORT_AS_CSV);

  useEffect(() => {
    if (data && data.userFilterRequest) {
      setFilteredTransactions(data.userFilterRequest);
      setSearchPerformed(true);
    }
  }, [data]);

  const handleSearch = () => {
    filterTransactions({
      variables: {
        input: {
          startDate,
          endDate,
          category,
          paymentType,
        },
      },
    });
  };

  // const handleDownload = async () => {
  //   try {
  //     const result = await exportCsv({
  //       variables: {
  //         input: filteredTransactions, // Passing filtered data for CSV generation
  //       },
  //     });

  //     // Assuming the server returns the CSV content as a string
  //     const blob = new Blob([result.data.exportCsv], { type: "text/csv;charset=utf-8;" });
  //     saveAs(blob, "transactions.csv"); // Triggering download
  //   } catch (err) {
  //     console.error("Error downloading CSV:", err);
  //   }
  // };

  //removing typename, modifying date and other fields for csv
  function cleanInput(transactions) {

    return transactions.map(transaction => {
      const {__typename, date, paymentType, category, ...cleanTransaction } = transaction;
      cleanTransaction.date = new Date(parseInt(date)).toLocaleDateString();
      cleanTransaction.paymentType = paymentType.charAt(0).toUpperCase() + paymentType.slice(1);
      cleanTransaction.category = category.charAt(0).toUpperCase() + category.slice(1);

      return cleanTransaction;
    });
  }
  const cleanedTransactions = cleanInput(filteredTransactions);
  const handleDownload = async () => {
    try {

      const result = await exportCsv({
        variables: {
          input: cleanedTransactions, 
        },
      });
  
      const blob = new Blob([result.data.exportCsv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${new Date().toLocaleDateString().replace(/\//g, '-')}-Transactionstatement.csv`);
    } catch (err) {
      console.error("Error downloading CSV:", err);
    }
  };
  

  return (
    <div className="container mx-auto p-4 text-white">
      <center>
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">Transaction Statement</h1>
      </center>
      {/* Search Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 ">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 bg-transparent rounded-md p-2 hover:cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2  bg-transparent hover:cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 bg-transparent hover:cursor-pointer"
          >
            <option value="" className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 bg-transparent hover:cursor-pointer"
          >
            <option value="" className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">All Payment Types</option>
            {paymentTypes.map((type) => (
              <option key={type} value={type} className="bg-gray-800 text-white hover:bg-gray-700 hover:cursor-pointer">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-between">
        
          {/* <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Search
          </button> */}





          
  <div className="relative group">
    <button
      className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
      onClick={handleSearch}   
    >
      <span
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      ></span>

      <span className="relative block px-6 py-3 rounded-xl bg-gray-950">
        <div className="relative flex items-center space-x-2">
          <span className="transition-all duration-500 group-hover:translate-x-1">Search</span>
          <svg
            className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
            data-slot="icon"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
      </span>
    </button>
  </div>




          {searchPerformed && filteredTransactions.length > 0 && (
            <button
              onClick={handleDownload}
              className="ml-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Download as Excel
            </button>
          )}
      </div>
      {/* Transactions Table */}
      <div className="mt-6 overflow-x-auto">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">Error loading data.</p>}
        {searchPerformed && filteredTransactions.length > 0 ? (
          <table className="min-w-full  border border-gray-300">
            <thead className="bg-black text-neutral-300">
              <tr>
                <th className="p-2 border">S no.</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Payment Type</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Amount (₹)</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction,index) => (
                <tr key={transaction._id} className="text-center">
                  <td className="p-2 border">{index+1}</td>
                  <td className="p-2 border">{transaction.description}</td>
                  <td className="p-2 border">{transaction.paymentType.charAt(0).toUpperCase() + transaction.paymentType.slice(1)}</td>
                  <td className="p-2 border">{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</td>
                  <td className="p-2 border">₹ {transaction.amount}</td>
                  <td className="p-2 border">{transaction.location || "N/A"}</td>
                  <td className="p-2 border">
                    {new Date(parseInt(transaction.date)).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          searchPerformed && <p className="text-center text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Statement;
