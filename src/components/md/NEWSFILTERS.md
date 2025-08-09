# NEWSFILTERS.md - Component NewsFilters

## 1. Tổng quan
NewsFilters.js là component bộ lọc tin tức: tìm kiếm, lọc danh mục, sắp xếp, lọc tác giả, nổi bật...

## 2. Props
- filters: Object trạng thái filter
- setFilters: Hàm cập nhật filter
- onFilterChange: Callback khi đổi filter
- onSearch: Callback khi tìm kiếm
- onClearFilters: Callback khi xóa filter
- hasActiveFilters: Có filter nào đang áp dụng không

## 3. Chức năng chính
- Lọc tin tức theo danh mục, sắp xếp, tác giả, nổi bật
- Tìm kiếm theo từ khóa
- Hiển thị trạng thái filter đang áp dụng

## 4. Ví dụ sử dụng
```js
<NewsFilters filters={filters} setFilters={setFilters} onFilterChange={fn} />
```

## 5. Lưu ý
- Nên truyền đúng format filters