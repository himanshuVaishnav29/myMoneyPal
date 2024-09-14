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

dotenv.config(); 
const app=express();
const PORT=(process.env.PORT)|| 8001;

const corsOptions = {
  origin: ['https://expense-tracker-app-xi-one.vercel.app'], // Frontend Vercel URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
};

// Apply CORS globally
app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json()); 
// app.use(cors());
// app.use(cookieParser());
// app.use(checkForAuthenticationCookie('token'));
 


const buildContext = (req,res) => {
    // const user = req.user;
    return {
        req,
        res,
        user:req.user
    };
};

//graphQl server
const GQLServer=new ApolloServer({
     
    typeDefs:mergedTypeDef, //schema's
    resolvers:mergedResolvers,
    // context: ({ req, res }) => buildContext(req,res)
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
    // cors({
    //     // origin:["http://localhost:3000", "http://127.0.0.1:3000"],
    //     origin:["https://expense-tracker-app-xi-one.vercel.app/"],
    //     credentials:true
    // }),
    cookieParser(),
    express.json(),
    checkForAuthenticationCookie('token'),
    expressMiddleware(GQLServer,{
        // context: ({ req, res }) =>buildContext(req,res),
        context: ({ req, res }) => ({
            req,
            res,
            user: req.user, // Ensure user is passed to context
        }),
    }
));

app.get('/',(req,res)=>{
    res.json({message:"Server running"});
});

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})


