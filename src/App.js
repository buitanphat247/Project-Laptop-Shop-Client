import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React from 'react';
import { Spin } from 'antd';
import "./styles/App.css";
import ToastConfig from "./config/toast";
import HotlineButton from "./components/contact/HotlineButton";
import FacebookButton from "./components/contact/FacebookButton";
import ZaloButton from "./components/contact/ZaloButton";
import RequireAuth from "./guard/RequireAuth";
import RequireAdminAuth from "./guard/RequireAdminAuth";
import RedirectIfAuthenticated from "./guard/RedirectIfAuthenticated";
import DesktopOnlyRoute from "./components/admin/DesktopOnlyRoute";
import MobileAdminRedirect from "./components/admin/MobileAdminRedirect";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import LoadingProgressBar from "./components/progress/LoadingProgressBar";
import AuthSplashManager from "./components/splash/AuthSplashManager";
import SplashWrapper from './components/splash/SplashWrapper';
import SocialIconsController from "./components/SocialIconsController";
import Document from "./pages/Document";

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Product from './pages/Product';
import About from './pages/About';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import Setting from './pages/Setting';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ResetPassword from './pages/auth/ResetPassword';
import AdminLayout from './layouts/AdminLayout';
import ProductManager from './pages/admin/ProductManager';
import OrderManager from './pages/admin/OrderManager';
import UserManager from './pages/admin/UserManager';
import NewsManager from './pages/admin/NewsManager';
import Dashboard from './pages/admin/Dashboard';
import CategoryManager from './pages/admin/CategoryManager';
import News from './pages/News';
import Checkout from './pages/Checkout';
import Order from './pages/Order';
import NotFound from './pages/NotFound';
import RolePermission from './pages/admin/RolePermission';
import Support from './pages/Support';
import PermissionManager from './pages/admin/PermissionManager';
import FavoriteProduct from './pages/FavoriteProduct';
import HelpSupport from "./pages/HelpSupport";

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
          </BrowserRouter>
        </>
      </CartProvider>
    </AuthProvider >
  );
}

export default App;
