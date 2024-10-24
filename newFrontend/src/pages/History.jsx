
// import React, { useMemo, useEffect, useState } from 'react';
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from 'material-react-table';
// import { useQuery, useMutation } from '@apollo/client';
// import { GET_CURRENT_MONTH_STATS_BY_CATEGORY, GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE, GET_CURRENT_WEEK_STATS_BY_CATEGORY, GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE, GET_STATS_BY_CATEGORY, GET_STATS_BY_PAYMENT_TYPE, GET_TRANSACTIONS_BY_USER } from '../graphql/queries/transaction.query';
// import { DELETE_TRANSACTION } from '../graphql/mutations/transaction.mutation';
// import { useNavigate } from 'react-router-dom';
// import { FaEdit} from 'react-icons/fa';
// import { FaTrashAlt } from "react-icons/fa";
// import toast from 'react-hot-toast';

// const History = () => {
//   const { data, loading, error } = useQuery(GET_TRANSACTIONS_BY_USER);
//   const [transactionData, setTransactionData] = useState([]);
//   const navigate = useNavigate();

 
//   const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    // refetchQueries: [
		// 	{query: GET_STATS_BY_CATEGORY},
    //   {query:GET_TRANSACTIONS_BY_USER},
		// 	{query:GET_CURRENT_WEEK_STATS_BY_CATEGORY},
		// 	{query:GET_CURRENT_MONTH_STATS_BY_CATEGORY},
		// 	{query:GET_STATS_BY_PAYMENT_TYPE},
		// 	{query:GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE},
		// 	{query:GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE}

// 		],
//     onCompleted: () => toast.success('Transaction deleted successfully'),
//     onError: (err) => toast.error(err.message),
//   });

//   useEffect(() => {
//     if (data && data.getAllTransactionsByUser) {
//       setTransactionData(data.getAllTransactionsByUser);
//     }
//   }, [data]);

//   const handleDelete = async (transactionId) => {
//     if (window.confirm('Are you sure you want to delete this transaction?')) {
//       try {
//         await deleteTransaction({
//           variables: {  transactionId: transactionId },
//         });
//         setTransactionData(prevData => prevData.filter(transaction => transaction._id !== transactionId));
//       } catch (error) {
//         console.error('Error deleting transaction:', error);
//       }
//     }
//   };

//   const handleUpdate = (transactionId) => {
//     navigate(`/history/${transactionId}`);
//   };


//   const columns = useMemo(() => [
//     {
//       accessorKey: 'serialNumber',
//       header: 'S/N',
//       size: 50,
//       enableSorting: false, 
//       Cell: ({ row }) => row.index + 1,
//     },
//     {
//       accessorKey: 'description',
//       header: 'Description',
//       size: 200,
//       enableSorting: false, 
//     },
//     {
//       accessorKey: 'paymentType',
//       header: 'Payment Type',
//       size: 150,
//       enableSorting: false, 
//     },
//     {
//       accessorKey: 'category',
//       header: 'Category',
//       size: 150,
//       enableSorting: false, 
//     },
//     {
//       accessorKey: 'amount',
//       header: 'Amount',
//       size: 100,
//       enableSorting: true, 
//     },
//     {
//       accessorKey: 'location',
//       header: 'Location',
//       size: 200,
//       enableSorting: false, 
//     },
//     {
//       accessorKey: 'date',
//       header: 'Date',
//       size: 150,
//       enableSorting: true, 
//       Cell: ({ cell }) => {
//         const timestamp = cell.getValue();
//         const date = new Date(parseInt(timestamp));
//         const formattedDate = date.toLocaleDateString('en-US', {
//           weekday: 'short',
//           day: 'numeric',
//           month: 'short',
//           year: 'numeric',
          
//         });
      
//         return formattedDate;
//       },
//     },
//     {
//       accessorKey: 'actions',
//       header: 'Actions',
//       size: 150,
//       enableSorting: false,
//       Cell: ({ row }) => (
//         <div className="flex gap-3">
//           <button
//             onClick={() => handleUpdate(row.original._id)}  
//             className="text-blue-500 hover:text-blue-700"
//           >
//             <FaEdit />
//           </button>
//           <button
//             onClick={() => handleDelete(row.original._id)}  
//             className="text-red-500 hover:text-red-700"
//           >
//             <FaTrashAlt />
//           </button>
//         </div>
//       ),
//     },
//   ], []);

