// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
// import axiosClient from '../config/axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from "react-router-dom";
// import {
//     setCookie,
//     encodeBase64,
//     saveUserProfile,
//     saveLoginStatus,
//     logUserActivity
// } from '../utils/auth';

// const AuthForm = ({ isSignIn, showPassword, setShowPassword }) => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         setValue
//     } = useForm({
//         // Pre-fill default values cho cả login và register
//         defaultValues: {
//             email: isSignIn ? "admin@gmail.com" : "user@gmail.com",
//             password: isSignIn ? "admin2747" : "123456",
//             fullname: !isSignIn ? "Nguyen Van A" : "",
//             phone: !isSignIn ? "0123456789" : "",
//             address: !isSignIn ? "123 Nguyen Van Linh, Da Nang" : ""
//         }
//     });
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);

//     // Quick login function
//     const quickLogin = async (userType) => {
//         const credentials = {
//             admin: { email: "admin@gmail.com", password: "admin2747" },
//             user: { email: "user@gmail.com", password: "user2747" }
//         };

//         const { email, password } = credentials[userType];

//         // Set form values
//         setValue('email', email);
//         setValue('password', password);

//         setLoading(true);
//         try {
//             console.log(`🚀 Quick ${userType} login...`);
//             logUserActivity('quick_login_attempt', { email, type: userType });

//             const response = await axiosClient.post('/auth/login', {
//                 email,
//                 password,
//             });

//             const result = response.data;
//             console.log('✅ Quick login API response:', result);

//             // Lưu accessToken vào cookie
//             setCookie('accessToken', result.data.accessToken || '');

//             // Tạo object profile user
//             const userProfile = {
//                 id: result.data.id,
//                 fullname: result.data.fullname,
//                 email: result.data.email,
//                 role: result.data.role
//             };

//             // Sử dụng functions từ utils để save data
//             saveUserProfile(userProfile);
//             saveLoginStatus(result.data.role);

//             // Log successful login
//             logUserActivity('quick_login_success', {
//                 userId: result.data.id,
//                 role: result.data.role,
//                 type: userType
//             });

//             console.log(`🎉 Quick ${userType} login successful!`);

//             setTimeout(() => {
//                 setLoading(false);
//                 toast.success(`Đăng nhập ${userType} thành công!`);
//                 navigate('/');
//             }, 1500);
//         } catch (error) {
//             console.error(`❌ Quick ${userType} login failed:`, error);
//             setLoading(false);

//             logUserActivity('quick_login_failed', {
//                 email,
//                 type: userType,
//                 error: error.message
//             });

//             toast.error(`Đăng nhập ${userType} thất bại!`);
//         }
//     };

//     const onSubmit = async (data) => {
//         if (isSignIn) {
//             setLoading(true);
//             try {
//                 console.log('🚀 Starting login process...');
//                 logUserActivity('login_attempt', { email: data.email });

//                 const response = await axiosClient.post(
//                     '/auth/login',
//                     {
//                         email: data.email,
//                         password: data.password,
//                     }
//                 );

//                 const result = response.data;
//                 console.log('✅ Login API response:', result);

//                 // Lưu accessToken và refreshToken vào cookie
//                 setCookie('accessToken', result.data.accessToken || '');
//                 // setCookie('refreshToken', result.data.refreshToken || '');

//                 // Tạo object profile user
//                 const userProfile = {
//                     id: result.data.id,
//                     fullname: result.data.fullname,
//                     email: result.data.email,
//                     role: result.data.role
//                 };

//                 // Sử dụng functions từ utils để save data
//                 saveUserProfile(userProfile);
//                 saveLoginStatus(result.data.role);

//                 // Log successful login
//                 logUserActivity('login_success', {
//                     userId: result.data.id,
//                     role: result.data.role
//                 });

//                 console.log('🎉 Login successful, redirecting...');

//                 setTimeout(() => {
//                     setLoading(false);
//                     toast.success('Đăng nhập thành công!');
//                     navigate('/');
//                 }, 2500);
//             } catch (error) {
//                 console.error('❌ Login failed:', error);
//                 setLoading(false);

//                 // Log failed login
//                 logUserActivity('login_failed', {
//                     email: data.email,
//                     error: error.message
//                 });

//                 toast.error('Đăng nhập thất bại! Kiểm tra lại email và mật khẩu.');
//             }
//         } else {
//             // Xử lý đăng ký
//             setLoading(true);
//             try {
//                 console.log('🚀 Starting registration process...');
//                 logUserActivity('register_attempt', { email: data.email });

//                 const response = await axiosClient.post(
//                     '/auth/register',
//                     {
//                         fullname: data.fullname,
//                         email: data.email,
//                         phone: data.phone,
//                         address: data.address,
//                         password: data.password,
//                     }
//                 );

//                 console.log('✅ Registration successful:', response.data);

//                 // Log successful registration
//                 logUserActivity('register_success', { email: data.email });

//                 setTimeout(() => {
//                     setLoading(false);
//                     toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
//                     // Switch to sign in mode or redirect
//                 }, 2500);
//             } catch (error) {
//                 console.error('❌ Registration failed:', error);
//                 setLoading(false);

//                 // Log failed registration
//                 logUserActivity('register_failed', {
//                     email: data.email,
//                     error: error.message
//                 });

//                 toast.error('Đăng ký thất bại! Email có thể đã được sử dụng.');
//             }
//         }
//     };

//     return (
//         <form
//             className="px-6 py-8 space-y-6 transition-all duration-300 ease-in-out"
//             onSubmit={handleSubmit(onSubmit)}
//         >
//             {/* Admin login hint */}
//             {isSignIn && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
//                     <p className="text-blue-700 text-sm text-center">
//                         <i className="fas fa-info-circle mr-1"></i>
//                         Demo Admin: admin@gmail.com / admin2747 (Đã điền sẵn)
//                     </p>
//                 </div>
//             )}

