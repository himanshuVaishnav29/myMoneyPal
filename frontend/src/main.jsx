import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import GridBackground from './components/ui/GridBackground.jsx'
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(), 
  credentials:"include" //helps in sending cookies with every req
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GridBackground>

        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>

      </GridBackground>
    </BrowserRouter>
  </React.StrictMode>
)