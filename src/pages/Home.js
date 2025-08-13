// Home.jsx
import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/section/SectionHeader';
import CardProduct from '../components/card/CardProduct';
import { FaSimCard, FaSuitcase, FaMobileAlt, FaWifi, FaPhoneAlt, FaEllipsisH } from "react-icons/fa";
import CardService from '../components/card/CardService';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import CardBanner from '../components/card/CardBanner';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Button, Spin, message, Skeleton } from 'antd';
import axiosClient from '../config/axios';
import NewsCard from '../components/card/NewsCard';
import CardPromoHalfImage from '../components/card/CardPromoHalfImage';
import CardProductLarge from '../components/card/CardProductLarge';

const services = [
    { icon: <FaSimCard />, title: "SIM FPT" },
    { icon: <FaSuitcase />, title: "SIM Du lịch" },
    { icon: <FaMobileAlt />, title: "Nạp thẻ điện thoại" },
    { icon: <FaWifi />, title: "Đóng phí Internet" },
    { icon: <FaPhoneAlt />, title: "Điện thoại trả sau" },
    { icon: <FaEllipsisH />, title: "Dịch vụ khác" },
];

const banners = [
    { imageUrl: "https://png.pngtree.com/template/20220331/ourmid/pngtree-thanksgiving-earth-compact-laptop-banner-image_910162.jpg" },
    { imageUrl: "https://laptop88.vn//media/news/3680_banner_amd_757x350.jpg" },
    { imageUrl: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2022/08/WhatsApp-Image-2022-08-03-at-5.20.00-PM.jpeg" },
    { imageUrl: "https://tabloidpulsa.id/wp-content/uploads/2023/06/ASUS-ROG-Terbaru.webp" },
    { imageUrl: "https://asset-2.tstatic.net/wartakota/foto/bank/images/ASUS-ROG-Zephyrus-M16-GU604.jpg" },
    { imageUrl: "https://www.agres.id/artikel/wp-content/uploads/2021/11/57-banner-article-lenovo-ideapad-slim-3-14.png" },
];

const Home = () => {
    // Gộp tất cả state vào một object để giảm rerender
    const [state, setState] = useState({
        loading: true,
        categories: [],
        allProductsByCategory: {},
        news: []
    });

    const { loading, categories, allProductsByCategory, news } = state;

    const updateState = (updates) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const fetchCategories = async () => {
        try {
            const res = await axiosClient.get('/category');
            const cats = res.data?.data || [];
            updateState({ categories: cats });
            return cats;
        } catch {
            message.error("Lỗi tải danh mục");
            return [];
        }
    };

    const fetchProductsByCategories = async (categories) => {
        try {
            const fetchTasks = categories.map(category =>
                axiosClient.get(`/get-list-product-by-category-id/${category.id}`, {
                    params: { page: 1, limit: 10 }
                }).then(res => ({
                    [category.name]: (res.data?.data || []).map(product => ({
                        ...product,
                        categoryInfo: category
                    }))
                }))
            );
            const all = await Promise.all(fetchTasks);
            const merged = Object.assign({}, ...all);
            updateState({ allProductsByCategory: merged });
        } catch {
            message.error("Lỗi tải sản phẩm");
        }
    };

    const fetchNews = async () => {
        try {
            const res = await axiosClient.get('/news', {
                params: { page: 1, limit: 20 }
            });
            updateState({ news: res.data?.data || [] });
        } catch {
            message.error("Lỗi tải tin tức");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            updateState({ loading: true });
            const categories = await fetchCategories();
            await Promise.all([
                fetchProductsByCategories(categories),
                fetchNews()
            ]);
            updateState({ loading: false });
        };
        loadData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen w-full px-4">
            <div className="text-center">
                <Spin size="large" tip="Đang tải dữ liệu trang chủ..." />
                {/* <p className="mt-4 text-gray-600 text-sm sm:text-base">Vui lòng chờ trong giây lát...</p> */}
            </div>
        </div>
    );

    // Countdown target: 4 days from now
    const countdownTarget = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 48 * 60 * 1000 + 18 * 1000);

    return (
        <div className='space-y-6 md:space-y-10'>


            {/* Swiper sản phẩm nổi bật */}
            <Swiper
                slidesPerView={1}
                spaceBetween={20}
                // pagination={{ clickable: true }} 
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1280: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    }
                }}
            >
                {banners.map((item, idx) => (
                    <SwiperSlide key={idx}><CardBanner imageUrl={item.imageUrl} /></SwiperSlide>
                ))}
            </Swiper>

            {categories.slice(0, 1).map(category => (
                <CategorySection
                    key={category.id}
                    name={category.name}
                    products={allProductsByCategory[category.name] || []}
                />
            ))}


            {/* Deals of the Day Section - full width, card lớn, nhiều sản phẩm */}
            <div>
                <SectionHeader title={'Sản phẩm bán chạy'} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {(() => {
                        // Lấy sản phẩm từ danh sách sản phẩm có sẵn
                        const firstCategory = Object.keys(allProductsByCategory)[0];
                        const products = allProductsByCategory[firstCategory] || [];
                        const selectedProducts = products.slice(0, 2); // Lấy 2 sản phẩm đầu tiên

                        if (selectedProducts.length === 0) {
                            return (
                                <div className="col-span-1 md:col-span-2 text-center py-8 text-gray-500">
                                    Không có sản phẩm nào
                                </div>
                            );
                        }

                        return selectedProducts.map(product => (
                            <CardProductLarge
                                key={product.id}
                                id={product.id}
                                image={product.imageUrls?.[0] || "https://cdn.tgdd.vn/Files/2018/05/05/1086477/laptoppp_1280x720-800-resize.jpg"}
                                category={product.categoryInfo?.name || "Laptop"}
                                name={product.name}
                                price={product.price || 18990000}
                                oldPrice={product.price * 1.2 || 21990000}
                                discount="15% off"
                                rating={4.8}
                                views={1200}
                                desc={product.description || "Laptop gaming mỏng nhẹ, hiệu năng mạnh mẽ, card rời RTX, màn hình 144Hz, pin trâu cho game thủ và designer."}
                                onViewDetails={(id) => console.log('View details:', id)}
                                onAddToCart={(id) => console.log('Add to cart:', id)}
                                onLike={() => console.log('Like product')}
                            />
                        ));
                    })()}
                </div>

            </div>






            {categories.slice(1, 2).map(category => (
                <CategorySection
                    key={category.id}
                    name={category.name}
                    products={allProductsByCategory[category.name] || []}
                />
            ))}



            <div className="bg-white rounded-xl overflow-hidden">
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4'>
                    {services.map((s, i) => <CardService key={i} icon={s.icon} title={s.title} />)}
                </div>
            </div>


            {categories.slice(2, 3).map(category => (
                <CategorySection
                    key={category.id}
                    name={category.name}
                    products={allProductsByCategory[category.name] || []}
                />
            ))}


            {/* Hero Banner với hình sản phẩm */}


            <div>
                <SectionHeader title="Tin tức" />
                <Swiper
                    slidesPerView={2}
                    spaceBetween={20}
                    // pagination={{ clickable: true, dynamicBullets: true }}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 5 },
                        768: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 4, spaceBetween: 20 }
                    }}
                    modules={[Autoplay, Pagination]}
                    className="newsSwiper"
                >
                    {news.length > 0 ? news.map(article => (
                        <SwiperSlide key={article.id}><NewsCard {...article} /></SwiperSlide>
                    )) : (
                        [1, 2, 3].map(i => (
                            <SwiperSlide key={i}>
                                <NewsCard
                                    title={`Tin tức ${i}`}
                                    description="Mô tả tin tức..."
                                    imageUrl="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/09/hinh-nen-may-tinh-4k-cong-nghe-7.jpg"
                                    date="28/06/2025"
                                />
                            </SwiperSlide>
                        ))
                    )}
                </Swiper>
            </div>

            {categories.slice(3, 4).map(category => (
                <CategorySection
                    key={category.id}
                    name={category.name}
                    products={allProductsByCategory[category.name] || []}
                />
            ))}


            {/* Deals of the Day Section - Modern Card Style Demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <CardPromoHalfImage
                    title={"Purely Fresh\nVegetables"}
                    desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
                    img="https://cdn.tgdd.vn/Files/2020/10/03/1295690/top_800x450.png"
                    bg="bg-white"
                    textColor="text-gray-900"
                    descColor="text-gray-500"
                    btnClass="bg-green-600 hover:bg-green-700"
                />
                <CardPromoHalfImage
                    title={"Fresh Fruits,\nPure Quality"}
                    desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
                    img="https://cdn.tgdd.vn/Files/2020/09/04/1287013/laptop-3m_800x450.jpg"
                    bg="bg-yellow-400/90"
                    textColor="text-gray-900"
                    descColor="text-yellow-900/80"
                    btnClass="bg-green-600 hover:bg-green-700"
                />
            </div>
            {categories.slice(3, 4).map(category => (
                <CategorySection
                    key={category.id}
                    name={category.name}
                    products={allProductsByCategory[category.name] || []}
                />
            ))}

        </div>
    );
};

const CategorySection = ({ name, products }) => (
    <div>
        <SectionHeader title={name} />
        <div className="wrapper grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {products.length > 0 ? products.map(p => (
                <CardProduct
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    desc={p.description}
                    imageUrl={p.imageUrls?.[0] || "https://cdn.tgdd.vn/Products/Images/44/309016/msi-gaming-gf63-thin-12ucx-i5-841vn-1-600x600.jpg"}
                    price={p.price}
                    stock={p.stock}
                    category={p.categoryInfo}
                />
            )) : new Array(5).fill('').map((_, i) => (
                <CardProduct
                    key={i}
                    name={`${name} - Sản phẩm ${i + 1}`}
                    imageUrl="https://cdn.tgdd.vn/Products/Images/5473/314385/xiaomi-smart-air-purifier-4-compact-eu-bhr5860eu-27w-0-600x600.jpg"
                    price={3990000}
                    stock={10}
                    category={{ name }}
                />
            ))}
        </div>
    </div>
);



export default Home;
