// Home.jsx
import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/section/SectionHeader';
import CardProduct from '../components/card/CardProduct';
import CardNews from '../trash/CardNews';
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

function CountdownTimer({ targetDate, bigText }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = Math.max(0, targetDate - now);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className={`flex justify-center gap-4 md:gap-8 ${bigText ? 'text-3xl md:text-4xl font-extrabold' : 'text-2xl md:text-3xl font-bold'} text-gray-800`}>
            <div className="flex flex-col items-center"><span>{String(timeLeft.days).padStart(2, '0')}</span><span className="text-xs md:text-base font-normal mt-1">Days</span></div>
            <span>:</span>
            <div className="flex flex-col items-center"><span>{String(timeLeft.hours).padStart(2, '0')}</span><span className="text-xs md:text-base font-normal mt-1">Hours</span></div>
            <span>:</span>
            <div className="flex flex-col items-center"><span>{String(timeLeft.minutes).padStart(2, '0')}</span><span className="text-xs md:text-base font-normal mt-1">Minutes</span></div>
            <span>:</span>
            <div className="flex flex-col items-center"><span>{String(timeLeft.seconds).padStart(2, '0')}</span><span className="text-xs md:text-base font-normal mt-1">Seconds</span></div>
        </div>
    );
}

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [allProductsByCategory, setAllProductsByCategory] = useState({});
    const [news, setNews] = useState([]);

    const fetchCategories = async () => {
        try {
            const res = await axiosClient.get('/category');
            const cats = res.data?.data || [];
            setCategories(cats);
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
            setAllProductsByCategory(merged);
        } catch {
            message.error("Lỗi tải sản phẩm");
        }
    };

    const fetchNews = async () => {
        try {
            const res = await axiosClient.get('/news', {
                params: { page: 1, limit: 20 }
            });
            setNews(res.data?.data || []);
        } catch {
            message.error("Lỗi tải tin tức");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const categories = await fetchCategories();
            await Promise.all([
                fetchProductsByCategories(categories),
                fetchNews()
            ]);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen w-full">
            <Spin size="large" tip="Đang tải dữ liệu trang chủ..." />
        </div>
    );

    // Countdown target: 4 days from now
    const countdownTarget = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 48 * 60 * 1000 + 18 * 1000);

    return (
        <div className='space-y-10'>


            {/* Swiper sản phẩm nổi bật */}
            <Swiper slidesPerView={3} spaceBetween={30} pagination={{ clickable: true }} autoplay={{ delay: 2500, disableOnInteraction: false }} modules={[Autoplay, Pagination, Navigation]} className="mySwiper">
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

                <div className="grid grid-cols-2 gap-8">
                    {(() => {
                        // Lấy sản phẩm từ danh sách sản phẩm có sẵn
                        const firstCategory = Object.keys(allProductsByCategory)[0];
                        const products = allProductsByCategory[firstCategory] || [];
                        const selectedProducts = products.slice(0, 2); // Lấy 2 sản phẩm đầu tiên
                        
                        if (selectedProducts.length === 0) {
                            return (
                                <div className="col-span-2 text-center py-8 text-gray-500">
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
                <div className='flex justify-around'>
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
                    slidesPerView={1}
                    spaceBetween={20}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
                    modules={[Autoplay, Pagination]}
                    className="newsSwiper"
                >
                    {news.length > 0 ? news.map(article => (
                        <SwiperSlide key={article.id}><NewsCard {...article} /></SwiperSlide>
                    )) : (
                        [1, 2, 3].map(i => (
                            <SwiperSlide key={i}>
                                <CardNews
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        <div className="wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