//   // const table = useMaterialReactTable({
//   //   columns,
//   //   data: transactionData,
//   //   enableColumnFilterModes: true, 
//   //   enableSorting: true, 
//   //   muiSelectCheckboxProps: {
//   //     color: 'black', 
//   //   },
//   // });

//   const table = useMaterialReactTable({
//     columns,
//     data: transactionData,
//     enableColumnFilterModes: true, 
//     enableSorting: true, 
//     muiSelectCheckboxProps: {
//       color: 'black', 
//     },

//     muiTableHeadCellProps: {
//       sx: {
//         backgroundColor: '#1f5f5',  
//         color: '#ffffff',         
//       },
//     },
 
//     muiTableBodyProps: {
//       sx: {
//         backgroundColor: '#000000', 
//         color: '#ffffff',           
//       },
//     },

//     muiTableProps: {
//       sx: {
//         backgroundColor: '#000000',  
//       },
//     },
//   });
  

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error fetching transactions</div>;

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center py-3 overflow-x-hidden">
//         <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">Transaction History</h1>
        
     
//         <div className="w-full max-w-5xl px-4 ">
//           {
//             (transactionData?.length<=0)?
//             <div className="p-6 rounded-lg overflow-x-auto w-full text-white">
//               <center><h1 className='text-xl font-mono text-white'>No history found</h1></center>
//             </div>
//             :
//             <div className="p-6 rounded-lg shadow-md thinScrollBar overflow-x-auto w-full">
//               <MaterialReactTable
//                 table={table}
//               />
//             </div>
            
//           }
           
//         </div>
//     </div>
  

//   );
// };

// export default History;







// import React, { useEffect, useState } from 'react';
// import { useQuery, useMutation } from '@apollo/client';
// import { GET_TRANSACTIONS_BY_USER } from '../graphql/queries/transaction.query';
// import { DELETE_TRANSACTION } from '../graphql/mutations/transaction.mutation';
// import { useNavigate } from 'react-router-dom';
// import { FaEdit } from 'react-icons/fa';
// import { FaTrashAlt } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// const History = () => {
//   const { data, loading, error } = useQuery(GET_TRANSACTIONS_BY_USER);
//   const [transactionData, setTransactionData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredTransactions, setFilteredTransactions] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
//   const navigate = useNavigate();

//   const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
//     refetchQueries: [{ query: GET_TRANSACTIONS_BY_USER }],
//     onCompleted: () => toast.success('Transaction deleted successfully'),
//     onError: (err) => toast.error(err.message),
//   });

//   useEffect(() => {
//     if (data && data.getAllTransactionsByUser) {
//       setTransactionData(data.getAllTransactionsByUser);
//     }
//   }, [data]);

//   useEffect(() => {
//     let filtered = [...transactionData];

//     if (searchTerm) {
//         filtered = filtered.filter((transaction) =>
//             transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }

//     if (sortConfig !== null) {
//         filtered.sort((a, b) => {
//             if (sortConfig.key === 'amount' || sortConfig.key === 'date') {
//                 return sortConfig.direction === 'ascending' 
//                     ? a[sortConfig.key] - b[sortConfig.key] 
//                     : b[sortConfig.key] - a[sortConfig.key];
//             }
//             if (a[sortConfig.key] < b[sortConfig.key]) {
//                 return sortConfig.direction === 'ascending' ? -1 : 1;
//             }
//             if (a[sortConfig.key] > b[sortConfig.key]) {
//                 return sortConfig.direction === 'ascending' ? 1 : -1;
//             }
//             return 0;
//         });
//     }

//     setFilteredTransactions(filtered);
// }, [transactionData, searchTerm, sortConfig]);


//   const handleDelete = async (transactionId) => {
//     if (window.confirm('Are you sure you want to delete this transaction?')) {
//       try {
//         await deleteTransaction({ variables: { transactionId: transactionId } });
//         setTransactionData(prevData => prevData.filter(transaction => transaction._id !== transactionId));
//       } catch (error) {
//         console.error('Error deleting transaction:', error);
//       }
//     }
//   };

