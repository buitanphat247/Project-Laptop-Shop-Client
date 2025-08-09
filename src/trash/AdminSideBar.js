import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaTachometerAlt,
    FaBox,
    FaClipboardList,
    FaUsers,
    FaSignOutAlt,
    FaHome,
    FaNewspaper,
    FaTags
} from "react-icons/fa";

const AdminSidebar = () => {

    const menu = [
        { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin", end: true },
        { name: "Sản phẩm", icon: <FaBox />, path: "/admin/products" },
        { name: "Danh mục", icon: <FaTags />, path: "/admin/categories" },
        { name: "Đơn hàng", icon: <FaClipboardList />, path: "/admin/orders" },
        { name: "Người dùng", icon: <FaUsers />, path: "/admin/users" },
        { name: "Tin tức", icon: <FaNewspaper />, path: "/admin/news" },
        { name: "Quyền truy cập", icon: <FaUsers />, path: "/admin/permission" }, // Thêm mục Permission
    ];

    return (
        <div className="w-64 min-h-screen bg-white border-r shadow-sm">
            <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
            </div>

            <nav className="p-4 space-y-2">
                {/* Menu admin */}
                {menu.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-lg hover:bg-blue-100 transition font-semibold capitalize ${isActive ? "bg-blue-500 text-white" : "text-gray-700"
                            }`
                        }
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}

                {/* Về trang khách */}
                <NavLink
                    to="/"
                    className="flex items-center px-4 py-2 text-green-600 hover:bg-green-100 rounded-lg mt-4 transition font-semibold capitalize"
                >
                    <FaHome className="mr-3" />
                    Về trang khách
                </NavLink>

                {/* Logout */}
                {/* <button
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-6 transition font-semibold capitalize"
                    onClick={() => {
                        console.log("Logging out...");
                    }}
                >
                    <FaSignOutAlt className="mr-3" />
                    Đăng xuất
                </button> */}
            </nav>
        </div>
    );
};

export default AdminSidebar;
