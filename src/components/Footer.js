import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-10 pb-4">
            <div className="container mx-auto px-4">
                {/* Subscribe Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-700 pb-8 mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-bold mb-1">Join The Community</h2>
                        <p className="text-gray-400 text-sm">Get E-mail updates about our latest news, podcasts, courses and webinars.</p>
                    </div>
                    <form className="flex w-full md:w-auto">
                        <input
                            type="email"
                            autoComplete="off"
                            placeholder="Enter your email"
                            className="rounded-l-lg px-4 py-2  w-full md:w-64 border border-gray-300 text-white transition-all duration-200 shadow-sm focus:shadow-lg"
                        />
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-r-lg font-semibold transition-colors">Subscribe</button>
                    </form>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Cột 1: Logo & mô tả */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <img src="/logo192.png" alt="Logo" loading="lazy" className="w-10 h-10" />
                            <span className="text-2xl font-bold">Laptop Shop NTK</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            WP Gears is the online learning hub for WordPress professionals looking to grow their business and expand their knowledge in all things WordPress, Web Design & Development, Business, Marketing, and more!
                        </p>
                    </div>

                    {/* Cột 2: Learn With Us */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">LEARN WITH US</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Podcasts</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Courses</a></li>
                        </ul>
                    </div>

                    {/* Cột 3: Useful Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">USEFUL LINKS</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">My Account</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Affiliate Area</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Cột 4: Follow Us */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">FOLLOW US</h3>
                        <div className="flex flex-wrap gap-3">
                            <a href="#" className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors w-[48%] min-w-[140px] justify-center">
                                <FaFacebookF /> Facebook
                            </a>
                            <a href="#" className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors w-[48%] min-w-[140px] justify-center">
                                <FaTwitter /> Twitter
                            </a>
                            <a href="#" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors w-[48%] min-w-[140px] justify-center">
                                <FaYoutube /> Youtube
                            </a>
                            <a href="#" className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg transition-colors w-[48%] min-w-[140px] justify-center">
                                <FaInstagram /> Instagram
                            </a>
                            {/* Hàng cuối cùng: Github chiếm full width */}
                            <a href="#" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors w-full justify-center mt-1">
                                <FaGithub /> Github
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
                    © 2025 Laptop Shop NTK. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;