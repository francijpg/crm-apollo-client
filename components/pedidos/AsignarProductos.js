import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";
import Spinner from "../Spinner";

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

const AsignarProductos = () => {
  // // state local del componente
  const [productos, setProductos] = useState([]);

  // // Context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const { agregarProducto, actualizarTotal } = pedidoContext;

  // consulta a la base de datos
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  // console.log(data);
  // console.log(loading);
  // console.log(error);

  useEffect(() => {
    if (productos === null) {
      setProductos([]);
      actualizarTotal();
    } else {
      // TODO : Función para pasar a PedidoState.js
      agregarProducto(productos);
      actualizarTotal();
    }
  }, [productos]);

  const seleccionarProducto = (producto) => {
    setProductos(producto);
  };

  if (loading) return <Spinner />;
  const { obtenerProductos } = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        2.- Select and search the products
      </p>
      <Select
        className="mt-3"
        options={obtenerProductos}
        onChange={(opcion) => seleccionarProducto(opcion)}
        isMulti={true}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) =>
          `${opciones.nombre} - ${opciones.existencia} availables`
        }
        placeholder="Search o Select the product"
        noOptionsMessage={() => "No results"}
      />
    </>
  );
};

export default AsignarProductos;
