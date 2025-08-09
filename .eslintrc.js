module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [
        'react',
        'react-hooks'
    ],
    rules: {
        // Tắt hoàn toàn console warnings và errors
        'no-console': 'off',
        'no-debugger': 'off',
        
        // Tắt các rule về unused variables và imports
        'no-unused-vars': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',

        // Tắt rule về anchor valid
        'jsx-a11y/anchor-is-valid': 'off',

        // Tắt các rule React có thể gây phiền toái
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/no-unescaped-entities': 'off',
        'react/jsx-key': 'off',

        // Tắt các rule JavaScript có thể gây phiền toái
        'no-undef': 'off',
        'no-redeclare': 'off',
        'no-constant-condition': 'off',
        'no-empty': 'off',
        'no-prototype-builtins': 'off',
        
        // Tắt các rule về async/await
        'no-async-promise-executor': 'off',
        'require-await': 'off',
        
        // Tắt các rule về regex và escape
        'no-useless-escape': 'off',
        'no-case-declarations': 'off',
        
        // Cho phép empty catch blocks
        'no-empty-catch': 'off',
        
        // Cho phép reassign parameters
        'no-param-reassign': 'off',
        
        // Tắt rule về prefer const
        'prefer-const': 'off',
        
        // Tắt rule về eqeqeq (== vs ===)
        'eqeqeq': 'off',
        
        // React Hooks rules (giữ lại để tránh bugs)
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    // Ignore các file không cần lint
    ignorePatterns: [
        'node_modules/',
        'build/',
        'dist/',
        '*.min.js',
        'public/',
        'coverage/',
        'src/trash/'  // Thêm thư mục trash vào ignore
    ]
};