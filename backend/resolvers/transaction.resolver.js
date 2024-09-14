import TRANSACTION from "../models/transactionSchema.js";
import { transactions } from "../testData/testData.js";

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
                console.log("userId",userId);
                const transactions=await TRANSACTION.find({userId:userId});
                console.log("getTxnsfun");
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
        } 
    },
    Mutation:{
        createTransaction:async(_,{input},{req,res})=>{
            try {
                // if(!req.user){
                //     throw new Error("Unauthenticated");
                // }
                console.log("curr",req.user);
                const {description,paymentType,category,amount,location,date}=input;
                if(!description || !paymentType || !category || !amount || !date){
                    throw new Error("Please provide all the fields");
                }
                console.log(req.user._id);
                const transaction= await TRANSACTION.create({
                    userId:req.user._id,
                    description:description,
                    paymentType:paymentType,
                    category:category,
                    amount:amount,
                    location:location,
                    date:date,
                });
                return transaction;
            } catch (error) {
                console.log("Error in createTransaction",error);
                throw new Error(error.message," ",error);
            }
        },
        updateTransaction:async(_,{input},context)=>{
            try {
                const {transactionId,description,paymentType,category,amount,location,date}=input;
                if(!description || !paymentType || !category || !amount || !date){
                    throw new Error("Please provide all the fields");
                }
                const updatedTransaction=await TRANSACTION.findByIdAndUpdate(transactionId,{
                    description:description,
                    paymentType:paymentType,
                    category:category,
                    amount:amount,
                    location:location,
                    date:date,
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
        }
    }
}
export default transactionResolver;