//   const handleUpdate = (transactionId) => {
//     navigate(`/history/${transactionId}`);
//   };

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error fetching transactions</div>;

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center py-3 overflow-x-hidden text-white">
//       <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">Transaction History</h1>
//       <input
//         type="text"
//         placeholder="Search by description..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="mb-4 p-2 border rounded"
//       />
//       <div className="w-full max-w-5xl px-4 ">
//         {filteredTransactions.length <= 0 ? (
//           <div className="p-6 rounded-lg overflow-x-auto w-full text-white">
//             <center><h1 className='text-xl font-mono text-white'>No history found</h1></center>
//           </div>
//         ) : (
//           <div className="p-5 rounded-lg shadow-md thinScrollBar overflow-x-auto w-full">
//             <div className="mt-6 overflow-x-auto">
//               <table className="min-w-full border border-gray-300">
//                 <thead className="bg-black text-neutral-300">
//                   <tr>
//                     <th className="p-2 border text-white" onClick={() => requestSort('serialNumber')}>S no.</th>
//                     <th className="p-2 border" onClick={() => requestSort('description')}>Description</th>
//                     <th className="p-2 border" onClick={() => requestSort('paymentType')}>Payment Type</th>
//                     <th className="p-2 border" onClick={() => requestSort('category')}>Category</th>
//                     <th className="p-2 border" onClick={() => requestSort('amount')}>Amount (₹)</th>
//                     <th className="p-2 border" onClick={() => requestSort('location')}>Location</th>
//                     <th className="p-2 border" onClick={() => requestSort('date')}>Date</th>
//                     <th className="p-2 border">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredTransactions.map((transaction, index) => (
//                     <tr key={transaction._id} className="text-center">
//                       <td className="p-2 border">{index + 1}</td>
//                       <td className="p-2 border">{transaction.description}</td>
//                       <td className="p-2 border">{transaction.paymentType.charAt(0).toUpperCase() + transaction.paymentType.slice(1)}</td>
//                       <td className="p-2 border">{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</td>
//                       <td className="p-2 border">₹ {transaction.amount}</td>
//                       <td className="p-2 border">{transaction.location || "N/A"}</td>
//                       <td className="p-2 border">
//                         {new Date(parseInt(transaction.date)).toLocaleDateString()}
//                       </td>
//                       <td className="p-2 border">
//                         <div className="flex gap-3">
//                           <button
//                             onClick={() => handleUpdate(transaction._id)}
//                             className="text-blue-500 hover:text-blue-700"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(transaction._id)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <FaTrashAlt />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default History;








import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_MONTH_STATS_BY_CATEGORY, GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE, GET_CURRENT_MONTH_STATS_BY_TAG, GET_CURRENT_WEEK_STATS_BY_CATEGORY, GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE, GET_CURRENT_WEEK_STATS_BY_TAG, GET_STATS_BY_CATEGORY, GET_STATS_BY_PAYMENT_TYPE, GET_STATS_BY_TAG, GET_TRANSACTIONS_BY_USER } from '../graphql/queries/transaction.query';
import { DELETE_TRANSACTION } from '../graphql/mutations/transaction.mutation';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaSortUp, FaSortDown } from 'react-icons/fa';
import toast from 'react-hot-toast';

