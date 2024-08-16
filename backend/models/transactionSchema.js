import mongoose from "mongoose";

const transactionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    description:{
        type:String,
        required:true
    },
    paymentType:{
        type:String,
        enum:["UPI","Cash","Card"],
        required:true
    },
    category:{
        type:String,
        enum:["Expense","Saving","Investment"],
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        default:"Not Provided"
    },
    date:{
        type:Date,
        required:true,
    }
},{timestamps:true});

const TRANSACTION=mongoose.model("transactions",transactionSchema);

export default TRANSACTION;