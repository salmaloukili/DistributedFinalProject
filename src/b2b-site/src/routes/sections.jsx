



// import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
// import { lazy, Suspense, useLayoutEffect, useState } from 'react';
// import { Outlet, Navigate, Route, Routes } from 'react-router-dom';

// import DashboardLayout from 'src/layouts/dashboard';
// import { auth } from 'src/utils/firebase';

// export const AdminIndexPage = lazy(() => import('src/pages/app'));
// export const NonAdminIndexPage = lazy(() => import('src/pages/non-admin-index')); // Separate component for non-admin index
// export const BlogPage = lazy(() => import('src/pages/blog'));
// export const UserPage = lazy(() => import('src/pages/user'));
// export const LoginPage = lazy(() => import('src/pages/login'));
// export const ProductsPage = lazy(() => import('src/pages/products'));
// export const Page404 = lazy(() => import('src/pages/page-not-found'));
// export const EventDetailsPage = lazy(() => import('src/pages/event-details'));

// const dashboard = (
//   <DashboardLayout>
//     <Suspense>
//       <Outlet />
//     </Suspense>
//   </DashboardLayout>
// );

// export default function Router() {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);

//   useLayoutEffect(() => {
//     const getUsers = async () => {
//       onAuthStateChanged(auth, async (_user) => {
//         if (_user) {
//           const tokenResult = await getIdTokenResult(_user);
//           setUser(_user);
//           setRole(tokenResult.claims.role || 'user'); // Default role to 'user' if not set
//         } else {
//           setUser(null);
//           setRole(null);
//         }
//       });
//     };
//     getUsers();
//   }, []);

//   const renderRoutes = () => {
//     if (user) {
//       return (
//         <>
//           <Route element={dashboard}>
//             <Route element={role === 'admin' ? <AdminIndexPage /> : <NonAdminIndexPage />} index />
//             <Route element={<UserPage />} path='user' />
//             <Route element={<ProductsPage />} path='products' />
//             <Route element={<BlogPage />} path='blog' />
//             <Route element={<EventDetailsPage />} path="event/:id" />
//           </Route>
//           <Route element={<Navigate to="/" replace />} path='login' />
//         </>
//       );
//     } 
//       return (
//         <>
//           <Route element={<Navigate to="/login" replace />} path='*' />
//           <Route element={<LoginPage />} path='login' />
//         </>
//       );
    
//   };

//   return (
//     <Routes>
//       {renderRoutes()}
//       <Route element={<Page404 />} path='404' />
//       <Route element={<Navigate to="/404" replace />} path='*' />
//     </Routes>
//   );
// }


import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { lazy, Suspense, useLayoutEffect, useState, useContext } from 'react';
import { Outlet, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
import { auth } from 'src/utils/firebase';
import { CartContext } from 'src/context/CartContext';

export const AdminIndexPage = lazy(() => import('src/pages/app'));
export const NonAdminIndexPage = lazy(() => import('src/pages/non-admin-index'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const EventDetailsPage = lazy(() => import('src/pages/event-details'));

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
            <Route element={role === 'admin' ? <AdminIndexPage /> : <NonAdminIndexPage />} index />
            <Route element={<UserPage />} path='user' />
            <Route element={<ProductsPage />} path='products' />
            <Route element={<BlogPage />} path='blog' />
            <Route element={<EventDetailsPage />} path="event/:id" />
          </Route>
          <Route element={<Navigate to="/" replace />} path='login' />
        </>
      );
    }
    return (
      <>
        <Route element={<Navigate to="/login" replace />} path='*' />
        <Route element={<LoginPage />} path='login' />
      </>
    );
  };

  return (
    <Routes>
      {renderRoutes()}
      <Route element={<Page404 />} path='404' />
      <Route element={<Navigate to="/404" replace />} path='*' />
    </Routes>
  );
}
