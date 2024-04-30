import { onAuthStateChanged } from '@firebase/auth';
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { auth } from 'src/utils/firebase';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const [user, setUser] = useState();
  let homepage; let login;

  useLayoutEffect(() => {
    const getUsers = async () => {
      await onAuthStateChanged(
        auth,
        (_user) => {
          setUser(_user);
        })
    }
    getUsers();

  }, [user]);

  if (user) {
    homepage = (
      <DashboardLayout>
        <Suspense>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    )
    login = ((<Navigate to="/" />))
  }
  else {
    homepage = (<Navigate to="/login" />)
    login = (<LoginPage />)
  }


  const routes = useRoutes([
    {
      element: homepage,
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],

    },
    {
      path: 'login',
      element: login,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
