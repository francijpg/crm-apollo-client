import React, { useContext } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import AlertContext from "../context/alerts/alertContext";
import Alert from "../components/Alert";
import Link from "next/link";

const NUEVA_CUENTA = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
    }
  }
`;

const Register = () => {
  const router = useRouter();
  const alertContext = useContext(AlertContext);
  const { alert, showAlert } = alertContext;

  // Mutation para crear nuevos usuarios
  const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

  // Validación del formulario
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("The Name is Required"),
      apellido: Yup.string().required("The last name is required"),
      email: Yup.string()
        .email("The email is not valid")
        .required("The email is required"),
      password: Yup.string()
        .required("The password cannot be empty")
        .min(6, "The password must be at least 6 characters long"),
    }),
    onSubmit: async (values) => {
      const { nombre, apellido, email, password } = values;

      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              password,
            },
          },
        });

        // Usuario creado correctamente
        showAlert(
          `The user ${data.nuevoUsuario.nombre} was created successfully.`,
          "alert-ok"
        );

        setTimeout(() => {
          // Redirigir usuario para iniciar sesión
          router.push("/login");
        }, 2000);
      } catch (error) {
        showAlert(error.message.replace("GraphQL error: ", ""), "alert-error");
      }
    },
  });

  return (
    <Layout>
      <Alert alert={alert} />
      <h1 className="text-center text-2xl text-white font-light">
        Create new account
      </h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
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
                placeholder="Enter your name"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                placeholder="Enter your last name"
                value={formik.values.apellido}
                onChange={formik.handleChange}
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
                htmlFor="email"
              >
                Email
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
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
                placeholder="Enter your password"
                value={formik.values.password.trim()}
                onChange={formik.handleChange}
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
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 text-white"
              value="sign up"
            />
            <Link href="/login">
              <a className="bg-gray-200 mt-3 p-2 flex justify-center uppercase font-bold hover:bg-gray-400">
                log in
              </a>
            </Link>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
