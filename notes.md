

```bash

#backend
npm install express  graphql @apollo/server @graphql-tools/merge bcryptjs dotenv passport mongoose

#frontend
npm install graphql @apollo/client react-router-dom react-icons react-hot-toast tailwind-merge @tailwindcss/aspect-ratio clsx chart.js react-chartjs-2 mini-svg-data-uri framer-motion

```



# API SETUP FOR FRONTEND

1) install apollo client package at frontend

2) in main.jsx file  
```bash
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(), 
  credentials:"include" //helps in sending cookies with every req
});
```

3) wrap App inside        
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
4) create a graphql folder inside src, and then mutations and queries folder inside it 



##ALL DEPENDENCIES
#backend
npm install express express-session graphql @apollo/server @graphql-tools/merge bcryptjs connect-mongodb-session dotenv graphql-passport passport mongoose

#frontend
npm install graphql @apollo/client react-router-dom react-icons react-hot-toast tailwind-merge @tailwindcss/aspect-ratio clsx chart.js react-chartjs-2 mini-svg-data-uri framer-motion





// {
//   "version": 2,
//   "builds": [
//     {
//       "src": "index.js",
//       "use": "@vercel/node"
//     }
//   ],
//   "routes": [
    
//     {
//         "src": "/(.*)",
//         "dest": "/" 
//     },
//     {
//       "src": "/graphql",
//       "methods": ["GET", "POST", "OPTIONS"],
//       "headers": {
//         "Access-Control-Allow-Origin": "https://my-money-pal-app.vercel.app/",
//         "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//         "Access-Control-Allow-Credentials": "true"
//       }
//     }
//   ]
// }

<!-- "crons": [
    {
      "path": "/api/cron",
      "schedule": "31 12 12 * *"
    }
  ] -->