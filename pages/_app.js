import "../styles/globals.css";
import "../styles/tailwind.css";
import { ApolloProvider } from "@apollo/client";
import client from "../config/apollo";
import PedidoState from "../context/pedidos/PedidoState";
import AlertState from "../context/alerts/alertState";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <AlertState>
        <PedidoState>
          <Component {...pageProps} />
        </PedidoState>
      </AlertState>
    </ApolloProvider>
  );
}

export default MyApp;
