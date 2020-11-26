import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import Spinner from "../components/Spinner";
import Pedido from "../components/pedidos/Pedido";

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        nombre
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;

const Orders = () => {
  const { data, loading, error } = useQuery(OBTENER_PEDIDOS);
  if (loading) return <Spinner />;
  const { obtenerPedidosVendedor } = data;

  // console.log(obtenerPedidosVendedor);
  // obtenerPedidosVendedor.map((order) => (
  //   console.log(order)
  // ));

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Orders</h1>

        <Link href="/neworder">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
            New Order
          </a>
        </Link>

        {obtenerPedidosVendedor.length === 0 ? (
          <p className="mt-5 text-center text-2xl">No orders yet</p>
        ) : (
          obtenerPedidosVendedor.map((pedido) => (
            <Pedido key={pedido.id} pedido={pedido} />
          ))
        )}
      </Layout>
    </div>
  );
};

export default Orders;
