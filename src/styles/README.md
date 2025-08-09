# CSS Structure Documentation

## Overview
CSS files have been modularized for better organization and maintainability. The main `index.css` file now imports separate CSS modules based on functionality.

## File Structure

### 📁 `index.css` (Main Entry Point)
- **Purpose**: Main CSS file that imports all modules
- **Contains**: 
  - Tailwind CSS directives
  - Base styles
  - Module imports

### 📁 `animations.css`
- **Purpose**: All animation keyframes and animation classes
- **Contains**:
  - `@keyframes` definitions (shake, fadeIn, fadeOut, fadeInUp, marquee, slideDown, shimmer, pulse, spin)
  - Animation utility classes (`.animate-fadeIn-fast`, `.animate-fadeOut-fast`, `.animate-bounce`, etc.)
  - Loading animations (`.shimmer`, `.skeleton-card`)
  - Sticky header animation (`.is-sticky`)

### 📁 `components.css`
- **Purpose**: Component-specific styles
- **Contains**:
  - Cart table styles (`.cart-product-name`, `.cart-table-row`, `.cart-table-cell`)
  - Dashboard styles (`.dashboard-container`, `.dashboard-card`)
  - Gradient card styles (`.gradient-green`, `.gradient-blue`, `.gradient-purple`, `.gradient-orange`)
  - Stats table styles (`.stats-table-card`)
  - Activity item styles (`.activity-item`)
  - Loading overlay (`.loading-overlay`)
  - Particles background (`#particles-js`)
  - CKEditor styles

### 📁 `content-wrapper.css`
- **Purpose**: Content typography and layout styles
- **Contains**:
  - Content wrapper base styles
  - Typography (headings, paragraphs, lists)
  - Links and emphasis
  - Images and tables
  - Blockquotes and code blocks
  - Responsive typography for mobile

### 📁 `antd-overrides.css`
- **Purpose**: Ant Design component customizations
- **Contains**:
  - Custom table styles (`.custom-table`)
  - Enhanced card hover effects
  - Badge animations
  - Button enhancements
  - Modal and switch improvements
  - Table, pagination, tag, and avatar enhancements

### 📁 `utilities.css`
- **Purpose**: Utility classes and responsive styles
- **Contains**:
  - Custom scrollbar styles
  - Responsive breakpoints
  - Scrollbar hiding utilities
  - Layout utilities

## Usage

### Import Order
The import order in `index.css` is important:
1. `animations.css` - Base animations first
2. `components.css` - Component styles
3. `content-wrapper.css` - Content styles
4. `antd-overrides.css` - Component overrides
5. `utilities.css` - Utilities last

### Adding New Styles
- **Animations**: Add to `animations.css`
- **Component styles**: Add to `components.css`
- **Content styles**: Add to `content-wrapper.css`
- **Ant Design overrides**: Add to `antd-overrides.css`
- **Utilities**: Add to `utilities.css`

### Benefits of Modularization
1. **Maintainability**: Easier to find and modify specific styles
2. **Reusability**: Styles can be imported independently
3. **Performance**: Better caching and loading
4. **Team Collaboration**: Multiple developers can work on different modules
5. **Testing**: Easier to test individual style modules

## Responsive Design
All responsive styles are organized by breakpoint:
- `@media (max-width: 1024px)` - Large tablets
- `@media (max-width: 768px)` - Tablets
- `@media (max-width: 640px)` - Mobile

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- Tailwind CSS v3+ required
