import React, { useState, useEffect } from 'react';
import {
    Spin,
    Typography,
    message,
    Modal,
    Input,
    Form,
    Button,
} from 'antd';
import CartTable from '../components/cart/CartTable';
import OrderSummary from '../components/cart/OrderSummary';
import { getUserProfile } from '../utils/auth';
import axiosClient from '../config/axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
const { Title, Text } = Typography;

const Cart = () => {
    // Gộp state theo nhóm logic để giảm rerender
    const [dataState, setDataState] = useState({
        cartItems: [],
        loading: false,
        pageLoading: true
    });

    const [formState, setFormState] = useState({
        promoCode: '',
        showReceiverForm: false,
        receiverInfo: {
            shipName: '',
            shipPhone: '',
            shipAddress: '',
            email: ''
        }
    });

    const [modal, contextHolder] = Modal.useModal();
    const [form] = Form.useForm();

    // Destructure để dễ sử dụng
    const { cartItems, loading, pageLoading } = dataState;
    const { promoCode, showReceiverForm, receiverInfo } = formState;

    // Helper functions để update state
    const updateDataState = (updates) => {
        setDataState(prev => ({ ...prev, ...updates }));
    };

    const updateFormState = (updates) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };
    useEffect(() => {
        let timer;
        const fetchCart = async () => {
            const userId = getUserProfile()?.id;
            if (!userId) {
                updateDataState({ pageLoading: false });
                return;
            }
            updateDataState({ loading: true });
            try {
                const res = await axiosClient.get(`/get-cart-items-of-user/${userId}`);
                const { data } = res.data;
                updateDataState({ cartItems: data.products });
            } catch (err) {
                message.error('Không thể tải giỏ hàng');
                updateDataState({ cartItems: [] });
            } finally {
                updateDataState({ loading: false });
                // Đảm bảo hiệu ứng loading tối thiểu 500ms
                timer = setTimeout(() => {
                    updateDataState({ pageLoading: false });
                }, 500);
            }
        };
        fetchCart();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, []);

    const updateQuantity = async (id, value) => {
        if (value < 1) return;
        const userId = getUserProfile()?.id;
        try {
            await axiosClient.put(`/update-cart-items/${id}`, {
                quantity: value,
                userId
            });
            // Fetch lại giỏ hàng sau khi cập nhật
            const res = await axiosClient.get(`/get-cart-items-of-user/${userId}`);
            const { data } = res.data;
            updateDataState({ cartItems: data.products });
            message.success('Cập nhật số lượng thành công!');
        } catch (error) {
            message.error('Cập nhật số lượng thất bại!');
        }
    };


    // Xác nhận xóa sản phẩm khỏi giỏ hàng (dùng context)
    const { removeCartItemById } = useCart();
    const handleRemoveItemWithConfirm = (item) => {
        modal.confirm({
            title: 'Xác nhận xóa sản phẩm',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>"{item.name}"</strong> khỏi giỏ hàng không?</p>
                    <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
                        ⚠️ Hành động này không thể hoàn tác!
                    </p>
                </div>
            ),
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            maskClosable: true,
            async onOk() {
                try {
                    await removeCartItemById(item.cartItemId);
                    // Nếu muốn fetch lại cartItems tại đây, có thể gọi lại API hoặc reload page nếu cần
                    updateDataState({ cartItems: cartItems.filter((i) => i.cartItemId !== item.cartItemId) });
                    message.success('Đã xóa sản phẩm khỏi giỏ hàng!');
                } catch (err) {
                    message.error('Xóa thất bại!');
                }
            },
        });
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0; // 10% discount
    const shippingFee = 0;
    const total = subtotal - discount + shippingFee;
    if (pageLoading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh] px-4">
                <div className="text-center">
                    <Spin size="large" tip="Đang tải sản phẩm..." />
                </div>
            </div>
        );
    }

    const handleOpenModal = () => {
        updateFormState({ showReceiverForm: true });
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            {/* Mobile & Tablet Layout */}
            <div className="block lg:hidden">
                <div className="space-y-6">
                    {/* Order Summary cho mobile/tablet - hiển thị trước */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <OrderSummary
                            subtotal={subtotal}
                            discount={discount}
                            shippingFee={shippingFee}
                            total={total}
                            promoCode={promoCode}
                            setPromoCode={(value) => updateFormState({ promoCode: value })}
                            onCheckout={async () => {
                                try {
                                    const userId = getUserProfile()?.id;
                                    if (!userId) {
                                        message.error("Bạn cần đăng nhập để thanh toán!");
                                        return;
                                    }
                                    handleOpenModal();
                                } catch (error) {
                                    message.error("Có lỗi xảy ra!");
                                }
                            }}
                        />
                    </div>
                    
                    {/* Cart Table cho mobile/tablet */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <CartTable
                            cartItems={cartItems}
                            updateQuantity={updateQuantity}
                            removeItem={handleRemoveItemWithConfirm}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Desktop Layout - giữ nguyên */}
            <div className="hidden lg:flex flex-row gap-8 justify-center items-start">
                <CartTable
                    cartItems={cartItems}
                    updateQuantity={updateQuantity}
                    removeItem={handleRemoveItemWithConfirm}
                    loading={loading}
                />
                <OrderSummary
                    subtotal={subtotal}
                    discount={discount}
                    shippingFee={shippingFee}
                    total={total}
                    promoCode={promoCode}
                    setPromoCode={(value) => updateFormState({ promoCode: value })}
                    onCheckout={async () => {
                        try {
                            const userId = getUserProfile()?.id;
                            if (!userId) {
                                message.error("Bạn cần đăng nhập để thanh toán!");
                                return;
                            }
                            handleOpenModal();
                        } catch (error) {
                            message.error("Có lỗi xảy ra!");
                        }
                    }}
                />
            </div>
                            <Modal
                    title="Thông tin người nhận"
                    open={showReceiverForm}
                    onCancel={() => updateFormState({ showReceiverForm: false })}
                    footer={[
                        <Button key="cancel" onClick={() => updateFormState({ showReceiverForm: false })}>
                            Hủy
                        </Button>,
                        <Button form="receiverForm" key="submit" htmlType="submit" type="primary">
                            Xác nhận & Thanh toán
                        </Button>
                    ]}
                    onOk={form.submit}
                    width="90%"
                    style={{ maxWidth: '500px' }}
                    centered
                >
                <Form
                    id="receiverForm"
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={async (values) => {
                        console.log('values:', values);
                        updateFormState({ 
                            receiverInfo: values,
                            showReceiverForm: false 
                        });
                        // Tiếp tục quy trình thanh toán
                        const userId = getUserProfile()?.id;
                        const orderData = {
                            userId,
                            items: cartItems.map(item => ({
                                productId: item.id,
                                quantity: item.quantity,
                                nam: item.name,
                                price: item.price
                            })),
                            shipName: values.shipName,
                            shipAddress: values.shipAddress,
                            email: values.email,
                            totalPrice: total,
                            note: "",
                            shipPhone: values.shipPhone,
                            shippedDate: new Date().toISOString(),
                            status: "pending"
                        };
                        const orderInfo = JSON.stringify({
                            orderId: new Date().getTime(),
                            userId,
                            items: cartItems.map(item => ({
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price
                            })),
                            totalPrice: total
                        });
                        const amount = total / 100;
                        const res = await axiosClient.post("/payment-vnpay", {
                            orderInfo,
                            amount,
                            orderData
                        });
                        const paymentUrl = res.data.paymentUrl;
                        if (!paymentUrl) {
                            message.error("Không tạo được link thanh toán!");
                            return;
                        }
                        window.location.href = paymentUrl;

                        message.info("Đang chuyển đến VNPay...");
                    }}
                >
                    <Form.Item label="Họ tên người nhận" name="shipName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                        <Input autoComplete="off" />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="shipPhone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^\d{9,}$/, message: 'Số điện thoại không hợp lệ!' }]}>
                        <Input autoComplete="off" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
                        <Input autoComplete="off" />
                    </Form.Item>
                    <Form.Item label="Địa chỉ nhận hàng" name="shipAddress" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                        <Input autoComplete="off" />
                    </Form.Item>
                </Form>
            </Modal>
            {contextHolder}

        </div>
    );
};

export default Cart;