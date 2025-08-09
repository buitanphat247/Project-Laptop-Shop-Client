// MainLayout.js
// Layout chính cho trang khách (user-facing)
// Định nghĩa cấu trúc khung trang: Header, nội dung chính, Footer

import React from 'react';
import Header from '../components/Header'; // Thanh header cố định trên cùng
import Footer from '../components/Footer'; // Footer cố định dưới cùng
import { Outlet } from 'react-router-dom'; // Outlet để render các route con

/**
 * MainLayout
 *
 * Layout tổng cho các trang ngoài (khách, user, landing page...)
 * Đảm bảo mọi trang đều có Header, Footer và vùng nội dung chính ở giữa.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Nội dung con (ít dùng, chủ yếu dùng <Outlet />)
 *
 * Sử dụng với React Router:
 * <Route element={<MainLayout />}>...</Route>
 *
 * - <Header />: Hiển thị thanh điều hướng trên cùng
 * - <main>: Vùng nội dung chính, căn giữa, padding
 * - <Outlet />: Nơi render các component theo route con
 * - <Footer />: Hiển thị cuối trang
 */
const MainLayout = ({ children }) => {
    return (
        <>
            {/* Header cố định trên cùng */}
            <Header />
            {/* Nội dung chính, căn giữa, padding */}
            <main className='container mx-auto py-5'>
                {/*
                  Sử dụng <Outlet /> để render các route con của React Router.
                  Nếu muốn render children trực tiếp, có thể dùng {children} thay cho <Outlet />
                */}
                <Outlet />
            </main>
            {/* Footer cố định dưới cùng */}
            <Footer />
        </>
    );
};

export default MainLayout;