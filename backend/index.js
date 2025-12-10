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
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { graphQLRateLimiter } from './middlewares/rateLimiter.js';

dotenv.config(); 
const app=express();
const PORT=(process.env.PORT)|| 8001;




// Global CORS configuration
const corsOptions = {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173", "https://my-money-pal-app.vercel.app"],
    credentials: true, 
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'Cookie', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Handle preflight requests
app.options('*', cors(corsOptions));
 
app.get("/monthlyReport",async(req,res)=>{
    try{
        // monthlyReportJob();
        const cronSecret = req.headers['cron_secret']; 
        console.log(req.headers['cron_secret']);
        if (cronSecret !== process.env.CRON_SECRET) {
            return res.json("INVALID JOB HEADER"); 
        }
       await sendMailAtFirstDayOfMonth();
    }catch(err){
        console.error("Error in /monthlyReport:", err);
        res.json({ message: "Mail not sent", error: err.message });
    }
});



//graphQl server
const GQLServer=new ApolloServer({
    typeDefs:mergedTypeDef, //schema's
    resolvers:mergedResolvers,
    csrfPrevention: false,
    cors: false, // Disable Apollo's CORS to use Express CORS
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
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    checkForAuthenticationCookie('token'),
    graphQLRateLimiter, 
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

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})


