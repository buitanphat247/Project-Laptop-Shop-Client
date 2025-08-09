/**
 * CKEditor Configuration
 * 
 * File cấu hình cho CKEditor component.
 * Bao gồm toolbar, heading options, image settings, table settings, v.v.
 */

/**
 * Cấu hình mặc định cho CKEditor
 * 
 * @param {string} placeholder - Placeholder text cho editor
 * @returns {object} - Cấu hình CKEditor
 * 
 * @example
 * const config = getCKEditorConfig('Nhập nội dung...');
 */
export const getCKEditorConfig = (placeholder = 'Nhập nội dung...') => {
    return {
        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            '|',
            'undo',
            'redo'
        ],
        placeholder: placeholder,
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
            ]
        },
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:full',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        }
    };
};

/**
 * Cấu hình toolbar đầy đủ cho CKEditor
 * 
 * @returns {object} - Cấu hình toolbar đầy đủ
 * 
 * @example
 * const fullConfig = getFullToolbarConfig();
 */
export const getFullToolbarConfig = () => {
    return {
        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'link',
            '|',
            'fontSize',
            'fontFamily',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'alignment',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'imageStyle:full',
            'imageStyle:side',
            '|',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            '|',
            'horizontalLine',
            'pageBreak',
            '|',
            'undo',
            'redo'
        ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:full',
                'imageStyle:side',
                'imageStyle:alignLeft',
                'imageStyle:alignCenter',
                'imageStyle:alignRight'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableCellProperties',
                'tableProperties'
            ]
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 48, 60, 72, 96]
        },
        fontFamily: {
            options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Courier New, Courier, monospace',
                'Georgia, serif',
                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                'Tahoma, Geneva, sans-serif',
                'Times New Roman, Times, serif',
                'Trebuchet MS, Helvetica, sans-serif',
                'Verdana, Geneva, sans-serif'
            ]
        }
    };
};

/**
 * Cấu hình toolbar đơn giản cho CKEditor
 * 
 * @returns {object} - Cấu hình toolbar đơn giản
 * 
 * @example
 * const simpleConfig = getSimpleToolbarConfig();
 */
export const getSimpleToolbarConfig = () => {
    return {
        toolbar: [
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'undo',
            'redo'
        ],
        placeholder: 'Nhập nội dung...'
    };
};

/**
 * Cấu hình toolbar cho tin tức
 * 
 * @returns {object} - Cấu hình toolbar cho tin tức
 * 
 * @example
 * const newsConfig = getNewsToolbarConfig();
 */
export const getNewsToolbarConfig = () => {
    return {
        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            '|',
            'undo',
            'redo'
        ],
        placeholder: 'Nhập nội dung tin tức...',
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
            ]
        },
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:full',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        }
    };
};

/**
 * Cấu hình toolbar cho mô tả sản phẩm
 * 
 * @returns {object} - Cấu hình toolbar cho mô tả sản phẩm
 * 
 * @example
 * const productConfig = getProductToolbarConfig();
 */
export const getProductToolbarConfig = () => {
    return {
        toolbar: [
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            '|',
            'undo',
            'redo'
        ],
        placeholder: 'Nhập mô tả sản phẩm...',
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:full',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        }
    };
};

/**
 * Cấu hình mặc định cho CKEditor
 */
export const defaultCKEditorConfig = getCKEditorConfig();

/**
 * Các loại cấu hình có sẵn
 */
export const CKEditorConfigs = {
    default: getCKEditorConfig,
    full: getFullToolbarConfig,
    simple: getSimpleToolbarConfig,
    news: getNewsToolbarConfig,
    product: getProductToolbarConfig
};

/**
 * Lấy cấu hình theo loại
 * 
 * @param {string} type - Loại cấu hình ('default', 'full', 'simple', 'news', 'product')
 * @param {string} placeholder - Placeholder text
 * @returns {object} - Cấu hình CKEditor
 * 
 * @example
 * const config = getConfigByType('news', 'Nhập tin tức...');
 */
export const getConfigByType = (type = 'default', placeholder) => {
    const configFunction = CKEditorConfigs[type] || CKEditorConfigs.default;
    return configFunction(placeholder);
}; 