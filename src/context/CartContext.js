import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Tạo context
const CartContext = createContext();

export const useCart = () => useContext(CartContext);


import { getUserProfile } from '../utils';
import axiosClient from '../config/axios';

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [showAnimation, setShowAnimation] = useState(false);
    const userId = getUserProfile()?.id;
    
    // Khi userId thay đổi, fetch cart từ server
    useEffect(() => {
        if (userId) {
            fetchCartFromServer(userId);
        } else {
            setCartCount(0);
            setCartItems([]);
        }
        // eslint-disable-next-line
    }, [userId]);

    // Lấy cart từ server (cả count và items)
    const fetchCartFromServer = async (userId) => {
        try {
            const res = await axiosClient.get(`/get-cart-items-of-user/${userId}`);
            const data = res.data.data.products || [];
            
            // Map data để có format phù hợp với Header
            const items = data.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image
            }));
            
            setCartItems(items);
            setCartCount(items.length);
            return items; // Trả về items để component khác có thể sử dụng
        } catch (err) {
            console.error('Error fetching cart:', err);
            setCartCount(0);
            setCartItems([]);
            return [];
        }
    };

    // Deprecated - giữ lại để tương thích
    const fetchCartCountFromServer = async (userId) => {
        await fetchCartFromServer(userId);
    };

    // Thêm sản phẩm vào giỏ (chuẩn hóa, trả về promise để component xử lý toast/navigate)
    const addToCart = async (productId, quantity = 1) => {
        if (!userId) throw new Error('Chưa đăng nhập');
        
        // Lưu số lượng cũ để so sánh
        const oldCount = cartCount;
        
        await axiosClient.post('/create-cart-items', {
            userId,
            productId,
            quantity
        });
        
        // Fetch cart mới từ server
        const newCartData = await fetchCartFromServer(userId);
        
        // Chỉ trigger animation khi thực sự có sản phẩm mới được thêm vào
        if (newCartData && newCartData.length > oldCount) {
            setShowAnimation(true);
        }
    };

    // Xóa sản phẩm khỏi giỏ bằng cartItemId (dùng cho modal confirm)
    const removeCartItemById = async (cartItemId) => {
        if (!userId) throw new Error('Chưa đăng nhập');
        await axiosClient.delete(`/delete-cart-items/${cartItemId}`);
        await fetchCartFromServer(userId);
    };

    // Xóa sản phẩm khỏi giỏ (dùng cho Header dropdown)
    const removeFromCart = async (productId) => {
        if (!userId) return;
        try {
            // Tìm cartItem theo productId
            const itemToRemove = cartItems.find(item => item.id === productId);
            if (itemToRemove) {
                await axiosClient.delete(`/delete-cart-items/${itemToRemove.id}`);
                await fetchCartFromServer(userId);
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    // Xóa tất cả sản phẩm khỏi giỏ
    const clearCart = async () => {
        if (!userId) return;
        try {
            // Xóa từng item một
            for (const item of cartItems) {
                await axiosClient.delete(`/delete-cart-items/${item.id}`);
            }
            await fetchCartFromServer(userId);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    // Cập nhật số lượng
    const updateQuantity = async (id, quantity) => {
        if (!userId) return;
        try {
            await axiosClient.post('/update-cart-quantity', { userId, productId: id, quantity });
            await fetchCartFromServer(userId);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };


    // Hàm để ẩn animation
    const hideAnimation = () => {
        setShowAnimation(false);
    };

    return (
        <CartContext.Provider value={{ 
            cartCount, 
            cartItems, 
            showAnimation,
            addToCart, 
            updateQuantity, 
            removeCartItemById, 
            removeFromCart, 
            clearCart,
            fetchCartFromServer,
            hideAnimation
        }}>
            {children}
        </CartContext.Provider>
    );
};
