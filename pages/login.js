import React, { useState, useContext } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import AlertContext from "../context/alerts/alertContext";
import Alert from "../components/Alert";
import Link from "next/link";

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const router = useRouter();
  // const [mensaje, guardarMensaje] = useState(null);
  const alertContext = useContext(AlertContext);
  const { alert, showAlert } = alertContext;
  // Mutation para crear nuevos usuarios en apollo
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("The email is not valid")
        .required("The email cannot be empty"),
      password: Yup.string().required("The password is mandatory"),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;
      // actions.resetForm();

      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        // console.log(data);
        // guardarMensaje("Authenticating...");
        showAlert("Authenticating...", "alert-info");
        // Guardar el token en localstorage
        setTimeout(() => {
          const { token } = data.autenticarUsuario;
          localStorage.setItem("token", token);
        }, 1000);

        // Redireccionar hacia clientes
        setTimeout(() => {
          // guardarMensaje(null);
          router.push("/");
        }, 2000);
      } catch (error) {
        showAlert(error.message.replace("GraphQL error: ", ""), "alert-error");
        // guardarMensaje(error.message.replace("GraphQL error: ", ""));
        // setTimeout(() => {
        //   guardarMensaje(null);
        // }, 3000);
      }
    },
  });

  // const mostrarMensaje = () => {
  //   return (
  //     <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
  //       <p>{mensaje}</p>
  //     </div>
  //   );
  // };

  return (
    <Layout>
      {/* {mensaje && mostrarMensaje()} */}
      <Alert alert={alert} />

      <h1 className="text-center text-2xl text-white font-light">Log In</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
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
                placeholder="User Email"
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
                htmlFor="password"
              >
                Password
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="User Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password.trim()}
              />
            </div>

            {formik.touched.password && formik.errors.password ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.password}</p>
              </div>
            ) : null}

            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:cursor-pointer hover:bg-gray-900"
              value="Log in"
            />
            <Link href="/register">
            <a className="bg-gray-200 mt-3 p-2 flex justify-center uppercase font-bold hover:bg-gray-400">
                sign up
              </a>
            </Link>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
