import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';

const Document = () => {
    const [pageLoading, setPageLoading] = useState(true);

    // Hide loading after 250ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 250);

        return () => clearTimeout(timer);
    }, []);

    // Show loading spinner
    if (pageLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <Spin size="large" className="mb-4" />
                    <p className="text-gray-600 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-3 text-blue-600">Tổng quan & Chi tiết các tính năng</h2>
            <ul className="list-disc ml-6 mb-6 text-base space-y-1">
                <li><b>Đăng ký & Đăng nhập:</b> Cho phép người dùng tạo tài khoản mới, đăng nhập bằng email hoặc mạng xã hội. Hỗ trợ xác thực email, quên mật khẩu, đăng nhập nhanh. Backend lưu trữ thông tin người dùng, mã hóa mật khẩu, xác thực JWT, phân quyền.</li>
                <li><b>Duyệt & Tìm kiếm sản phẩm:</b> Xem danh mục sản phẩm, lọc theo giá, hãng, loại, tìm kiếm nhanh theo tên hoặc từ khóa. Backend cung cấp API phân trang, tìm kiếm, lọc động, tối ưu truy vấn.</li>
                <li><b>Xem chi tiết sản phẩm:</b> Hiển thị hình ảnh, mô tả, thông số kỹ thuật, đánh giá, sản phẩm liên quan. Backend trả về dữ liệu chi tiết, liên kết sản phẩm cùng loại, quản lý ảnh qua cloud.</li>
                <li><b>Thêm vào giỏ hàng & mua hàng:</b> Chọn số lượng, thêm/xóa sản phẩm, cập nhật giỏ hàng, đặt hàng nhanh chỉ với vài thao tác. Giỏ hàng lưu trên backend (theo user) và đồng bộ trên nhiều thiết bị.</li>
                <li><b>Thanh toán đa phương thức:</b> Hỗ trợ thanh toán VNPAY (test), COD, chuyển khoản. Backend xử lý đơn hàng, lưu trạng thái, tích hợp API VNPAY, kiểm tra thanh toán realtime, gửi email xác nhận.</li>
                <li><b>Quản lý đơn hàng:</b> Xem lịch sử, chi tiết đơn hàng, trạng thái giao hàng, hủy đơn, đánh giá sản phẩm sau khi nhận hàng. Backend quản lý trạng thái, log lịch sử thay đổi, gửi thông báo realtime.</li>
                <li><b>Sản phẩm yêu thích:</b> Thêm/xóa sản phẩm vào danh sách yêu thích, truy cập nhanh từ menu tài khoản, không giới hạn số lượng. Backend lưu danh sách yêu thích theo user.</li>
                <li><b>Thông báo & hỗ trợ:</b> Nhận thông báo đơn hàng, khuyến mãi, hỗ trợ trực tuyến qua chat, gửi phản hồi hoặc yêu cầu hỗ trợ kỹ thuật. Backend lưu lịch sử chat, phản hồi, gửi notification realtime qua socket.io.</li>
                <li><b>Quản lý tài khoản:</b> Cập nhật thông tin cá nhân, đổi mật khẩu, quản lý địa chỉ nhận hàng, xem lịch sử hoạt động. Backend xác thực, kiểm tra quyền, lưu lịch sử thay đổi.</li>
                <li><b>Giao diện thân thiện:</b> Responsive, tối ưu cho mobile, dark mode, tốc độ tải nhanh, trải nghiệm mượt mà, dễ sử dụng cho mọi đối tượng.</li>
                <li><b>Phân quyền & Quản lý sản phẩm:</b> Hệ thống phân quyền rõ ràng: <b>Admin</b> có thể thêm/sửa/xóa sản phẩm, quản lý danh mục, duyệt đánh giá, quản lý người dùng; <b>Nhân viên</b> có thể cập nhật tồn kho, trạng thái đơn hàng; <b>Khách hàng</b> chỉ xem và đặt hàng. Các chức năng quản trị được bảo vệ bằng <code>RequireAdminAuth</code> và <code>RequireAuth</code> (React Context + Route Guard). Backend kiểm tra quyền ở mọi API, log thao tác quản trị.</li>
                <li><b>Quản lý route & bảo mật:</b> Sử dụng <code>react-router-dom</code> để định tuyến động, phân biệt route public/private, ẩn route quản trị với người không đủ quyền. Hỗ trợ lazy loading, Suspense, custom fallback khi chuyển trang. Backend xác thực token ở mọi endpoint, chống truy cập trái phép.</li>
                <li><b>Chat trực tuyến & Hỏi đáp AI:</b> Tích hợp chat realtime giữa khách hàng và admin/nhân viên hỗ trợ (socket.io). Ngoài ra, có thể hỏi đáp AI về sản phẩm, hướng dẫn sử dụng, chính sách... AI backend sử dụng mô hình ngôn ngữ (OpenAI API hoặc tương tự), trả lời tự động, lưu lịch sử hỏi đáp, hỗ trợ đa ngôn ngữ.</li>
            </ul>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-blue-600">Công nghệ & Thư viện sử dụng (Frontend & Backend)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Frontend */}
                    <div>
                        <h3 className="text-lg font-bold mb-2 text-green-700">Frontend</h3>
                        <table className="min-w-full border text-sm bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="border px-3 py-2">Thư viện/Package</th>
                                    <th className="border px-3 py-2">Chức năng chính</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">react, react-dom, react-scripts (CRA)</td><td className="border px-3 py-2">Core React, khởi tạo app, render UI</td></tr>
                                <tr><td className="border px-3 py-2">react-router-dom</td><td className="border px-3 py-2">Routing, bảo vệ route</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">antd (Ant Design)</td><td className="border px-3 py-2">UI component</td></tr>
                                <tr><td className="border px-3 py-2">tailwindcss, postcss, autoprefixer</td><td className="border px-3 py-2">Utility CSS, responsive</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">axios</td><td className="border px-3 py-2">Giao tiếp API</td></tr>
                                <tr><td className="border px-3 py-2">socket.io-client</td><td className="border px-3 py-2">Realtime chat/thông báo</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">react-lazyload</td><td className="border px-3 py-2">Lazy load ảnh/component</td></tr>
                                <tr><td className="border px-3 py-2">@ant-design/icons, @fortawesome/fontawesome-free</td><td className="border px-3 py-2">Icon</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">classnames</td><td className="border px-3 py-2">Quản lý className động</td></tr>
                                <tr><td className="border px-3 py-2">react-helmet</td><td className="border px-3 py-2">SEO, meta tag</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">react-toastify</td><td className="border px-3 py-2">Toast notification</td></tr>
                                <tr><td className="border px-3 py-2">formik, yup</td><td className="border px-3 py-2">Validate form</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">react-ckeditor-component, @ckeditor/ckeditor5-react</td><td className="border px-3 py-2">Editor</td></tr>
                                <tr><td className="border px-3 py-2">moment, dayjs</td><td className="border px-3 py-2">Xử lý ngày giờ</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">react-countup</td><td className="border px-3 py-2">Counter animation</td></tr>
                                <tr><td className="border px-3 py-2">react-chartjs-2, chart.js</td><td className="border px-3 py-2">Biểu đồ</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">react-icons</td><td className="border px-3 py-2">Icon</td></tr>
                                <tr><td className="border px-3 py-2">react-slick, slick-carousel</td><td className="border px-3 py-2">Slider</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">react-dropzone</td><td className="border px-3 py-2">Upload file</td></tr>
                                <tr><td className="border px-3 py-2">react-copy-to-clipboard</td><td className="border px-3 py-2">Copy clipboard</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">react-loading, react-spinners</td><td className="border px-3 py-2">Loading UI</td></tr>
                                <tr><td className="border px-3 py-2">react-transition-group</td><td className="border px-3 py-2">Animation</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">eslint, prettier, eslint-config-prettier, eslint-plugin-react</td><td className="border px-3 py-2">Lint, format code</td></tr>
                                <tr><td className="border px-3 py-2">jest, @testing-library/react, @testing-library/jest-dom</td><td className="border px-3 py-2">Test UI</td></tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Backend */}
                    <div>
                        <h3 className="text-lg font-bold mb-2 text-purple-700">Backend</h3>
                        <table className="min-w-full border text-sm bg-white">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="border px-3 py-2">Thư viện/Package</th>
                                    <th className="border px-3 py-2">Chức năng chính</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">node, express</td><td className="border px-3 py-2">Server, REST API</td></tr>
                                <tr><td className="border px-3 py-2">mongoose</td><td className="border px-3 py-2">ODM cho MongoDB</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">jsonwebtoken</td><td className="border px-3 py-2">JWT Auth</td></tr>
                                <tr><td className="border px-3 py-2">bcryptjs</td><td className="border px-3 py-2">Mã hóa mật khẩu</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">dotenv</td><td className="border px-3 py-2">Biến môi trường</td></tr>
                                <tr><td className="border px-3 py-2">cors, helmet</td><td className="border px-3 py-2">Bảo mật HTTP</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">morgan, winston</td><td className="border px-3 py-2">Log request, log hệ thống</td></tr>
                                <tr><td className="border px-3 py-2">multer</td><td className="border px-3 py-2">Upload file</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">cloudinary, aws-sdk</td><td className="border px-3 py-2">Lưu ảnh cloud</td></tr>
                                <tr><td className="border px-3 py-2">nodemailer</td><td className="border px-3 py-2">Gửi email</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">vnpay</td><td className="border px-3 py-2">Thanh toán VNPAY</td></tr>
                                <tr><td className="border px-3 py-2">socket.io</td><td className="border px-3 py-2">Realtime chat/thông báo</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">swagger-jsdoc, swagger-ui-express</td><td className="border px-3 py-2">Tài liệu API</td></tr>
                                <tr><td className="border px-3 py-2">openai</td><td className="border px-3 py-2">AI hỏi đáp</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">express-rate-limit</td><td className="border px-3 py-2">Chống spam</td></tr>
                                <tr><td className="border px-3 py-2">express-validator, joi</td><td className="border px-3 py-2">Validate dữ liệu</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">cookie-parser</td><td className="border px-3 py-2">Xử lý cookie</td></tr>
                                <tr><td className="border px-3 py-2">uuid</td><td className="border px-3 py-2">Sinh mã unique</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">pm2</td><td className="border px-3 py-2">Quản lý process</td></tr>
                                <tr><td className="border px-3 py-2">nodemon</td><td className="border px-3 py-2">Dev hot reload</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">cross-env</td><td className="border px-3 py-2">Đa môi trường</td></tr>
                                <tr><td className="border px-3 py-2">compression</td><td className="border px-3 py-2">Nén response</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">http-errors</td><td className="border px-3 py-2">Xử lý lỗi HTTP</td></tr>
                                <tr><td className="border px-3 py-2">body-parser</td><td className="border px-3 py-2">Parse body request</td></tr>
                                <tr className="bg-gray-50"><td className="border px-3 py-2">multer-storage-cloudinary</td><td className="border px-3 py-2">Upload file lên Cloudinary</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-2 text-base">
                    <b>Realtime & AI:</b> Socket.io cho chat/thông báo realtime, OpenAI API hoặc LLM server cho hỏi đáp AI, lưu lịch sử chat và hỏi đáp vào MongoDB.<br/>
                    <b>Khác:</b> Docker (nếu có), PM2 (quản lý process), Git/GitHub Actions (CI/CD), Postman (test API).
                </div>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-blue-700">Hướng dẫn sử dụng website Laptop Shop</h1>
            <ol className="list-decimal ml-6 space-y-2 text-base">
                <li>
                    <strong>Đăng ký & Đăng nhập:</strong> Tạo tài khoản mới hoặc đăng nhập để sử dụng đầy đủ tính năng như đặt hàng, xem lịch sử, yêu thích sản phẩm...
                </li>
                <li>
                    <strong>Chọn sản phẩm:</strong> Duyệt danh mục, tìm kiếm, lọc sản phẩm theo nhu cầu. Nhấn vào sản phẩm để xem chi tiết.
                </li>
                <li>
                    <strong>Thêm vào giỏ hàng:</strong> Chọn số lượng, nhấn "Thêm vào giỏ". Biểu tượng giỏ hàng trên header sẽ hiển thị số lượng sản phẩm đã chọn.
                </li>
                <li>
                    <strong>Thanh toán VNPAY (Test):</strong>
                    <ul className="list-disc ml-6 mt-1">
                        <li>Vào trang giỏ hàng &rarr; nhấn "Thanh toán".</li>
                        <li>Chọn phương thức thanh toán <b>VNPAY</b>.</li>
                        <li>Hệ thống sẽ chuyển hướng sang cổng VNPAY test.</li>
                        <li>Chọn ngân hàng hoặc loại thẻ, nhập thông tin test theo bảng dưới đây.</li>
                        <li>Xác nhận thanh toán, hệ thống sẽ báo kết quả giao dịch test thành công/thất bại.</li>
                        <li>Sau khi thanh toán thành công, đơn hàng sẽ được ghi nhận và bạn có thể kiểm tra trong mục "Đơn hàng".</li>
                    </ul>
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="border px-2 py-1">#</th>
                                    <th className="border px-2 py-1">Ngân hàng/Loại thẻ</th>
                                    <th className="border px-2 py-1">Số thẻ</th>
                                    <th className="border px-2 py-1">Tên chủ thẻ</th>
                                    <th className="border px-2 py-1">Ngày phát hành/Hết hạn</th>
                                    <th className="border px-2 py-1">CVC/CVV/OTP</th>
                                    <th className="border px-2 py-1">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white">
                                    <td className="border px-2 py-1">1</td>
                                    <td className="border px-2 py-1">NCB (ATM nội địa)</td>
                                    <td className="border px-2 py-1">9704198526191432198</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">07/15</td>
                                    <td className="border px-2 py-1">OTP: 123456</td>
                                    <td className="border px-2 py-1">Thành công</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border px-2 py-1">2</td>
                                    <td className="border px-2 py-1">NCB (ATM nội địa)</td>
                                    <td className="border px-2 py-1">9704195798459170488</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">07/15</td>
                                    <td className="border px-2 py-1">OTP: 123456</td>
                                    <td className="border px-2 py-1">Thẻ không đủ số dư</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="border px-2 py-1">3</td>
                                    <td className="border px-2 py-1">NCB (ATM nội địa)</td>
                                    <td className="border px-2 py-1">9704192181368742</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">07/15</td>
                                    <td className="border px-2 py-1">OTP: 123456</td>
                                    <td className="border px-2 py-1">Thẻ chưa kích hoạt</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border px-2 py-1">4</td>
                                    <td className="border px-2 py-1">NCB (ATM nội địa)</td>
                                    <td className="border px-2 py-1">9704193370791314</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">07/15</td>
                                    <td className="border px-2 py-1">OTP: 123456</td>
                                    <td className="border px-2 py-1">Thẻ bị khóa</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="border px-2 py-1">5</td>
                                    <td className="border px-2 py-1">NCB (ATM nội địa)</td>
                                    <td className="border px-2 py-1">9704194841945513</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">07/15</td>
                                    <td className="border px-2 py-1">OTP: 123456</td>
                                    <td className="border px-2 py-1">Thẻ bị hết hạn</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border px-2 py-1">6</td>
                                    <td className="border px-2 py-1">VISA (No 3DS)</td>
                                    <td className="border px-2 py-1">4456530000001005</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">12/26</td>
                                    <td className="border px-2 py-1">CVC: 123</td>
                                    <td className="border px-2 py-1">Thành công</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="border px-2 py-1">7</td>
                                    <td className="border px-2 py-1">VISA (3DS)</td>
                                    <td className="border px-2 py-1">4456530000001096</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">12/26</td>
                                    <td className="border px-2 py-1">CVC: 123</td>
                                    <td className="border px-2 py-1">Thành công</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border px-2 py-1">8</td>
                                    <td className="border px-2 py-1">MasterCard (No 3DS)</td>
                                    <td className="border px-2 py-1">5200000000001005</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">12/26</td>
                                    <td className="border px-2 py-1">CVC: 123</td>
                                    <td className="border px-2 py-1">Thành công</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="border px-2 py-1">9</td>
                                    <td className="border px-2 py-1">MasterCard (3DS)</td>
                                    <td className="border px-2 py-1">5200000000001096</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">12/26</td>
                                    <td className="border px-2 py-1">CVC: 123</td>
                                    <td className="border px-2 py-1">Thành công</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border px-2 py-1">10</td>
                                    <td className="border px-2 py-1">JCB (No 3DS)</td>
                                    <td className="border px-2 py-1">3337000000000008</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">12/26</td>
                                    <td className="border px-2 py-1">CVC: 123</td>
                                    <td className="border px-2 py-1">Thành công</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="border px-2 py-1">11</td>
                                    <td className="border px-2 py-1">JCB (3DS)</td>
                                    <td className="border px-2 py-1">3337000000200004</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">12/24</td>
                                    <td className="border px-2 py-1">CVC: 123</td>
                                    <td className="border px-2 py-1">Thành công</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border px-2 py-1">12</td>
                                    <td className="border px-2 py-1">ATM nội địa (NAPAS)</td>
                                    <td className="border px-2 py-1">9704000000000018<br/>9704020000000016</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">03/07</td>
                                    <td className="border px-2 py-1">OTP: otp</td>
                                    <td className="border px-2 py-1">Thành công</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="border px-2 py-1">13</td>
                                    <td className="border px-2 py-1">ATM nội địa (EXIMBANK)</td>
                                    <td className="border px-2 py-1">9704310005819191</td>
                                    <td className="border px-2 py-1">NGUYEN VAN A</td>
                                    <td className="border px-2 py-1">10/26</td>
                                    <td className="border px-2 py-1">OTP: 123456</td>
                                    <td className="border px-2 py-1">Thành công</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </li>
                <li>
                    <strong>Quản lý tài khoản:</strong> Truy cập mục "Cài đặt" để cập nhật thông tin cá nhân, đổi mật khẩu, xem lịch sử đơn hàng, sản phẩm yêu thích...
                </li>
                <li>
                    <strong>Hỗ trợ & Phản hồi:</strong> Nếu gặp vấn đề, hãy sử dụng mục "Hỗ trợ" hoặc "Đóng góp ý kiến" trong menu tài khoản.
                </li>
            </ol>
            <div className="mt-6 p-4 bg-blue-50 rounded text-blue-800">
                <b>Lưu ý:</b> Đây là môi trường test, mọi giao dịch thanh toán qua VNPAY chỉ mang tính thử nghiệm, không phát sinh giao dịch thực tế.
            </div>
        </div>
    );
};

export default Document;