import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from "node-fetch";
import { setContext } from "apollo-link-context";

// hacia donde se conectará para obtener los datos
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_BACKEND_URL,
  fetch,
});

// Para modificar los headers
const authLink = setContext((_, { headers }) => {
  // Leer el storage almacenado
  const token = localStorage.getItem("token");
  // console.log(token);

  return {
    headers: {
      ...headers,
      //añadir nuevo header
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default client;
