import React, { useState, useLayoutEffect, useContext, Suspense, lazy } from 'react';
import { Outlet, Navigate, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from 'src/utils/firebase';
import { CartContext } from 'src/context/CartContext';
import DashboardLayout from 'src/layouts/dashboard';

const AdminIndexPage = lazy(() => import('src/pages/app'));
const NonAdminIndexPage = lazy(() => import('src/pages/non-admin-index'));
const BlogPage = lazy(() => import('src/pages/blog'));
const UserPage = lazy(() => import('src/pages/user'));
const LoginPage = lazy(() => import('src/pages/login'));
const ProductsPage = lazy(() => import('src/pages/products'));
const Page404 = lazy(() => import('src/pages/page-not-found'));
const EventDetailsPage = lazy(() => import('src/pages/event-details'));
const CartPage = lazy(() => import('src/pages/cart'));

const dashboard = (
  <DashboardLayout>
    <Suspense>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export default function Router() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const { clearCart } = useContext(CartContext);

  useLayoutEffect(() => {
    const getUsers = async () => {
      onAuthStateChanged(auth, async (_user) => {
        if (_user) {
          const tokenResult = await getIdTokenResult(_user);
          setUser(_user);
          setRole(tokenResult.claims.role || 'user');
        } else {
          setUser(null);
          setRole(null);
          clearCart();
        }
      });
    };
    getUsers();
  }, [clearCart]);

  const renderRoutes = () => {
    if (user) {
      return (
        <>
          <Route element={dashboard}>
             <Route element={<ProductsPage />} index />
            <Route element={role === 'admin' ? <AdminIndexPage /> : <NonAdminIndexPage />} path="dashboard" />
            <Route element={<UserPage />} path="user" />
           
            <Route element={<BlogPage />} path="blog" />
            <Route element={<EventDetailsPage />} path="event/:id" />
            <Route element={<CartPage />} path="cart" />
          </Route>
          <Route element={<Navigate to="/" replace />} path="login" />
        </>
      );
    }
    return (
      <>
        <Route element={<Navigate to="/login" replace />} path="*" />
        <Route element={<LoginPage />} path="login" />
      </>
    );
  };

  return (
    <Routes>
      {renderRoutes()}
      <Route element={<Page404 />} path="404" />
      <Route element={<Navigate to="/404" replace />} path="*" />
    </Routes>
  );
}
