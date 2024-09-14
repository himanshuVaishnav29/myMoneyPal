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

