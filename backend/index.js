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

app.use(express.json()); 
app.use(cors());
app.use(cookieParser());
app.use(checkForAuthenticationCookie());
 
//graphQl server
const GQLServer=new ApolloServer({
     
    typeDefs:mergedTypeDef, //schema's
    resolvers:mergedResolvers,
    context: ({ req, res }) => ({ req, res })
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


app.use('/graphql',expressMiddleware(GQLServer,{
    context: ({ req, res }) => ({ req, res })
}));

app.get('/',(req,res)=>{
    res.json({message:"Server running"});
});

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})



// intializeServer();
