/**
 * RequireAuth - Route Guard Component
 * 
 * Component này bảo vệ các route yêu cầu đăng nhập.
 * Nó kiểm tra user đã đăng nhập chưa và redirect về trang auth nếu chưa.
 * 
 * Cách sử dụng:
 * <RequireAuth>
 *   <ProtectedPage />
 * </RequireAuth>
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Hàm lấy giá trị cookie theo tên
 * 
 * @param {string} name - Tên cookie cần lấy
 * @returns {string} - Giá trị cookie hoặc chuỗi rỗng nếu không tìm thấy
 */
function getCookie(name) {
  // Tạo chuỗi tìm kiếm với format "; name=value"
  const value = `; ${document.cookie}`;
  
  // Tách chuỗi theo pattern "; name="
  const parts = value.split(`; ${name}=`);
  
  // Nếu tìm thấy cookie (parts.length === 2)
  if (parts.length === 2) {
    // Lấy phần cuối cùng và tách theo dấu ";"
    return parts.pop().split(';').shift();
  }
  
  // Trả về chuỗi rỗng nếu không tìm thấy
  return '';
}

/**
 * RequireAuth Component
 * 
 * Route guard component kiểm tra trạng thái đăng nhập.
 * Nếu user chưa đăng nhập, redirect về trang auth.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Components con cần được bảo vệ
 * @returns {React.ReactNode} - Component con nếu đã đăng nhập, hoặc redirect component
 */
function RequireAuth({ children }) {
  /**
   * Bước 1: Lấy access token từ cookie
   * 
   * getCookie('accessToken') sẽ:
   * - Tìm cookie có tên 'accessToken'
   * - Trả về giá trị token hoặc chuỗi rỗng
   */
  const accessToken = getCookie('accessToken');
  
  /**
   * Bước 2: Kiểm tra trạng thái đăng nhập
   * 
   * !!accessToken sẽ convert:
   * - Chuỗi rỗng "" -> false
   * - Token hợp lệ -> true
   * - null/undefined -> false
   */
  const isLoggedIn = !!accessToken;
  
  /**
   * Bước 3: Lấy thông tin location hiện tại
   * 
   * useLocation() trả về object chứa:
   * - pathname: đường dẫn hiện tại
   * - search: query parameters
   * - hash: fragment identifier
   * - state: state được truyền qua navigation
   */
  const location = useLocation();
  
  /**
   * Bước 4: Kiểm tra và redirect nếu chưa đăng nhập
   * 
   * Nếu user chưa đăng nhập:
   * - Redirect về /auth
   * - Truyền location hiện tại qua state
   * - Sử dụng replace=true để không lưu vào history
   */
  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  /**
   * Bước 5: Cho phép truy cập
   * 
   * Nếu user đã đăng nhập:
   * - Render component con (children)
   */
  return children;
}

export default RequireAuth;