//             {/* Register hint */}
//             {!isSignIn && (
//                 <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
//                     <p className="text-green-700 text-sm text-center">
//                         <i className="fas fa-info-circle mr-1"></i>
//                         Demo User: user@gmail.com / 123456 (Đã điền sẵn)
//                     </p>
//                 </div>
//             )}

//             {/* Quick Login Buttons - Chỉ hiển thị khi đăng nhập */}
//             {isSignIn && (
//                 <div className="space-y-3 mb-6">
//                     <p className="text-gray-600 text-sm text-center font-medium">Đăng nhập nhanh:</p>
//                     <div className="grid grid-cols-2 gap-3">
//                         <button
//                             type="button"
//                             onClick={() => quickLogin('admin')}
//                             disabled={loading}
//                             className={`px-4 py-2 bg-red-500 text-white rounded-md font-medium text-sm hover:bg-red-600 transition flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//                         >
//                             <i className="fas fa-user-shield mr-2"></i>
//                             Admin
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => quickLogin('user')}
//                             disabled={loading}
//                             className={`px-4 py-2 bg-green-500 text-white rounded-md font-medium text-sm hover:bg-green-600 transition flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//                         >
//                             <i className="fas fa-user mr-2"></i>
//                             User
//                         </button>
//                     </div>
//                     <div className="text-center">
//                         <span className="text-gray-400 text-xs">hoặc điền thông tin bên dưới</span>
//                     </div>
//                 </div>
//             )}

//             {/* Sign up fields */}
//             {!isSignIn && (
//                 <>
//                     <div className="relative mb-2">
//                         <FaUser className="absolute top-3 left-3 text-gray-400" />
//                         <input
//                             type="text"
//                             placeholder="Full Name"
//                             defaultValue="Nguyen Van A"
//                             {...register("fullname", { required: "Vui lòng nhập họ tên" })}
//                             className={`w-full pl-10 pr-4 py-2 border ${errors.fullname ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
//                         />
//                         {errors.fullname && (
//                             <span className="text-red-500 text-xs mt-1 block">{errors.fullname.message}</span>
//                         )}
//                     </div>

//                     <div className="relative mb-2">
//                         <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
//                         <input
//                             type="email"
//                             placeholder="E-mail"
//                             defaultValue="user@gmail.com"
//                             {...register("email", {
//                                 required: "Vui lòng nhập email",
//                                 pattern: {
//                                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                     message: "Email không hợp lệ",
//                                 },
//                             })}
//                             className={`w-full pl-10 pr-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
//                         />
//                         {errors.email && (
//                             <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
//                         )}
//                     </div>

//                     <div className="relative mb-2">
//                         <FaUser className="absolute top-3 left-3 text-gray-400" />
//                         <input
//                             type="text"
//                             placeholder="Phone"
//                             defaultValue="0123456789"
//                             {...register("phone", {
//                                 required: "Vui lòng nhập số điện thoại",
//                                 pattern: {
//                                     value: /^[0-9]{9,12}$/,
//                                     message: "Số điện thoại không hợp lệ",
//                                 },
//                             })}
//                             className={`w-full pl-10 pr-4 py-2 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
//                         />
//                         {errors.phone && (
//                             <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>
//                         )}
//                     </div>

//                     <div className="relative mb-2">
//                         <FaUser className="absolute top-3 left-3 text-gray-400" />
//                         <input
//                             type="text"
//                             placeholder="Address"
//                             defaultValue="123 Nguyen Van Linh, Da Nang"
//                             {...register("address", { required: "Vui lòng nhập địa chỉ" })}
//                             className={`w-full pl-10 pr-4 py-2 border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
//                         />
//                         {errors.address && (
//                             <span className="text-red-500 text-xs mt-1 block">{errors.address.message}</span>
//                         )}
//                     </div>
//                 </>
//             )}

//             {/* Email field for Sign in */}
//             {isSignIn && (
//                 <div className="relative mb-2">
//                     <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
//                     <input
//                         type="email"
//                         placeholder="E-mail"
//                         defaultValue="admin@gmail.com"
//                         {...register("email", {
//                             required: "Vui lòng nhập email",
//                             pattern: {
//                                 value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                 message: "Email không hợp lệ",
//                             },
//                         })}
//                         className={`w-full pl-10 pr-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
//                     />
//                     {errors.email && (
//                         <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
//                     )}
//                 </div>
//             )}

//             {/* Password field */}
//             <div className="relative mb-2">
//                 <FaLock className="absolute top-3 left-3 text-gray-400" />
//                 <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password"
//                     defaultValue={isSignIn ? "admin2747" : "123456"}
//                     {...register("password", {
//                         required: "Vui lòng nhập mật khẩu",
//                         minLength: {
//                             value: 6,
//                             message: "Mật khẩu tối thiểu 6 ký tự",
//                         },
//                     })}
//                     className={`w-full pl-10 pr-16 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
//                 />
//                 <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-2 text-sm text-gray-500 hover:text-gray-700"
//                 >
//                     {showPassword ? "Hide" : "Show"}
//                 </button>
//                 {errors.password && (
//                     <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>
//                 )}
//             </div>

//             {/* Submit button */}
//             <button
//                 type="submit"
//                 className={`w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition mt-2 flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
//                 disabled={loading}
//             >
//                 {loading && (
//                     <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
//                     </svg>
//                 )}
//                 {isSignIn ? "Đăng nhập" : "Đăng ký"}
//             </button>
//         </form>
//     );
// };

// export default AuthForm;