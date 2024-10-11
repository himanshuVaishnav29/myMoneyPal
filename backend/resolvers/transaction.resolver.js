import TRANSACTION from "../models/transactionSchema.js";
import { transactions } from "../testData/testData.js";
import { Parser } from 'json2csv';

const transactionResolver={
    Query:{
        getAllTransactionsByUser:async(_,__,{req,res,user})=>{
            try {
                // console.log("curruser",user.email);
                // const currLogged=user;
                // console.log("User",currLogged);
                if(!user){
                    console.log("No user Logged in");
                    throw new Error("Unauthorized: User not logged in");
                }
                // const userId=await context.getUser()._id;
                const userId=user._id;
                // console.log("userId",userId);
                const transactions=await TRANSACTION.find({userId:userId});
                // console.log("getTxnsfun");
                // const transactions=await TRANSACTION.find({userId:req.user._id});

                return transactions;
            } catch (error) {
                console.log("Error in getAllTransactionsByUser",error);
                throw new Error(error," ",error.message);
            }
        },
        getTransaction:async(_,{transactionId})=>{
            try {
                const transaction=await TRANSACTION.findById({_id:transactionId});
                return transaction;
            } catch (error) {
                console.log("Error in getTransaction",error);
                throw new Error(error.message," ",error);
            }
        },

        getStatsByCategory:async(_,__,{req,res,user})=>{
            try {
                if(!user){
                   throw new Error("Unauthorized"); 
                }
                const userId=user._id;
                // console.log(userId,"here");
                const transactions=await TRANSACTION.find({userId});
                const categoryMap={};
                // const transactions = [
                // 	{ category: "expense", amount: 50 },
                // 	{ category: "expense", amount: 75 },
                // 	{ category: "investment", amount: 100 },
                // 	{ category: "saving", amount: 30 },
                // 	{ category: "saving", amount: 20 }
                // ];
                transactions.forEach((txn)=>{
                    if(!categoryMap[txn.category]){
                       categoryMap[txn.category]=0; 
                    }
                    categoryMap[txn.category] +=txn.amount;
                });
                // Convert the category totals into an array of objects
                // categoryMap = { expense: 125, investment: 100, saving: 50 }
                return Object.entries(categoryMap).map(([category,totalAmount])=>({category,totalAmount}) );
                // return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
            } catch (error) {
                console.log("Error in getCategoryStatistics",error);
                throw new Error(error.message," ",error);
            }
        },
        getCurrentWeekStatsByCategory:async (_, __, { req, res, user }) => {
            try {
              if (!user) {
                throw new Error("Unauthorized");
              }
          
              const userId = user._id;
          
              // Get the current date
              const now = new Date();
              const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
          
              // Calculate the start of the current week (assuming week starts on Sunday)
              const startOfWeek = new Date(now);
              startOfWeek.setHours(0, 0, 0, 0); // Set time to 00:00:00
              startOfWeek.setDate(now.getDate() - dayOfWeek);
          
              // Calculate the end of the current week
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              endOfWeek.setHours(23, 59, 59, 999); 
          
              // Query transactions created or updated during the current week
              const transactions = await TRANSACTION.find({
                userId,
                $or: [
                  { date: { $gte: startOfWeek, $lte: endOfWeek } }
                ],
              });
          
              const categoryMap = {};
          
              // Accumulate amounts per category
              transactions.forEach((txn) => {
                if (!categoryMap[txn.category]) {
                  categoryMap[txn.category] = 0;
                }
                categoryMap[txn.category] += txn.amount;
              });
          
            //   Convert the category totals into an array of objects
              return Object.entries(categoryMap).map(([category, totalAmount]) => ({
                category,
                totalAmount,
              }));
          
            } catch (error) {
              console.log("Error in getCurrentWeekStatsByCategory", error);
              throw new Error(error.message);
            }
        },
        getCurrentMonthStatsByCategory : async (_, __, { req, res, user }) => {
            try {
              if (!user) {
                throw new Error("Unauthorized");
              }
          
              const userId = user._id;
          
              // Get the current date
              const now = new Date();
          
              // Calculate the start of the current month
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              startOfMonth.setHours(0, 0, 0, 0); // Set time to 00:00:00
          
              // Calculate the end of the current month
              const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
              endOfMonth.setHours(23, 59, 59, 999); // Set time to 23:59:59 on the last day
          
              // Query transactions created or updated during the current month
              const transactions = await TRANSACTION.find({
                userId,
                $or: [
                  { date: { $gte: startOfMonth, $lte: endOfMonth } },
                ],
              });
          
              const categoryMap = {};
          
              // Accumulate amounts per category
              transactions.forEach((txn) => {
                if (!categoryMap[txn.category]) {
                  categoryMap[txn.category] = 0;
                }
                categoryMap[txn.category] += txn.amount;
              });
          
              // Convert the category totals into an array of objects
              return Object.entries(categoryMap).map(([category, totalAmount]) => ({
                category,
                totalAmount,
              }));
          
            } catch (error) {
              console.log("Error in getCurrentMonthStatsByCategory", error);
              throw new Error(error.message);
            }
        }, 

        getStatsByPaymentType :async (_, __, { req, res, user }) => {
            try {
              if (!user) {
                throw new Error("Unauthorized");
              }
              const userId = user._id;
              const transactions = await TRANSACTION.find({ userId });
              const paymentTypeMap = {};
          
              transactions.forEach((txn) => {
                if (!paymentTypeMap[txn.paymentType]) {
                  paymentTypeMap[txn.paymentType] = 0;
                }
                paymentTypeMap[txn.paymentType] += txn.amount;
              });
              return Object.entries(paymentTypeMap).map(([paymentType, totalAmount]) => ({
                paymentType,
                totalAmount,
              }));
          
            } catch (error) {
              console.log("Error in getStatsByPaymentType", error);
              throw new Error(error.message);
            }
        }, 
        getCurrentWeekStatsByPaymentType:async(_,__,{req,res,user})=>{
            try {
                if (!user) {
                  throw new Error("Unauthorized");
                }
            
                const userId = user._id;
            
                const now = new Date();
                const dayOfWeek = now.getDay(); 
            
               
                const startOfWeek = new Date(now);
                startOfWeek.setHours(0, 0, 0, 0); 
                startOfWeek.setDate(now.getDate() - dayOfWeek);
            
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999); 
            
                const transactions = await TRANSACTION.find({
                  userId,
                  $or: [
                    { date: { $gte: startOfWeek, $lte: endOfWeek } }
                  ],
                });
            
                const paymentTypeMap = {};
            
                transactions.forEach((txn) => {
                  if (!paymentTypeMap[txn.paymentType]) {
                    paymentTypeMap[txn.paymentType] = 0;
                  }
                  paymentTypeMap[txn.paymentType] += txn.amount;
                });
            
                return Object.entries(paymentTypeMap).map(([paymentType, totalAmount]) => ({
                  paymentType,
                  totalAmount,
                }));
            
            } catch (error) {
                console.log("Error in getCurrentWeekStatsByPaymentType", error);
                throw new Error(error.message);
            }
        },
        getCurrentMonthStatsByPaymentType:async(_,__,{req,res,user})=>{
             try {
                if (!user) {
                    throw new Error("Unauthorized");
                }

                const userId = user._id;

                const now = new Date();

                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                startOfMonth.setHours(0, 0, 0, 0);
            
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endOfMonth.setHours(23, 59, 59, 999); 

                const transactions = await TRANSACTION.find({
                userId,
                $or: [
                    { date: { $gte: startOfMonth, $lte: endOfMonth } }
                ],
                });

                const paymentTypeMap = {};

                transactions.forEach((txn) => {
                if (!paymentTypeMap[txn.paymentType]) {
                    paymentTypeMap[txn.paymentType] = 0;
                }
                paymentTypeMap[txn.paymentType] += txn.amount;
                });
 
                return Object.entries(paymentTypeMap).map(([paymentType, totalAmount]) => ({
                    paymentType,
                    totalAmount,
                }));

            } catch (error) {
                console.log("Error in getCurrentMonthStatsByPaymentType", error);
                throw new Error(error.message);
            }
        },

        getStatsByTag:async(_,__,{req,res,user})=>{
          try {
            if(!user){
              throw new Error("Unauthorized");
            }
            const userId = user._id;
            const transactions = await TRANSACTION.find({ userId });
            const tagsMap = {};
        
            transactions.forEach((txn) => {
              if (!tagsMap[txn.tag]) {
                tagsMap[txn.tag] = 0;
              }
              tagsMap[txn.tag] += txn.amount;
            });
            return Object.entries(tagsMap).map(([tag, totalAmount]) => ({
              tag,
              totalAmount,
            }));
          } catch (error) {
            console.log("Error in getStatsByTag", error);
            throw new Error(error.message);
          }
        },
        getCurrentWeekStatsByTag:async(_,__,{req,res,user})=>{
          try {
              if (!user) {
                throw new Error("Unauthorized");
              }
          
              const userId = user._id;
          
              const now = new Date();
              const dayOfWeek = now.getDay(); 
          
             
              const startOfWeek = new Date(now);
              startOfWeek.setHours(0, 0, 0, 0); 
              startOfWeek.setDate(now.getDate() - dayOfWeek);
          
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              endOfWeek.setHours(23, 59, 59, 999); 
          
              const transactions = await TRANSACTION.find({
                userId,
                $or: [
                  { date: { $gte: startOfWeek, $lte: endOfWeek } }
                ],
              });
          
              const tagMap = {};
          
              transactions.forEach((txn) => {
                if (!tagMap[txn.tag]) {
                  tagMap[txn.tag] = 0;
                }
                tagMap[txn.tag] += txn.amount;
              });
          
              return Object.entries(tagMap).map(([tag, totalAmount]) => ({
                tag,
                totalAmount,
              }));
          
          } catch (error) {
              console.log("Error in getCurrentWeekStatsByTag", error);
              throw new Error(error.message);
          }
        },
        getCurrentMonthStatsByTag:async(_,__,{req,res,user})=>{
          try {
             if (!user) {
                 throw new Error("Unauthorized");
             }

             const userId = user._id;

             const now = new Date();

             const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
             startOfMonth.setHours(0, 0, 0, 0);
         
             const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
             endOfMonth.setHours(23, 59, 59, 999); 

             const transactions = await TRANSACTION.find({
             userId,
             $or: [
                 { date: { $gte: startOfMonth, $lte: endOfMonth } }
             ],
             });

             const tagMap = {};

             transactions.forEach((txn) => {
             if (!tagMap[txn.tag]) {
                tagMap[txn.tag] = 0;
             }
             tagMap[txn.tag] += txn.amount;
             });

             return Object.entries(tagMap).map(([tag, totalAmount]) => ({
                 tag,
                 totalAmount,
             }));

          } catch (error) {
              console.log("Error in getCurrentMonthStatsByTag", error);
              throw new Error(error.message);
          }
        },

    },
    Mutation:{
        createTransaction:async(_,{input},{req,res})=>{
            try {
                // if(!req.user){
                //     throw new Error("Unauthenticated");
                // }
                // console.log("curr",req.user);
                const {description,paymentType,category,amount,location,date,tag}=input;
                if(!description || !paymentType || !category || !amount || !date || !tag){
                    throw new Error("Please provide all the fields");
                }
                // console.log(req.user._id);
                const transaction= await TRANSACTION.create({
                    userId:req.user._id,
                    description:description,
                    paymentType:paymentType,
                    category:category,
                    amount:amount,
                    location:location,
                    date:date, 
                    tag:tag
                });
                console.log(transaction,"createdtxn");
                return transaction;
            } catch (error) {
                console.log("Error in createTransaction",error);
                throw new Error(error.message," ",error);
            }
        },
        updateTransaction:async(_,{input},context)=>{
            try {
                const {transactionId,description,paymentType,category,amount,location,date ,tag}=input;
                if(!description || !paymentType || !category || !amount || !date || !tag){
                    throw new Error("Please provide all the fields");
                }
                const updatedTransaction=await TRANSACTION.findByIdAndUpdate(transactionId,{
                    description:description,
                    paymentType:paymentType,
                    category:category,
                    amount:amount,
                    location:location,
                    date:date,
                    tag:tag,
                },{new:true});
                return updatedTransaction;
            } catch (error) {
                console.log("Error in updateTransaction",error);
                throw new Error(error.message," ",error);
            }
        },
        deleteTransaction:async(_,{transactionId})=>{
            try {
                const deletedTransaction=await TRANSACTION.findByIdAndDelete(transactionId);
                if (!deletedTransaction) {
                    throw new Error("Transaction not found");
                }
                return deletedTransaction;
            } catch (error) {
                console.log("Error in deleteTransaction",error);
                throw new Error(error.message," ",error);
            }
        },
        userFilterRequest:async(_,{input},{req,res})=>{
          const { startDate, endDate, paymentType, category ,tag} = input;

          const filterCriteria = {
            userId: req.user._id,
          };
        
          if (startDate) {
            filterCriteria.date = { $gte: new Date(startDate) };
          }
          if (endDate) {
            filterCriteria.date = filterCriteria.date
              ? { ...filterCriteria.date, $lte: new Date(endDate) }
              : { $lte: new Date(endDate) };
          }
          if (paymentType) {
            filterCriteria.paymentType = paymentType;
          }
          if (category) {
            filterCriteria.category = category;
          }
          if (tag) {
            filterCriteria.tag = tag;
          }
          try {
            const transactions = await TRANSACTION.find(filterCriteria);
            return transactions || [];
          } catch (error) {
            throw new Error("Failed to filter transactions");
          }

        },
        exportCsv: async (_, { input }, { req, res }) => {
          try {
            const transactions = input;
        
            // Define the fields for the CSV
            const fields = [
              {label:'S. No.',
                value: (row, field, input) => transactions.indexOf(row) + 1
              },
              { label: 'Description', value: 'description'},
              { label: 'Payment Type', value: 'paymentType' },
              { label: 'Category', value: 'category' },
              { label: 'Amount (INR)', value: 'amount' },
              {label: 'Tag', value: 'tag'},
              { label: 'Location', value: 'location' },
              { label: 'Date', value: 'date' }
            ];
        
            // Initialize the parser
            const json2csvParser = new Parser({ fields });
        
            // Convert transactions to CSV
            const csvData = json2csvParser.parse(transactions);
        
            return csvData; // Return the CSV content as a string
          } catch (error) {
            throw new Error("Failed to export transactions: " + error.message);
          }
        }
      }
    }

export default transactionResolver;