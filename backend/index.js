import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDef from "./typeDefs/index.js";
import USER from './models/userSchema.js';
import TRANSACTION from './models/transactionSchema.js';
import cookieParser from 'cookie-parser';
import checkForAuthenticationCookie from './middlewares/checkForAuthentication.js';
import { sendMailAtFirstDayOfMonth } from './services/mailService.js';

dotenv.config(); 
const app=express();
const PORT=(process.env.PORT)|| 8001;




app.use(express.json()); 

//uncomment for local
// const corsOptions = {
//     origin: ["http://127.0.0.1:5173"],
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true, 
//   };  
//   app.use(cors(corsOptions));
// app.use(cookieParser());

// app.use(checkForAuthenticationCookie('token'));
 




//graphQl server
const GQLServer=new ApolloServer({
     
    typeDefs:mergedTypeDef, //schema's
    resolvers:mergedResolvers,
    context: ({ req, res }) => ({
        req,
        res,
        user: req.user, 
    }),
});


//starting the gql server
await GQLServer.start();

const connectDb=async()=>{
    try{
        mongoose
            .connect(process.env.MONGO_URI)
            .then(()=>console.log("MongoDB connected"))
    }catch(err){
        console.log("Error in connecting mongoDB",err);
    }
}
await connectDb();


app.use(
    '/graphql',

    //for local
    // cors({
    //   origin: "http://127.0.0.1:5173",
    //   credentials: true, 
    //   methods: ['GET', 'POST', 'OPTIONS'],
    //   allowedHeaders: ['Content-Type', 'Authorization','Set-Cookie', 'Cookie']
    // }),

    //for deployment
    cors({
      origin: "https://my-money-pal-app.vercel.app",
      credentials: true, 
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization','Set-Cookie', 'Cookie']
    }),
    
    cookieParser(),
    express.json(),
    checkForAuthenticationCookie('token'),
    expressMiddleware(GQLServer,{
 
        context: ({ req, res }) => ({
            req,
            res,
            user: req.user, 
        }),
    }
));

app.get('/',(req,res)=>{
    res.json({message:"Server running"});
});

app.get("/monthlyReport",async(req,res)=>{
    try{
        // monthlyReportJob();
        const cronSecret = req.headers['CRON_SECRET'];
        if(cronSecret!=process.env.CRON_SECRET){
            res.json("INVALID JOB CODE");
        }
       await sendMailAtFirstDayOfMonth();
    }catch(err){
        res.json("Mail Not sent caught in error",err);
        console.log("error in report",err);
    }finally{
        console.log("Mail sent successfully from /monthlyReport");
    }
    res.json("Mail sent successfully"); 
});


app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})


