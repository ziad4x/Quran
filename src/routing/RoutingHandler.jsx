import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import SurahDetails from '../pages/SurahDetails'
function RoutingHandler() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
    },
    {
      path: '/surah/:id',
      element: <SurahDetails />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default RoutingHandler