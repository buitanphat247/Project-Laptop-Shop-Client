import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';

const OTPInput = ({ value, onChange, onComplete, length = 6, disabled = false }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (value) {
            const valueArray = value.split('').slice(0, length);
            const newOtp = [...new Array(length).fill('')];
            valueArray.forEach((digit, index) => {
                newOtp[index] = digit;
            });
            setOtp(newOtp);
        }
    }, [value, length]);

    const handleChange = (index, value) => {
        if (disabled) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Gọi onChange với chuỗi OTP
        const otpString = newOtp.join('');
        onChange?.(otpString);

        // Tự động focus ô tiếp theo
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Kiểm tra nếu đã nhập đủ
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === length) {
            onComplete?.(otpString);
        }
    };

    const handleKeyDown = (index, e) => {
        if (disabled) return;

        // Xử lý phím Backspace
        if (e.key === 'Backspace') {
            if (otp[index] === '') {
                // Nếu ô hiện tại trống, focus ô trước đó
                if (index > 0) {
                    inputRefs.current[index - 1]?.focus();
                }
            } else {
                // Xóa ký tự trong ô hiện tại
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
                onChange?.(newOtp.join(''));
            }
        }

        // Chỉ cho phép nhập số
        if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        if (disabled) return;

        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
        
        if (pastedData.length > 0) {
            const newOtp = [...new Array(length).fill('')];
            pastedData.split('').forEach((digit, index) => {
                if (index < length) {
                    newOtp[index] = digit;
                }
            });
            setOtp(newOtp);
            onChange?.(newOtp.join(''));
            
            // Focus ô cuối cùng đã nhập
            const lastFilledIndex = Math.min(pastedData.length - 1, length - 1);
            inputRefs.current[lastFilledIndex]?.focus();
        }
    };

    return (
        <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
                <div key={index} className="relative">
                    <Input
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={`
                            w-12 h-12 text-center text-lg font-semibold
                            border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                            transition-all duration-200
                            ${digit ? 'border-green-500 bg-green-50' : 'border-gray-300'}
                            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-blue-400'}
                        `}
                        maxLength={1}
                        inputMode="numeric"
                        autoComplete="off"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                    />
                    {index === 2 && (
                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                            <span className="text-gray-400 text-sm">•••</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default OTPInput;


