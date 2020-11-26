import React, { useContext } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Alert from "../components/Alert";

// Contexts
import PedidoContext from "../context/pedidos/PedidoContext";
import AlertContext from "../context/alerts/alertContext";

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
    }
  }
`;

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

const NewOrder = () => {
  // Utilizar context y extraer sus funciones y valores
  const router = useRouter();
  const pedidoContext = useContext(PedidoContext);
  const alertContext = useContext(AlertContext);

  const { cliente, productos, total } = pedidoContext;
  const { alert, showAlert } = alertContext;

  // Mutation para crear un nuevo pedido actualizando el cache
  // const [nuevoPedido] = useMutation(NUEVO_PEDIDO);
  // const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
  //   update(cache, { data: { nuevoPedido } }) {
  //     const { obtenerPedidosVendedor } = cache.readQuery({
  //       query: OBTENER_PEDIDOS,
  //     });
  //     cache.writeQuery({
  //       query: OBTENER_PEDIDOS,
  //       data: {
  //         obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido],
  //       },
  //     });
  //   },
  // });
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data }) {
			if (!data) return;

      try {
        // Desestructuramos los datos del pedido creado.
        const {nuevoPedido: newOrder} = data

        const { obtenerPedidosVendedor: currentOrders } = cache.readQuery({
          query: OBTENER_PEDIDOS,
        });

        // Actualizar caché con nuevo pedido
        cache.writeQuery({
          query: OBTENER_PEDIDOS,
          data: {
            obtenerPedidosVendedor: [...currentOrders, newOrder],
          },
        });
      } catch (error) {
        console.log('La query OBTENER_PEDIDOS no está en caché');
      }
    },
  });

  const validarPedido = () => {
    // Uso de every para iterar los productos bajo una condicion, en este caso la cantidad seleccionada por producto
    return !productos.every((producto) => producto.cantidad > 0) ||
      total === 0 ||
      cliente.length === 0
      ? " opacity-50 cursor-not-allowed "
      : "";
  };

  const crearNuevoPedido = async () => {
    const { id } = cliente;

    // Remover lo no deseado de productos
    const pedido = productos.map(
      ({ __typename, existencia, ...producto }) => producto
    );

    console.log(pedido);
    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total,
            pedido,
          },
        },
      });
      // console.log(data);

      // Redireccionar
      router.push("/orders");

      // Mostrar alerta
      Swal.fire(
        "Registered",
        "The order was successfully registered",
        "success"
      );
    } catch (error) {
      showAlert(error.message.replace("GraphQL error: ", ""), "alert-error");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Create a new order</h1>

      <Alert alert={alert} />

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />

          <button
            type="button"
            className={` bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()} `}
            onClick={() => crearNuevoPedido()}
          >
            Register Order
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NewOrder;
