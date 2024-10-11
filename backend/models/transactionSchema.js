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
        enum:["upi","cash","card"],
        required:true
    },
    category:{
        type:String,
        enum:["expense","saving","investment"],
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
    tag:{
        type:String,
        enum:[
            "Food & Dining",
            "Entertainment & Leisure",
            "Utilities & Bills",
            "Transportation & Fuel",
            "Groceries & Household",
            "Repairs & Maintenance",
            "Healthcare & Medical",
            "Travel & Vacation",
            "Shopping & Personal Care",
            "Others"
        ],
        required:true
    },
    date:{
        type:Date,
        required:true,
    }
},{timestamps:true});

const TRANSACTION=mongoose.model("transactions",transactionSchema);

export default TRANSACTION;