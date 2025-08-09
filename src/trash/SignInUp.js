// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthTabs from "../components/AuthTabs";
// import AuthForm from "../components/AuthForm";

// const SignInUp = () => {
//     const [mode, setMode] = useState("signin"); // 'signin' hoặc 'signup'
//     const [showPassword, setShowPassword] = useState(false);
//     const navigate = useNavigate();

//     const isSignIn = mode === "signin";

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 ">
//             <div className="bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-md">
//                 {/* Tabs */}
//                 <AuthTabs isSignIn={isSignIn} setMode={setMode} />

//                 {/* Form */}
//                 <AuthForm
//                     isSignIn={isSignIn}
//                     showPassword={showPassword}
//                     setShowPassword={setShowPassword}
//                 />

//                 {/* Back to Home */}
//                 <p className="text-sm text-center mt-4 text-gray-500">
//                     <button
//                         onClick={() => navigate("/")}
//                         className="hover:underline text-blue-500"
//                     >
//                         ← Back to Home
//                     </button>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default SignInUp;
