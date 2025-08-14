/**
 * Encoding/Decoding utilities
 */

// Hàm mã hóa Base64 cải thiện
export const encodeBase64 = (str) => {
    try {
        if (!str || typeof str !== 'string') {
            console.warn('Invalid input for encodeBase64:', str);
            return '';
        }

        // Method 1: Modern approach
        const encoded = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
            return String.fromCharCode('0x' + p1);
        }));

        // console.log('Encoded successfully:', str.substring(0, 50) + '...');
        return encoded;
    } catch (error) {
        console.error('Encode error:', error);

        // Fallback method
        try {
            return btoa(unescape(encodeURIComponent(str)));
        } catch (fallbackError) {
            console.error('Fallback encode failed:', fallbackError);
            return '';
        }
    }
};

// Hàm giải mã Base64 cải thiện
export const decodeBase64 = (str) => {
    try {
        if (!str || typeof str !== 'string') {
            console.warn('Invalid input for decodeBase64:', str);
            return null;
        }

        // Clean the string
        const cleanStr = str.trim().replace(/\s/g, '');

        if (cleanStr.length === 0) {
            console.warn('Empty string for decodeBase64');
            return null;
        }

        // Sử dụng một phương pháp duy nhất: atob + decodeURIComponent
        const decoded = atob(cleanStr);
        const result = decodeURIComponent(escape(decoded));
        
        // console.log('Decoded successfully');
        return result;
        
    } catch (error) {
        console.error('Decode error:', error);
        return null;
    }
};

// Hàm debug để test encode/decode
export const testEncodeDecode = (testString = 'Hello World! 123 àáâãèéêìíîòóôõùúûýđ') => {
    // console.log('=== Testing Encode/Decode ===');
    // console.log('Original string:', testString);

    const encoded = encodeBase64(testString);
    // console.log('Encoded:', encoded);

    const decoded = decodeBase64(encoded);
    // console.log('Decoded:', decoded);

    const isSuccess = decoded === testString;
    // console.log('Test result:', isSuccess ? '✅ SUCCESS' : '❌ FAILED');

    if (!isSuccess) {
        // console.log('Expected:', testString);
        // console.log('Got:', decoded);
    }

    return isSuccess;
}; 