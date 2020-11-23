import React from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Spinner from '../../components/Spinner';

const OBTENER_PRODUCTO = gql`
  query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
      nombre
      precio
      existencia
    }
  }
`;

const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
      id
      nombre
      existencia
      precio
    }
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

const EditarProducto = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  // console.log(id)

  // Consultar para obtener el producto
  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id,
    },
  });

  // Mutation para modificar el producto
  // const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO, {
    update(cache, { data: { actualizarProducto } }) {
      // Actualizar Productos
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });

      const productosActualizados = obtenerProductos.map((producto) =>
        producto.id === id ? actualizarProducto : producto
      );

      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerClientesVendedor: productosActualizados,
        },
      });

      cache.evict({ broadcast: false }); // To Warning => Cache data may be lost when replacing the obtenerCliente field of a Query object.

      // Actualizar Producto Actual
      cache.writeQuery({
        query: OBTENER_PRODUCTO,
        variables: { id },
        data: {
          obtenerProducto: actualizarProducto,
        },
      });
    },
  });

  // Schema de validación
  const schemaValidacion = Yup.object({
    nombre: Yup.string().required("The product name is required"),
    existencia: Yup.number()
      .required("An available quantity must be added")
      .positive("Negative numbers are not accepted")
      .integer("Existence must be integers"),
    precio: Yup.number()
      .required("The price is required")
      .positive("Negative numbers are not accepted"),
  });

  // console.log(data)
  // console.log(loading)
  // console.log(error)

  // if (loading) return "Loading...";
  // if (loading) return <Spinner />;
  {loading ? <Spinner/> : null }

  if (!data) {
    return "Action not allowed";
  }

  const actualizarInfoProducto = async (valores) => {
    // console.log(valores);
    const { nombre, existencia, precio } = valores;
    try {
      const { data } = await actualizarProducto({
        variables: {
          id,
          input: {
            nombre,
            existencia,
            precio,
          },
        },
      });
      // console.log(data);

      // Redirgir hacia productos
      router.push("/products");

      // Mostrar una alerta
      Swal.fire("Updated", "The product was successfully updated", "success");
    } catch (error) {
      console.log(error);
    }
  };

  const { obtenerProducto } = data;

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Edit Product</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            enableReinitialize
            initialValues={obtenerProducto}
            validationSchema={schemaValidacion}
            onSubmit={(valores) => {
              actualizarInfoProducto(valores);
            }}
          >
            {(props) => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombre"
                    >
                      Name
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="nombre"
                      type="text"
                      placeholder="Product Name"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                    />
                  </div>

                  {props.touched.nombre && props.errors.nombre ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.nombre}</p>
                    </div>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="existencia"
                    >
                      Available stock
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="existencia"
                      type="number"
                      placeholder="Available stock"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.existencia}
                    />
                  </div>

                  {props.touched.existencia && props.errors.existencia ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.existencia}</p>
                    </div>
                  ) : null}

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="precio"
                    >
                      Price
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="precio"
                      type="number"
                      placeholder="Price of the product"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.precio}
                    />
                  </div>

                  {props.touched.precio && props.errors.precio ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.precio}</p>
                    </div>
                  ) : null}

                  <input
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                    value="Save Changes"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarProducto;
