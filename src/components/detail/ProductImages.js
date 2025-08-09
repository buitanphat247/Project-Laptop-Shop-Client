import React from 'react';
import { Image, Carousel } from 'antd';

const ProductImages = ({ images, productName, selectedImageIndex, setSelectedImageIndex }) => (
  <div className="bg-white border rounded-lg overflow-hidden p-4">
    <div className="relative">
      <Image.PreviewGroup>
        <Carousel
          autoplay
          dots={false}
          beforeChange={(current, next) => setSelectedImageIndex(next)}
        >
          {images.map((image, index) => (
            <div key={index}>
              <Image
                src={image}
                alt={`${productName} - ${index + 1}`}
                className="w-full h-80 object-cover rounded"
              />
            </div>
          ))}
        </Carousel>
      </Image.PreviewGroup>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`w-12 h-12 object-cover rounded cursor-pointer border-2 transition-all ${selectedImageIndex === index
                ? 'border-blue-500'
                : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => setSelectedImageIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

export default ProductImages;