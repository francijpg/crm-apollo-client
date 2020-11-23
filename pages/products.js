import React from "react";
import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import Producto from "../components/Producto";
import Spinner from "../components/Spinner";

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
    }
  }
`;

const Products = () => {
  // Consultar los productos
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  // console.log(data);
  // console.log(loading);
  // console.log(error);

  // if (loading) return "Loading...";
  // {loading ? <Spinner/> : null }
  if (loading) return <Spinner />;

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Products</h1>

        <Link href="/newproduct">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm">
            New Product
          </a>
        </Link>

        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Name</th>
                <th className="w-1/5 py-2">Stock</th>
                <th className="w-1/5 py-2 text-right p-4">Price</th>
                <th className="w-1/5 py-2">Delete</th>
                <th className="w-1/5 py-2">Edit</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerProductos.map((producto) => (
                <Producto key={producto.id} producto={producto} />
                /* <tr key={producto.id} producto={producto}>
                <td className="border px-4 py-2">{producto.nombre} </td>
                <td className="border px-4 py-2">{producto.existencia} Piezas</td>
                <td className="border px-4 py-2">$ {producto.precio} </td>
                <td className="border px-4 py-2">
                  <button
                    type="button"
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    // onClick={() => confirmarEliminarProducto()}
                  >
                    Eliminar
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 ml-2"
                    >
                      <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    type="button"
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    // onClick={() => editarProducto()}
                  >
                    Editar
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 ml-2"
                    >
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                </td>
              </tr> */
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};

export default Products;
