import { onAuthStateChanged } from '@firebase/auth';
import { lazy, Suspense, useLayoutEffect, useState } from 'react';
import { Outlet, Navigate, Route, Routes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { auth } from 'src/utils/firebase';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------
const dashboard = (
  <DashboardLayout>
    <Suspense>
      <Outlet />
    </Suspense>
  </DashboardLayout>
)

export default function Router() {
  const [user, setUser] = useState(null);

  useLayoutEffect(() => {
    const getUsers = () => {
      onAuthStateChanged(
        auth,
        (_user) => {
          setUser(_user);
        })
    }
    getUsers();
  }, [user]);

  // This checks if the user is logged in, otherwise it redirects to login.
  return (
    <Routes>
      {user ? (<>

        <Route element={dashboard}>
          <Route element={<IndexPage />} index />
          <Route element={<UserPage />} path='user' />
          <Route element={<ProductsPage />} path='products' />
          <Route element={<BlogPage />} path='blog' />
        </Route>
        <Route element={<Navigate to="/" replace />} path='login' />
      </>
      ) : (<>
        <Route element={<Navigate to="/login" replace />} path='*' />
        <Route element={<LoginPage />} path='login' />
      </>
      )}

      <Route element={<Page404 />} path='404' />
      <Route element={<Navigate to="/404" replace />} path='*' />
    </Routes>
  )
}
