import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDef from "./typeDefs/index.js";

dotenv.config();
const app=express();
const PORT=(process.env.PORT)|| 8001;
app.use(express.json()); 
app.use(cors());


//graphQl server
const GQLServer=new ApolloServer({
    
    typeDefs:mergedTypeDef, //schema's
    resolvers:mergedResolvers  
});


//starting the gql server
await GQLServer.start();

app.use('/graphql',expressMiddleware(GQLServer));

app.get('/',(req,res)=>{
    res.json({message:"Server running"});
});

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})



// intializeServer();
