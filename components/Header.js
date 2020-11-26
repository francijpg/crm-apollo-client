import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
    }
  }
`;

const Header = () => {
  const router = useRouter();

  // query de apollo
  const { data, loading, error, client } = useQuery(OBTENER_USUARIO);

  // console.log(data)
  // console.log(loading)
  // console.log(error)

  // Proteger que no accedamos a data antes de tener resultados
  if (loading) return null;

  // Si no hay informacion (sin token o token no valido), redirigir al login
  if (!data) {
    return router.push("/login");
  }

  const { nombre, apellido } = data.obtenerUsuario;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    client.clearStore();
    router.push("/login");
  };

  const capitalize = (str, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
      match.toUpperCase()
    );

  return (
    <div className="sm:flex sm:justify-between mb-6">
      <p className="mr-2 mb-5 lg:mb-0">
        Hello: {capitalize(nombre)} {capitalize(apellido)}
      </p>

      <button
        onClick={() => cerrarSesion()}
        type="button"
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
      >
        Close Session
      </button>
    </div>
  );
};

export default Header;
