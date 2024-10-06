// import React, { useMemo, useEffect, useState } from 'react';
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from 'material-react-table';
// import { useQuery } from '@apollo/client';
// import { GET_TRANSACTIONS_BY_USER } from '../graphql/queries/transaction.query';

// const History = () => {
//   const { data, loading, error } = useQuery(GET_TRANSACTIONS_BY_USER);
//   const [transactionData, setTransactionData] = useState([]);
//   // console.log(data,"ge_txn-user");
//   // Populate transaction data once fetched
//   useEffect(() => {
//     if (data && data.getAllTransactionsByUser) {
//       setTransactionData(data.getAllTransactionsByUser);
//     }
//   }, [data]);

//   // Define columns for the transaction table
//   const columns = useMemo(() => [
//     {
//       accessorKey: 'description',
//       header: 'Description',
//       size: 200,
//     },
//     {
//       accessorKey: 'paymentType',
//       header: 'Payment Type',
//       size: 150,
//     },
//     {
//       accessorKey: 'category',
//       header: 'Category',
//       size: 150,
//     },
//     {
//       accessorKey: 'amount',
//       header: 'Amount',
//       size: 100,
//     },
//     {
//       accessorKey: 'location',
//       header: 'Location',
//       size: 200,
//     },
//     {
//       accessorKey: 'date',
//       header: 'Date',
//       Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
//       size: 150,
//     },
//   ], []);

//   // Use MaterialReactTable with memoized data and columns
//   const table = useMaterialReactTable({
//     columns,
//     data: transactionData,
//   });

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error fetching transactions</div>;

//   return (
//     // <div className="h-screen w-full flex justify-center items-center">
//     //   <div className="w-full max-w-screen-xl px-4">
//     //     <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Transaction History</h1>
//     //     <div className="p-6 rounded-lg shadow-lg">
//     //       <MaterialReactTable table={table} />
//     //     </div>
//     //   </div>
//     // </div>

//     <div className="min-h-screen w-full flex flex-col items-center py-8 bg-gray-100">
//   <div className="w-full max-w-6xl px-4">
//     <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Transaction History</h1>
//     <div className="bg-white p-6 rounded-lg shadow-md overflow-auto">
//       <MaterialReactTable table={table} />
//     </div>
//   </div>
// </div>

//   );
// };

// export default History;



//without update delete latest 

// import React, { useMemo, useEffect, useState } from 'react';
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from 'material-react-table';
// import { useQuery } from '@apollo/client';
// import { GET_TRANSACTIONS_BY_USER } from '../graphql/queries/transaction.query';

// const History = () => {
//   const { data, loading, error } = useQuery(GET_TRANSACTIONS_BY_USER);
//   const [transactionData, setTransactionData] = useState([]);
// console.log(data);
//   // Populate transaction data once fetched
//   useEffect(() => {
//     if (data && data.getAllTransactionsByUser) {
//       setTransactionData(data.getAllTransactionsByUser);
//     }
//   }, [data]);


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
//         return date.toLocaleDateString(); 
//       },
//     },
//   ], []);

//   const table = useMaterialReactTable({
//     columns,
//     data: transactionData,
//     enableColumnFilterModes: true, 
//     enableSorting: true, 
//   });

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error fetching transactions</div>;

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center py-8 bg-gray-100 overflow-x-hidden">
//       <div className="w-full max-w-6xl px-4">
//         <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Transaction History</h1>
//         <div className="bg-white p-6 rounded-lg shadow-md overflow-auto">
//           <MaterialReactTable table={table} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default History;







//trying to update delete



import React, { useMemo, useEffect, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_MONTH_STATS_BY_CATEGORY, GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE, GET_CURRENT_WEEK_STATS_BY_CATEGORY, GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE, GET_STATS_BY_CATEGORY, GET_STATS_BY_PAYMENT_TYPE, GET_TRANSACTIONS_BY_USER } from '../graphql/queries/transaction.query';
import { DELETE_TRANSACTION } from '../graphql/mutations/transaction.mutation';
import { useNavigate } from 'react-router-dom';
import { FaEdit} from 'react-icons/fa';
import { FaTrashAlt } from "react-icons/fa";
import toast from 'react-hot-toast';

