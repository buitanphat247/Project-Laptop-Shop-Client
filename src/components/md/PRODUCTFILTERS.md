# PRODUCTFILTERS.md - Component ProductFilters

## 1. Tổng quan
ProductFilters.js là component bộ lọc sản phẩm: tìm kiếm, lọc thương hiệu, sắp xếp, đánh giá, tính năng...

## 2. Props
- filters: Object trạng thái filter
- setFilters: Hàm cập nhật filter
- onFilterChange: Callback khi đổi filter
- onSearch: Callback khi tìm kiếm
- onClearFilters: Callback khi xóa filter
- hasActiveFilters: Có filter nào đang áp dụng không
- filtersVisible: Trạng thái hiển thị filter nâng cao
- setFiltersVisible: Hàm toggle filter nâng cao

## 3. Chức năng chính
- Lọc sản phẩm theo thương hiệu, sắp xếp, đánh giá, tính năng, giá
- Tìm kiếm theo từ khóa
- Hiển thị trạng thái filter đang áp dụng

## 4. Ví dụ sử dụng
```js
<ProductFilters filters={filters} setFilters={setFilters} onFilterChange={fn} />
```

## 5. Lưu ý
- Nên truyền đúng format filters
- Responsive tốt cho mobile