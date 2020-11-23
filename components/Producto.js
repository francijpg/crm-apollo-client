import React from "react";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import Router from "next/router";
import NumberFormat from "react-number-format";

const ELIMINAR_PRODUCTO = gql`
  mutation eliminarProducto($id: ID!) {
    eliminarProducto(id: $id)
  }
`;

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

const Producto = ({ producto }) => {
  const { nombre, precio, existencia, id } = producto;

  // Mutation para eliminar productos
  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache) {
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });

      cache.evict({ broadcast: false }); // To Warning => Cache data may be lost when replacing the obtenerProductos field of a Query object.

      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: obtenerProductos.filter(
            (productoActual) => productoActual.id !== id // Para retornar todos los id's diferentes al que se esta seleccionando (eliminando), quitando del nuevo arreglo el id eliminado.
          ),
        },
      });
    },
  });

  const confirmarEliminarProducto = () => {
    Swal.fire({
      title: "Do you want to delete this product?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, Cancel",
    }).then(async (result) => {
      if (result.value) {
        try {
          // eliminar producto de la bd
          const { data } = await eliminarProducto({
            variables: {
              id,
            },
          });

          // console.log(data);

          Swal.fire("Deleted", data.eliminarProducto, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarProducto = () => {
    Router.push({
      pathname: "/editproduct/[id]",
      query: { id },
    });
  };

  return (
    <tr>
      <td className="border px-4 py-2">{nombre} </td>
      <td className="border px-4 py-2">{existencia} units</td>
      <td className="border px-4 py-2 text-right">
        <NumberFormat
          value={precio}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
        />
      </td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
          onClick={() => confirmarEliminarProducto()}
        >
          Delete
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
          onClick={() => editarProducto()}
        >
          Edit
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
    </tr>
  );
};

export default Producto;
