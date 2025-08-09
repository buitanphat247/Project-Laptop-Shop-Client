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

export default CKEditorComponent;