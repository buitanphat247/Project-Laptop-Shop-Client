# CKEditor Configuration Separation

## Tổng quan

File cấu hình CKEditor đã được tách ra khỏi component `CKEditorComponent.js` và đặt trong file riêng `src/config/ckeditor.js`. Điều này giúp quản lý cấu hình dễ dàng hơn và có thể tái sử dụng cho nhiều component khác.

## Cấu trúc file

### `src/config/ckeditor.js`

File này chứa tất cả các cấu hình cho CKEditor:

```javascript
// Các hàm cấu hình chính
export const getCKEditorConfig = (placeholder) => { /* ... */ };
export const getFullToolbarConfig = () => { /* ... */ };
export const getSimpleToolbarConfig = () => { /* ... */ };
export const getNewsToolbarConfig = () => { /* ... */ };
export const getProductToolbarConfig = () => { /* ... */ };

// Cấu hình mặc định
export const defaultCKEditorConfig = getCKEditorConfig();

// Object chứa tất cả loại cấu hình
export const CKEditorConfigs = {
    default: getCKEditorConfig,
    full: getFullToolbarConfig,
    simple: getSimpleToolbarConfig,
    news: getNewsToolbarConfig,
    product: getProductToolbarConfig
};

// Hàm helper để lấy cấu hình theo loại
export const getConfigByType = (type, placeholder) => { /* ... */ };
```

## Các loại cấu hình có sẵn

### 1. **Default Config** (`getCKEditorConfig`)
```javascript
// Cấu hình mặc định với toolbar cơ bản
const config = getCKEditorConfig('Nhập nội dung...');
```

**Toolbar bao gồm:**
- Heading, Bold, Italic, Link
- BulletedList, NumberedList
- Outdent, Indent
- ImageUpload, BlockQuote, InsertTable, MediaEmbed
- Undo, Redo

### 2. **Full Config** (`getFullToolbarConfig`)
```javascript
// Cấu hình đầy đủ với tất cả tính năng
const fullConfig = getFullToolbarConfig();
```

**Toolbar bao gồm:**
- Tất cả tính năng từ default
- Underline, Strikethrough
- FontSize, FontFamily, FontColor, FontBackgroundColor
- Alignment
- HorizontalLine, PageBreak
- Nhiều heading levels (H1-H6)

### 3. **Simple Config** (`getSimpleToolbarConfig`)
```javascript
// Cấu hình đơn giản cho input cơ bản
const simpleConfig = getSimpleToolbarConfig();
```

**Toolbar bao gồm:**
- Bold, Italic, Link
- BulletedList, NumberedList
- Undo, Redo

### 4. **News Config** (`getNewsToolbarConfig`)
```javascript
// Cấu hình tối ưu cho tin tức
const newsConfig = getNewsToolbarConfig();
```

**Toolbar bao gồm:**
- Heading, Bold, Italic, Link
- BulletedList, NumberedList
- Outdent, Indent
- ImageUpload, BlockQuote, InsertTable
- Undo, Redo

### 5. **Product Config** (`getProductToolbarConfig`)
```javascript
// Cấu hình tối ưu cho mô tả sản phẩm
const productConfig = getProductToolbarConfig();
```

**Toolbar bao gồm:**
- Bold, Italic, Link
- BulletedList, NumberedList
- ImageUpload, BlockQuote, InsertTable
- Undo, Redo

## Cách sử dụng

### 1. **Trong CKEditorComponent.js**

```javascript
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// Import cấu hình từ file config riêng
import { getCKEditorConfig } from '../../config/ckeditor';

const CKEditorComponent = ({ 
    data = '', 
    onChange, 
    placeholder = 'Nhập nội dung...', 
    height = '300px',
    disabled = false,
    configType = 'default' // Thêm prop để chọn loại cấu hình
}) => {
    // Sử dụng cấu hình từ file config
    const editorConfiguration = getCKEditorConfig(placeholder);

    return (
        <div className="ckeditor-wrapper">
            <CKEditor
                editor={ClassicEditor}
                config={editorConfiguration}
                data={data}
                disabled={disabled}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    if (onChange) {
                        onChange(data);
                    }
                }}
                onReady={editor => {
                    // Set custom height
                    editor.editing.view.change(writer => {
                        writer.setStyle('height', height, editor.editing.view.document.getRoot());
                    });
                }}
                onError={(error, { willEditorRestart }) => {
                    if (willEditorRestart) {
                        editor.ui.view.toolbar.element.remove();
                    }
                }}
            />
        </div>
    );
};
```

### 2. **Sử dụng các loại cấu hình khác nhau**

```javascript
// Sử dụng cấu hình đơn giản
<CKEditorComponent 
    configType="simple"
    placeholder="Nhập mô tả ngắn..."
/>

// Sử dụng cấu hình cho tin tức
<CKEditorComponent 
    configType="news"
    placeholder="Nhập nội dung tin tức..."
/>

// Sử dụng cấu hình cho sản phẩm
<CKEditorComponent 
    configType="product"
    placeholder="Nhập mô tả sản phẩm..."
/>

// Sử dụng cấu hình đầy đủ
<CKEditorComponent 
    configType="full"
    placeholder="Nhập nội dung chi tiết..."
/>
```

