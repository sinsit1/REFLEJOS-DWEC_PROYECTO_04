import React from 'react';

import { Outlet, Navigate } from "react-router-dom";


const ProtectedRoutes = () => {

  // esto recoje el token del localstorage.
  const usuario = localStorage.getItem('token');

  // si no hay token guardado, te manda a login
  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;