# Layouts trong dự án React

## 1. Mục đích của Layout

Layout là các thành phần khung (wrapper) dùng để định nghĩa cấu trúc tổng thể cho từng nhóm trang trong ứng dụng. Layout giúp tái sử dụng các phần giao diện chung như Header, Footer, Sidebar, đồng thời đảm bảo sự nhất quán về UI/UX trên toàn bộ hệ thống.

## 2. Các loại Layout chính

### MainLayout
- **Vai trò:**
  - Dùng cho các trang ngoài (khách, user, landing page...)
  - Bao gồm Header, Footer, và vùng nội dung chính ở giữa.
- **Cấu trúc:**
  ```jsx
  <Header />
  <main>
    <Outlet />
  </main>
  <Footer />
  ```
- **Cách sử dụng:**
  - Dùng với React Router:
    ```jsx
    <Route element={<MainLayout />}>
      {/* Các route con sẽ được render vào <Outlet /> */}
    </Route>
    ```
- **Best practice:**
  - Đặt các thành phần dùng chung (Header, Footer) ở ngoài <Outlet /> để không bị render lại khi chuyển trang.

### AdminLayout
- **Vai trò:**
  - Dùng cho các trang quản trị (admin dashboard).
  - Thường có Sidebar cố định, Header (nếu cần), và vùng nội dung chính.
- **Cấu trúc:**
  ```jsx
  <SectionSideBar />
  <main>
    <Outlet />
  </main>
  ```
- **Cách sử dụng:**
  - Dùng với React Router:
    ```jsx
    <Route path="/admin" element={<AdminLayout />}>
      {/* Các route con admin sẽ được render vào <Outlet /> */}
    </Route>
    ```
- **Best practice:**
  - Sidebar nên tách thành component riêng để dễ bảo trì.
  - Đảm bảo layout responsive, ẩn sidebar trên mobile nếu cần.

## 3. Khi nào nên tạo layout mới?
- Khi một nhóm trang có cấu trúc khung khác biệt rõ rệt (ví dụ: trang khách vs trang admin).
- Khi muốn tái sử dụng các phần giao diện lớn (header, sidebar, footer) cho nhiều route con.

## 4. Lưu ý khi xây dựng layout
- Sử dụng `<Outlet />` của React Router để render các route con đúng vị trí mong muốn.
- Đặt layout ở cấp route phù hợp để tránh lồng ghép không cần thiết.
- Có thể truyền props hoặc context vào layout để điều khiển trạng thái giao diện (ví dụ: theme, user info).

## 5. Tham khảo thêm
- [React Router - Layout Routes](https://reactrouter.com/en/main/route/layout)
- [ReactJS - Component Composition](https://react.dev/learn/passing-props-to-a-component)

---

> **Tóm lại:**
> - Layout giúp tổ chức code rõ ràng, tái sử dụng giao diện, và đảm bảo trải nghiệm người dùng nhất quán.
> - Hãy tách layout thành các component riêng biệt cho từng nhóm trang lớn trong dự án.