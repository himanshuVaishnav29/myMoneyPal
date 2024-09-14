//resolvers




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

