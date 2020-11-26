import React, { useContext } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Alert from "../components/Alert";
import AlertContext from "../context/alerts/alertContext";
import Swal from "sweetalert2";
import NumberFormat from "react-number-format";

const NUEVO_CLIENTE = gql`
  mutation nuevoCliente($input: ClienteInput) {
    nuevoCliente(input: $input) {
      id
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`;

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

const NewCliente = () => {
  const router = useRouter();
  const alertContext = useContext(AlertContext);
  // Mensaje de alerta
  const { alert, showAlert } = alertContext;
  
  // Mutation para crear nuevos clientes
  const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
    update(cache, { data: { nuevoCliente } }) {
      if (cache.data.data.ROOT_QUERY.obtenerClientesVendedor) {
        // Obtener el objeto de cache que deseamos actualizar
        const { obtenerClientesVendedor } = cache.readQuery({
          query: OBTENER_CLIENTES_USUARIO,
        });

        // Reescribimos el cache ( el cache nunca se debe modificar )
        // cache.evict({ broadcast: false });
        cache.writeQuery({
          query: OBTENER_CLIENTES_USUARIO,
          data: {
            obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente],
          },
        });
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      empresa: "",
      email: "",
      telefono: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("The client's name is required"),
      apellido: Yup.string().required("The client's last name is required"),
      empresa: Yup.string().required("The company field is mandatory"),
      email: Yup.string()
        .email("The email is not valid")
        .required("The email cannot be empty"),
    }),
    onSubmit: async (valores) => {
      const { nombre, apellido, empresa, email, telefono } = valores;

      try {
        const { data } = await nuevoCliente({
          variables: {
            input: {
              nombre,
              apellido,
              empresa,
              email,
              telefono,
            },
          },
        });
        // console.log(data.nuevoCliente);
        
        // redireccionar hacia clientes
        router.push("/"); 

        Swal.fire(
          "Registered",
          "The new client was successfully registered",
          "success"
        );
      } catch (error) {
        showAlert(error.message.replace("GraphQL error: ", ""), "alert-error");
      }
    },
  });

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Register New Client</h1>

      <Alert alert={alert} />

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
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
                placeholder="Client Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
              />
            </div>

            {formik.touched.nombre && formik.errors.nombre ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.nombre}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Last Name
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="apellido"
                type="text"
                placeholder="Client lastname"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.apellido}
              />
            </div>

            {formik.touched.apellido && formik.errors.apellido ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.apellido}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="empresa"
              >
                Company
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="empresa"
                type="text"
                placeholder="Company name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.empresa}
              />
            </div>

            {formik.touched.empresa && formik.errors.empresa ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.empresa}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Client email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>

            {formik.touched.email && formik.errors.email ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.email}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="telefono"
              >
                Phone
              </label>

              <NumberFormat
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="telefono"
                type="tel"
                placeholder="Client phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telefono}
                format="+56 (9) ####-####"
              />
            </div>

            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value="register client"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewCliente;
