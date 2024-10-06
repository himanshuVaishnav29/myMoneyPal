import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { BrowserRouter } from "react-router-dom";


const client = new ApolloClient({
  // uri: 'http://localhost:4000/graphql',
  uri:'https://api-my-money-pal.vercel.app/graphql',
  cache: new InMemoryCache(), 
  credentials:"include" //helps in sending cookies with every req
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
