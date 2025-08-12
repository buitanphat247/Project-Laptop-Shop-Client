import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Spin,
    Button,
    InputNumber,
    Rate,
    Typography,
    Space,
    Divider,
    Row,
    Col
} from 'antd';
import { toast } from 'react-toastify';
import {
    ArrowLeftOutlined,
    ShoppingCartOutlined,
    HeartOutlined,
    ShareAltOutlined,
    StarOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import axiosClient from '../config/axios';
import ProductImages from '../components/detail/ProductImages';
import AllReviewsModal from '../components/detail/AllReviewsModal';
import DescriptionModal from '../components/detail/DescriptionModal';
import ShareModal from '../components/detail/ShareModal';
import {
    DEFAULT_IMAGE,
    FALLBACK_IMAGE,
    SAMPLE_REVIEWS,
    SERVICE_FEATURES,
    RATING_DATA
} from '../config/constant';
import RelatedProducts from '../components/detail/RelatedProducts';
import BreadcrumbNav from '../components/detail/BreadcrumbNav';
import ServiceFeatures from '../components/detail/ServiceFeatures';
import ProductPrice from '../components/detail/ProductPrice';
import ProductHeader from '../components/detail/ProductHeader';
import ProductReviews from '../components/detail/ProductReviews';
import { useRef } from 'react';
import { getUserProfile } from '../utils/auth';
import { useCart } from '../context/CartContext';
const { Title, Text } = Typography;




const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const quantityRef = useRef();

    // State - Gộp theo nhóm logic để giảm rerender
    const [dataState, setDataState] = useState({
        product: null,
        relatedProducts: [],
        loading: true,
        loadingRelated: false,
        error: null
    });

    const [uiState, setUiState] = useState({
        selectedImageIndex: 0,
        isDescriptionModalVisible: false,
        isShareModalVisible: false,
        isAllReviewsModalVisible: false
    });

    const [interactionState, setInteractionState] = useState({
        copiedLink: false,
        isLiked: false
    });

    // Destructure để dễ sử dụng
    const { product, relatedProducts, loading, loadingRelated, error } = dataState;
    const { selectedImageIndex, isDescriptionModalVisible, isShareModalVisible, isAllReviewsModalVisible } = uiState;
    const { copiedLink, isLiked } = interactionState;

    // Helper functions để update state
    const updateDataState = (updates) => {
        setDataState(prev => ({ ...prev, ...updates }));
    };

    const updateUiState = (updates) => {
        setUiState(prev => ({ ...prev, ...updates }));
    };

    const updateInteractionState = (updates) => {
        setInteractionState(prev => ({ ...prev, ...updates }));
    };

    // Memoized values
    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }, []);

    const stockStatus = useMemo(() => {
        if (!product) return {};
        if (product.stock === 0) {
            return { text: 'Hết hàng', color: 'red' };
        } else if (product.stock <= 5) {
            return { text: `Chỉ còn ${product.stock} sản phẩm`, color: 'orange' };
        } else {
            return { text: `Còn ${product.stock} sản phẩm`, color: 'green' };
        }
    }, [product]);

    const images = useMemo(() => {
        return product?.imageUrls?.length > 0 ? product.imageUrls : [DEFAULT_IMAGE];
    }, [product]);

    const truncatedProductName = useMemo(() => {
        return product?.name?.length > 50
            ? `${product.name.substring(0, 50)}...`
            : product?.name;
    }, [product?.name]);

    // API functions - Define fetchRelatedProducts first
    const fetchRelatedProducts = useCallback(async (categoryId) => {
        try {
            updateDataState({ loadingRelated: true });
            const response = await axiosClient.get(`/get-list-product-by-category-id/${categoryId}`);
            const { data } = response.data;

            if (data && Array.isArray(data)) {
                updateDataState({ relatedProducts: data.slice(0, 11) });
            } else {
                updateDataState({ relatedProducts: [] });
            }
        } catch (error) {
            console.error('Error fetching related products:', error);
            updateDataState({ relatedProducts: [] });
        } finally {
            updateDataState({ loadingRelated: false });
        }
    }, []);

    const fetchProductById = useCallback(async (productId) => {
        try {
            updateDataState({ loading: true, error: null });
            const userId = getUserProfile()?.id;
            const response = userId ? await axiosClient.get(`/get-product-double-id/${productId}/${userId}`) : await axiosClient.get(`/get-product/${productId}`);
            const { data } = response.data;

            if (data) {
                updateDataState({ product: data });
                updateInteractionState({ isLiked: !!data.isFavorite }); // cập nhật trạng thái tim từ API
                if (data.category?.id) {
                    fetchRelatedProducts(data.category.id, productId);
                }
            } else {
                updateDataState({ error: 'Không tìm thấy sản phẩm' });
                toast.error('Không tìm thấy sản phẩm');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            updateDataState({ error: 'Lỗi khi tải sản phẩm' });
            toast.error('Không thể tải sản phẩm');
        } finally {
            updateDataState({ loading: false });
        }
    }, [fetchRelatedProducts]);

    // Event handlers
    const { addToCart } = useCart();
    const handleAddToCart = useCallback(async () => {
        const value = quantityRef.current.value;
        const quantity = value ? parseInt(value, 10) : 1;
        if (!getUserProfile()?.id) {
            toast.warning('Hãy đăng nhập để tiếp tục!');
            return;
        }
        try {
            await addToCart(product.id, quantity);
            // toast.success('Đã thêm vào giỏ hàng!');
            // navigate('/cart');
        } catch (error) {
            toast.error('Lỗi khi thêm!');
        }
    }, [product, navigate, addToCart]);

    const handleBuyNow = useCallback(() => {
        const userId = getUserProfile()?.id;
        if (!userId) {
            toast.warn('Hãy đăng nhập để tiếp tục!');
        }
    }, []);

    const handleToggleLike = useCallback(async () => {
        if (!product?.id) return;
        const userId = getUserProfile()?.id;
        if (!userId) {
            toast.warning('Hãy đăng nhập để tiếp tục!');
            return;
        }
        if (!isLiked) {
            // Gọi API để đính tim
            try {
                await axiosClient.post('/create-favorite-product', {
                    userId,
                    productId: product.id
                });
                updateInteractionState({ isLiked: true });
            } catch (error) {
            }
        } else {
            // Nếu muốn bỏ tim, chỉ set lại UI
            try {
                await axiosClient.post('/create-favorite-product', {
                    userId,
                    productId: product.id
                });
                updateInteractionState({ isLiked: true });
            } catch (error) {
                console.log('error: ', error);
            }
            updateInteractionState({ isLiked: false });
        }
    }, [product?.id, isLiked]);

    const copyProductLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            updateInteractionState({ copiedLink: true });
            updateInteractionState({ copiedLink: false });
        } catch (err) {
        }
    }, []);

    const shareToSocial = useCallback((platform) => {
        const productUrl = encodeURIComponent(window.location.href);
        const productTitle = encodeURIComponent(product?.name || '');

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`,
            whatsapp: `https://wa.me/?text=${productTitle}%20-%20${productUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${productTitle}&url=${productUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${productUrl}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            toast.success(`Đang chia sẻ lên ${platform}...`);
        }
    }, [product?.name]);

    // Xóa useEffect kiểm tra localStorage hoặc setIsLiked khi đổi sản phẩm

    // Effects
    useEffect(() => {
        if (id) {
            fetchProductById(id);
        } else {
            updateDataState({ error: 'ID sản phẩm không hợp lệ', loading: false });
        }
    }, [id, fetchProductById]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <Spin size="large" tip="Đang tải..." />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 rounded-md">
                <div className="text-center p-6 max-w-sm bg-white rounded-lg border">
                    <div className="text-4xl mb-3">😞</div>
                    <Title level={4} className="text-red-500 mb-3">Có lỗi xảy ra</Title>
                    <Text className="text-gray-600 block mb-4">{error}</Text>
                    <Space>
                        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
                            Quay lại
                        </Button>
                        <Button type="primary" onClick={() => fetchProductById(id)}>
                            Thử lại
                        </Button>
                    </Space>
                </div>
            </div>
        );
    }

    // No product found
    if (!product) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center p-6 max-w-sm bg-white rounded-lg border">
                    <div className="text-4xl mb-3">🔍</div>
                    <Title level={4} className="text-gray-500 mb-3">Không tìm thấy sản phẩm</Title>
                    <Text className="text-gray-600 block mb-4">Sản phẩm với ID "{id}" không tồn tại</Text>
                    <Button type="primary" onClick={() => navigate('/')} icon={<ArrowLeftOutlined />}>
                        Về trang chủ
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4  rounded-xl">
            <div className="mx-auto px-4">
                {/* Breadcrumb */}
                <BreadcrumbNav
                    navigate={navigate}
                    product={product}
                    truncatedProductName={truncatedProductName}
                />

                <Row gutter={[24, 24]}>
                    {/* Product Images */}
                    <Col xs={24} lg={12}>
                        <ProductImages
                            images={images}
                            productName={product.name}
                            selectedImageIndex={selectedImageIndex}
                            setSelectedImageIndex={(index) => updateUiState({ selectedImageIndex: index })}
                        />
                    </Col>

                    {/* Product Info */}
                    <Col xs={24} lg={12}>
                        <div className="space-y-4">
                            {/* Product Header */}
                            <ProductHeader product={product} stockStatus={stockStatus} />

                            {/* Price */}
                            <ProductPrice price={product.price} formatPrice={formatPrice} />

                            {/* Quantity */}
                            <div>
                                <Text strong className="block mb-2 text-sm">Số lượng:</Text>
                                <div className="flex items-center gap-3">
                                    <InputNumber
                                        min={1}
                                        max={product.stock}
                                        defaultValue={1}
                                        ref={quantityRef}
                                        disabled={product.stock === 0}
                                        className="w-24"
                                        size="small"
                                    />
                                    <Text className="text-gray-500 text-sm">
                                        ({product.stock} sản phẩm có sẵn)
                                    </Text>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Row gutter={[12, 12]}>
                                    <Col span={16}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            icon={<ShoppingCartOutlined />}
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0}
                                            className="font-medium"
                                        >
                                            {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                                        </Button>
                                    </Col>
                                    <Col span={8}>
                                        <button
                                            onClick={handleToggleLike}
                                            className={`w-full h-10 px-4 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${isLiked
                                                ? 'bg-red-500 hover:bg-[#ff4d4f] text-white border-red-500'
                                                : 'bg-white text-gray-700 hover:text-red-500 hover:border-red-300 border-gray-300'
                                                }`}
                                        >
                                            <HeartOutlined />
                                            {isLiked ? 'Đã thích' : 'Yêu thích'}
                                        </button>
                                    </Col>
                                </Row>

                                {/* <Button
                                    type="primary"
                                    size="large"
                                    block
                                    onClick={handleBuyNow}
                                    disabled={product.stock === 0}
                                    className="font-medium"
                                    danger
                                >
                                    {product.stock === 0 ? 'Hết hàng' : 'Mua ngay'}
                                </Button> */}

                                <Button
                                    block
                                    icon={<FileTextOutlined />}
                                    onClick={() => updateUiState({ isDescriptionModalVisible: true })}
                                    className="border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                                >
                                    Xem mô tả chi tiết
                                </Button>

                                <Button
                                    block
                                    icon={<ShareAltOutlined />}
                                    onClick={() => updateUiState({ isShareModalVisible: true })}
                                >
                                    Chia sẻ sản phẩm
                                </Button>
                            </div>

                            {/* Service Features */}
                            <ServiceFeatures SERVICE_FEATURES={SERVICE_FEATURES} />
                        </div>
                    </Col>
                </Row>

                {/* Product Reviews Section */}
                <ProductReviews
                    RATING_DATA={RATING_DATA}
                    SAMPLE_REVIEWS={SAMPLE_REVIEWS}
                    onShowAllReviews={() => updateUiState({ isAllReviewsModalVisible: true })}
                />

                {/* Related Products Section */}
                <RelatedProducts
                    loadingRelated={loadingRelated}
                    relatedProducts={relatedProducts}
                    FALLBACK_IMAGE={FALLBACK_IMAGE}
                />

                {/* Product Reviews Section - All Reviews Modal */}
                <AllReviewsModal
                    open={isAllReviewsModalVisible}
                    onClose={() => updateUiState({ isAllReviewsModalVisible: false })}
                    RATING_DATA={RATING_DATA}
                    SAMPLE_REVIEWS={SAMPLE_REVIEWS}
                />

                <DescriptionModal
                    open={isDescriptionModalVisible}
                    onClose={() => updateUiState({ isDescriptionModalVisible: false })}
                    content={product?.content}
                />

                <ShareModal
                    open={isShareModalVisible}
                    onClose={() => {
                        updateUiState({ isShareModalVisible: false });
                        updateInteractionState({ copiedLink: false });
                    }}
                    copiedLink={copiedLink}
                    copyProductLink={copyProductLink}
                    shareToSocial={shareToSocial}
                />
            </div>
        </div>
    );
};

export default Detail;