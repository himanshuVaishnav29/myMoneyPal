import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider, from } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error"; 
import { BrowserRouter } from "react-router-dom";
import toast from 'react-hot-toast'; 

const uploadLink = createUploadLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  }
});

// --- UPDATED ERROR LINK ---
const errorLink = onError(({ graphQLErrors, networkError }) => {
  
  // 1. Handle Rate Limiting (Network Error 429)
  if (networkError && networkError.statusCode === 429) {
    // Dismiss any existing toasts to prevent stacking
    toast.dismiss();
     const messages = [
        "Spamming the button won't make you richer. Trust me. 💸",
        "Your fingers are writing checks our server can't cash. Slow down! ✋",
        "Easy! Your taps are spending faster than your wallet. 💸😅",
        "Hold on! Your click budget just went bankrupt.",
        "You're being too enthusiastic. Try being lazy for a moment. 😴"
    ];
    
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    toast.error(randomMsg);
    return;
  }

  // 2. Handle GraphQL Errors (Validation, etc.)
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      // prevent duplicate toasts
      toast.error(message); 
    });
  }

  // 3. Handle Generic Network Errors (Server down, etc.)
  if (networkError && networkError.statusCode !== 429) {
      toast.error("Network error. Please check your connection.");
  }
});

const client = new ApolloClient({
  // Ensure 'errorLink' is FIRST in the array
  link: from([errorLink, authLink, uploadLink]), 
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
