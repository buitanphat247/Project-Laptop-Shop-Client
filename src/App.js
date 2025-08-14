import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import "./styles/App.css";
import ToastConfig from "./config/toast";
import HotlineButton from "./components/contact/HotlineButton";
import FacebookButton from "./components/contact/FacebookButton";
import ZaloButton from "./components/contact/ZaloButton";
import RequireAuth from "./guard/RequireAuth";
import RequireAdminAuth from "./guard/RequireAdminAuth";
import RedirectIfAuthenticated from "./guard/RedirectIfAuthenticated";
import MobileAdminRedirect from "./components/admin/MobileAdminRedirect";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import SplashWrapper from './components/splash/SplashWrapper';
import SocialIconsController from "./components/SocialIconsController";
import Document from "./pages/Document";

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Lazy load các trang chính
const Home = lazy(() => import('./pages/Home'));
const Product = lazy(() => import('./pages/Product'));
const About = lazy(() => import('./pages/About'));
const Detail = lazy(() => import('./pages/Detail'));
const Cart = lazy(() => import('./pages/Cart'));
const Setting = lazy(() => import('./pages/Setting'));
const SignIn = lazy(() => import('./pages/auth/SignIn'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const ProductManager = lazy(() => import('./pages/admin/ProductManager'));
const OrderManager = lazy(() => import('./pages/admin/OrderManager'));
const UserManager = lazy(() => import('./pages/admin/UserManager'));
const NewsManager = lazy(() => import('./pages/admin/NewsManager'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const CategoryManager = lazy(() => import('./pages/admin/CategoryManager'));
const News = lazy(() => import('./pages/News'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Order = lazy(() => import('./pages/Order'));
const NotFound = lazy(() => import('./pages/NotFound'));
const RolePermission = lazy(() => import('./pages/admin/RolePermission'));
const Support = lazy(() => import('./pages/Support'));
const PermissionManager = lazy(() => import('./pages/admin/PermissionManager'));
const FavoriteProduct = lazy(() => import('./pages/FavoriteProduct'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <>
          <ToastConfig />
          <BrowserRouter>
            <SocialIconsController>
              <HotlineButton />
              <ZaloButton></ZaloButton>
              <FacebookButton></FacebookButton>
            </SocialIconsController>
            <Suspense >
              <Routes>
                <Route path="/" element={
                  <SplashWrapper>
                    <MainLayout />
                  </SplashWrapper>
                }>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Product />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/product/:id" element={<Detail />} />
                  <Route path="/favorite-products" element={<FavoriteProduct />} />
                  {/* <Route path="/feedback" element={<Feedback />} /> */}
                  <Route path="/support" element={<Support />} />
                  <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
                  <Route path="/setting" element={<RequireAuth><Setting /></RequireAuth>} />
                  <Route path="/vnpay-return" element={<Checkout />} />
                  <Route path="/orders" element={<Order />} />
                  <Route path="/docs" element={<Document />} />
                  <Route path="/help&support" element={<HelpSupport />} />
                </Route>
                {/* Auth Routes - Không cần splash */}
                <Route path="/signin" element={<RedirectIfAuthenticated><SignIn /></RedirectIfAuthenticated>} />
                <Route path="/signup" element={<RedirectIfAuthenticated><SignUp /></RedirectIfAuthenticated>} />
                <Route path="/reset-password" element={<RedirectIfAuthenticated><ResetPassword /></RedirectIfAuthenticated>} />
                {/* Redirect /auth to /signin */}
                <Route path="/auth" element={<Navigate to="/signin" replace />} />
                {/* Admin Routes - Chỉ hiển thị trên Desktop */}
                <Route path="/admin" element={
                  <RequireAdminAuth>
                    <MobileAdminRedirect>
                      <AdminLayout />
                    </MobileAdminRedirect>
                  </RequireAdminAuth>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductManager />} />
                  <Route path="categories" element={<CategoryManager />} />
                  <Route path="orders" element={<OrderManager />} />
                  <Route path="users" element={<UserManager />} />
                  <Route path="news" element={<NewsManager />} />
                  <Route path="permissions" element={<PermissionManager />} />
                  <Route path="roles-permission" element={<RolePermission />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </>
      </CartProvider>
    </AuthProvider >
  );
}

export default App;
