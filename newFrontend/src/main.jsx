import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { BrowserRouter } from "react-router-dom";

const uploadLink = createUploadLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: 'include'
});

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          authUser: {
            merge: false
          }
        }
      }
    }
  })
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
