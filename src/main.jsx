import React from 'react';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

import Login from './pages/Login';

import { createRoot } from 'react-dom/client';
import Home from './pages/Home';
import ProtectedRoutes from './routes/ProtectedRoute';
import Detail from './pages/Detail';
import Error from './pages/Error';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} ></Route>

      <Route path="/" element={<ProtectedRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/deportista/:sportsmanId" element={<Detail />} ></Route>
        <Route path="*" element={<Error />} />
      </Route>
    </>
  )
);

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);