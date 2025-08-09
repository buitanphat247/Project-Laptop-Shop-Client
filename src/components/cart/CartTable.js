import React from 'react';
import {
    Button,
    Typography,
} from 'antd';
import CartItemRow from './CartItemRow';

const CartTable = ({ cartItems, updateQuantity, removeItem }) => (
    <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200 p-5">
        <Typography.Title level={2} className="!mb-6 md:!mb-8 !text-black">Shopping Cart</Typography.Title>
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2 min-w-[800px]">
                <thead>
                    <tr className="text-gray-500 text-base border-b border-gray-200">
                        <th className="pb-3 font-medium w-[60%] px-2">Product</th>
                        <th className="pb-3 font-medium text-center w-[15%] px-2">Quantity</th>
                        <th className="pb-3 font-medium text-right w-[15%] px-2">Total</th>
                        <th className="pb-3 font-medium text-center w-[10%] px-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItemRow
                                key={item.id}
                                item={item}
                                updateQuantity={updateQuantity}
                                removeItem={removeItem}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-12 text-gray-500">
                                <div className="space-y-2">
                                    <div className="text-4xl">🛒</div>
                                    <div className="text-lg font-medium">Giỏ hàng trống</div>
                                    <div className="text-sm">Hãy thêm sản phẩm vào giỏ hàng của bạn</div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>

    </div>
);

export default CartTable;