const History = () => {
    const { data, loading, error } = useQuery(GET_TRANSACTIONS_BY_USER);
    const [transactionData, setTransactionData] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
    const [deleteTransactionId, setDeleteTransactionId] = useState(null); // For modal confirmation
    const [showModal, setShowModal] = useState(false); // For modal visibility
    const navigate = useNavigate();

    const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
        refetchQueries: [
          {query: GET_STATS_BY_CATEGORY},
          {query:GET_TRANSACTIONS_BY_USER},
          {query:GET_CURRENT_WEEK_STATS_BY_CATEGORY},
          {query:GET_CURRENT_MONTH_STATS_BY_CATEGORY},
          {query:GET_STATS_BY_PAYMENT_TYPE},
          {query:GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE},
          {query:GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE},
          {query:GET_STATS_BY_TAG},
          {query:GET_CURRENT_MONTH_STATS_BY_TAG},
          {query:GET_CURRENT_WEEK_STATS_BY_TAG},
        ],
        onCompleted: () => {
            toast.success('Transaction deleted successfully');
            setShowModal(false); 
        },
        onError: (err) => toast.error(err.message),
    });

    useEffect(() => {
        if (data && data.getAllTransactionsByUser) {
            setTransactionData(data.getAllTransactionsByUser);
        }
    }, [data]);

    useEffect(() => {
        let filtered = [...transactionData]; 

        // Sorting
        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                if (sortConfig.key === 'amount' || sortConfig.key === 'date') {
                    return sortConfig.direction === 'ascending'
                        ? a[sortConfig.key] - b[sortConfig.key]
                        : b[sortConfig.key] - a[sortConfig.key];
                }
                // Handle string sorting for other fields
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredTransactions(filtered);
    }, [transactionData, sortConfig]);

    const handleDelete = async () => {
        try {
            await deleteTransaction({ variables: { transactionId: deleteTransactionId } });
            setTransactionData(prevData => prevData.filter(transaction => transaction._id !== deleteTransactionId));
            setDeleteTransactionId(null); // Clear the transaction ID
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleUpdate = (transactionId) => {
        navigate(`/history/${transactionId}`);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching transactions</div>;

    return (
        <div className="min-h-screen w-full flex flex-col items-center py-3 overflow-x-hidden text-white">
            <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">Transaction History</h1>

            <div className="w-full max-w-5xl px-4 ">
                {filteredTransactions.length <= 0 ? (
                    <div className="p-6 rounded-lg overflow-x-auto w-full text-white">
                        <center><h1 className='text-xl font-mono text-white'>No history found</h1></center>
                    </div>
                ) : (
                    <div className="p-6 rounded-lg shadow-md thinScrollBar overflow-x-auto w-full">
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full border border-gray-300">
                                <thead className="bg-black text-neutral-300">
                                    <tr>
                                        <th className="p-2 border" onClick={() => requestSort('serialNumber')}>S no. {sortConfig.key === 'serialNumber' && (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />)}</th>
                                        <th className="p-2 border" onClick={() => requestSort('description')}>Description {sortConfig.key === 'description' && (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />)}</th>
                                        <th className="p-2 border" onClick={() => requestSort('paymentType')}>Payment Type {sortConfig.key === 'paymentType' && (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />)}</th>
                                        <th className="p-2 border" onClick={() => requestSort('category')}>Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />)}</th>
                                        <th className="p-2 border" onClick={() => requestSort('amount')}>Amount (₹) {sortConfig.key === 'amount' && (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />)}</th>
                                        <th className="p-2 border" onClick={() => requestSort('location')}>Location {sortConfig.key === 'location' && (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />)}</th>
                                        <th className="p-2 border" onClick={() => requestSort('date')}>Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />)}</th>
                                        <th className="p-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction, index) => (
                                        <tr key={transaction._id} className="text-center">
                                            <td className="p-2 border">{index + 1}</td>
                                            <td className="p-2 border">{transaction.description}</td>
                                            <td className="p-2 border">
                                                { 
                                                (transaction.paymentType==='upi')?"UPI":
                                                transaction.paymentType.charAt(0).toUpperCase() + transaction.paymentType.slice(1)
                                                }
                                            </td>
                                            <td className="p-2 border">{transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</td>
                                            <td className="p-2 border">₹ {transaction.amount}</td>
                                            <td className="p-2 border">{transaction.location || ""}</td>
                                            <td className="p-2 border">
                                                {new Date(parseInt(transaction.date)).toLocaleDateString()}
                                            </td>
                                            <td className="p-2 border">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleUpdate(transaction._id)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => { setShowModal(true); setDeleteTransactionId(transaction._id); }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-index: 1000 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm">
                    <div className="form-Background p-5 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p className='font-thin'>Are you sure you want to delete this transaction?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => { setShowModal(false); setDeleteTransactionId(null); }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