const History = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS_BY_USER);
  const [transactionData, setTransactionData] = useState([]);
  const navigate = useNavigate();

 
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [
			{query: GET_STATS_BY_CATEGORY},
			{query:GET_CURRENT_WEEK_STATS_BY_CATEGORY},
			{query:GET_CURRENT_MONTH_STATS_BY_CATEGORY},
			{query:GET_STATS_BY_PAYMENT_TYPE},
			{query:GET_CURRENT_WEEK_STATS_BY_PAYMENT_TYPE},
			{query:GET_CURRENT_MONTH_STATS_BY_PAYMENT_TYPE}

		],
    onCompleted: () => toast.success('Transaction deleted successfully'),
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (data && data.getAllTransactionsByUser) {
      setTransactionData(data.getAllTransactionsByUser);
    }
  }, [data]);

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction({
          variables: {  transactionId: transactionId },
        });
        setTransactionData(prevData => prevData.filter(transaction => transaction._id !== transactionId));
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleUpdate = (transactionId) => {
    navigate(`/history/${transactionId}`);
  };


  const columns = useMemo(() => [
    {
      accessorKey: 'serialNumber',
      header: 'S/N',
      size: 50,
      enableSorting: false, 
      Cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      size: 200,
      enableSorting: false, 
    },
    {
      accessorKey: 'paymentType',
      header: 'Payment Type',
      size: 150,
      enableSorting: false, 
    },
    {
      accessorKey: 'category',
      header: 'Category',
      size: 150,
      enableSorting: false, 
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      size: 100,
      enableSorting: true, 
    },
    {
      accessorKey: 'location',
      header: 'Location',
      size: 200,
      enableSorting: false, 
    },
    {
      accessorKey: 'date',
      header: 'Date',
      size: 150,
      enableSorting: true, 
      Cell: ({ cell }) => {
        const timestamp = cell.getValue();
        const date = new Date(parseInt(timestamp));
        const formattedDate = date.toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          
        });
      
        return formattedDate;
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      size: 150,
      enableSorting: false,
      Cell: ({ row }) => (
        <div className="flex gap-3">
          <button
            onClick={() => handleUpdate(row.original._id)}  
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}  
            className="text-red-500 hover:text-red-700"
          >
            <FaTrashAlt />
          </button>
        </div>
      ),
    },
  ], []);

  // const table = useMaterialReactTable({
  //   columns,
  //   data: transactionData,
  //   enableColumnFilterModes: true, 
  //   enableSorting: true, 
  //   muiSelectCheckboxProps: {
  //     color: 'black', 
  //   },
  // });

  const table = useMaterialReactTable({
    columns,
    data: transactionData,
    enableColumnFilterModes: true, 
    enableSorting: true, 
    muiSelectCheckboxProps: {
      color: 'black', 
    },

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#1f5f5',  
        color: '#ffffff',         
      },
    },
 
    muiTableBodyProps: {
      sx: {
        backgroundColor: '#000000', 
        color: '#ffffff',           
      },
    },

    muiTableProps: {
      sx: {
        backgroundColor: '#000000',  
      },
    },
  });
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching transactions</div>;

  return (
    
    // <div className="min-h-screen flex flex-col items-center overflow-x-hidden">
    //   <h1 className="text-3xl font-bold text-center text-blue-600 ">Transaction History</h1>
    //   <div className="w-full max-w-6xl px-4 ">
        
    //     <div className="p-6 rounded-lg shadow-md overflow-auto scroller ">
    //       <MaterialReactTable
    //           table={table}  
              
    //       /> 
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen w-full flex flex-col items-center py-3 overflow-x-hidden">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">Transaction History</h1>
        
        {/* Container to handle overflow without disturbing other components */}
        <div className="w-full max-w-5xl px-4 ">
          {
            (transactionData?.length<=0)?
            <div className="p-6 rounded-lg overflow-x-auto w-full text-white">
              <center><h1 className='text-xl font-mono text-white'>No history found</h1></center>
            </div>
            :""
            
          }
           <div className="p-6 rounded-lg shadow-md thinScrollBar overflow-x-auto w-full">
              <MaterialReactTable
                table={table}
              />
            </div>
        </div>
    </div>
  

  );
};

export default History;