### 3. **Sử dụng trực tiếp từ config**

```javascript
import { 
    getCKEditorConfig, 
    getNewsToolbarConfig, 
    getProductToolbarConfig,
    getConfigByType 
} from '../config/ckeditor';

// Lấy cấu hình mặc định
const defaultConfig = getCKEditorConfig('Nhập nội dung...');

// Lấy cấu hình cho tin tức
const newsConfig = getNewsToolbarConfig();

// Lấy cấu hình theo loại
const config = getConfigByType('news', 'Nhập tin tức...');
```

## Lợi ích của việc tách cấu hình

### 1. **Separation of Concerns**
- Component chỉ tập trung vào logic UI
- Cấu hình được quản lý riêng biệt
- Dễ maintain và update

### 2. **Reusability**
```javascript
// Có thể sử dụng cấu hình cho nhiều component khác
import { getNewsToolbarConfig } from '../config/ckeditor';

// Trong NewsEditor.js
const NewsEditor = () => {
    const config = getNewsToolbarConfig();
    return <CKEditor config={config} />;
};

// Trong ProductEditor.js
const ProductEditor = () => {
    const config = getProductToolbarConfig();
    return <CKEditor config={config} />;
};
```

### 3. **Easy Configuration Management**
```javascript
// Dễ dàng thay đổi cấu hình cho toàn bộ ứng dụng
export const getNewsToolbarConfig = () => {
    return {
        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            // Thêm tính năng mới ở đây
            'code',
            'codeBlock',
            // ...
        ],
        // ...
    };
};
```

### 4. **Testing**
```javascript
// Có thể test cấu hình riêng biệt
import { getCKEditorConfig } from '../config/ckeditor';

describe('CKEditor Config', () => {
    test('should have required toolbar items', () => {
        const config = getCKEditorConfig();
        expect(config.toolbar).toContain('bold');
        expect(config.toolbar).toContain('italic');
        expect(config.toolbar).toContain('link');
    });
});
```

## Cấu trúc cấu hình

### Toolbar Structure
```javascript
toolbar: [
    'heading',           // Heading dropdown
    '|',                 // Separator
    'bold',              // Bold button
    'italic',            // Italic button
    'link',              // Link button
    'bulletedList',      // Bullet list
    'numberedList',      // Numbered list
    '|',                 // Separator
    'outdent',           // Outdent
    'indent',            // Indent
    '|',                 // Separator
    'imageUpload',       // Image upload
    'blockQuote',        // Block quote
    'insertTable',       // Insert table
    'mediaEmbed',        // Media embed
    '|',                 // Separator
    'undo',              // Undo
    'redo'               // Redo
]
```

### Heading Options
```javascript
heading: {
    options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
    ]
}
```

### Image Configuration
```javascript
image: {
    toolbar: [
        'imageTextAlternative',    // Alt text
        'imageStyle:full',         // Full width
        'imageStyle:side'          // Side image
    ]
}
```

### Table Configuration
```javascript
table: {
    contentToolbar: [
        'tableColumn',             // Column operations
        'tableRow',                // Row operations
        'mergeTableCells'          // Merge cells
    ]
}
```

## Best Practices

### 1. **Sử dụng cấu hình phù hợp**
```javascript
// ✅ Tốt: Sử dụng cấu hình phù hợp với mục đích
<CKEditorComponent configType="news" />

// ❌ Không tốt: Sử dụng cấu hình đầy đủ cho input đơn giản
<CKEditorComponent configType="full" />
```

### 2. **Customize placeholder**
```javascript
// ✅ Tốt: Placeholder rõ ràng
<CKEditorComponent 
    configType="product"
    placeholder="Nhập mô tả chi tiết sản phẩm..."
/>

// ❌ Không tốt: Placeholder chung chung
<CKEditorComponent placeholder="Nhập nội dung..." />
```

### 3. **Extend configuration**
```javascript
// ✅ Tốt: Tạo cấu hình mới cho use case cụ thể
export const getCustomToolbarConfig = () => {
    return {
        toolbar: [
            'bold',
            'italic',
            'link',
            'customButton'  // Custom button
        ],
        // Custom configuration
    };
};
```

## Kết luận

Việc tách cấu hình CKEditor ra file riêng mang lại nhiều lợi ích:

1. **Code organization** - Cấu hình được quản lý tập trung
2. **Reusability** - Có thể sử dụng cho nhiều component
3. **Maintainability** - Dễ dàng cập nhật và maintain
4. **Flexibility** - Nhiều loại cấu hình khác nhau
5. **Testing** - Có thể test cấu hình riêng biệt

**Sử dụng khi:**
- Cần nhiều loại cấu hình khác nhau
- Cần tái sử dụng cấu hình
- Cần quản lý cấu hình tập trung

**Không sử dụng khi:**
- Chỉ có một loại cấu hình đơn giản
- Không cần tái sử dụng cấu hình 