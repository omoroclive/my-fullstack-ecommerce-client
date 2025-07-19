import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Lazy Image Component
const LazyImage = ({ src, alt, className, onLoad }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="relative overflow-hidden w-full h-full">
      {/* Skeleton loader */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 ease-in-out`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Error state */}
      {error && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
          <div className="w-16 h-16 mb-2 opacity-50">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm">Image not found</span>
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onClick }) => {
  return (
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-72 bg-gray-50 overflow-hidden">
        <LazyImage
          src={product.images?.[0]?.url || "/placeholder.png"}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        
        {/* Brand badge */}
        {product.brand && (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              {product.brand}
            </span>
          </div>
        )}
        
        {/* Category badge */}
        {product.category && (
          <div className="absolute top-3 right-3">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
              {product.category}
            </span>
          </div>
        )}
        
        {/* Quick view button on hover */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all duration-200 text-sm font-medium">
            Quick View
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
            {product.title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-orange-600">
              Ksh {product.price?.toLocaleString() || product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                Ksh {product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Rating if available */}
          {product.rating && (
            <div className="flex items-center">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                ({product.rating})
              </span>
            </div>
          )}
        </div>
        
        {/* Stock status */}
        {product.stock !== undefined && (
          <div className="mt-3">
            {product.stock > 0 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Out of Stock
              </span>
            )}
          </div>
        )}
        
        {/* Add to cart button */}
        <button 
          className="w-full mt-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart functionality here
            console.log('Add to cart:', product._id);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
    <div className="w-32 h-32 mb-6 opacity-50">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
    <p className="text-gray-600 text-center max-w-md">
      We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
    </p>
    <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200">
      Clear Filters
    </button>
  </div>
);

// Loading State Component
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="h-72 bg-gray-200 animate-pulse"></div>
        <div className="p-5 space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

// Main ProductGrid Component
const ProductGrid = ({ products, loading = false }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/shop/details/${productId}`);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!products || products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full">
      {/* Products count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-800">{products.length}</span> products
        </p>
        
        {/* Sort dropdown could go here */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
            <option>Rating</option>
          </select>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={() => handleProductClick(product._id)}
          />
        ))}
      </div>
      
      {/* Load more button if needed */}
      {products.length > 0 && products.length % 12 === 0 && (
        <div className="flex justify-center mt-12">
          <button className="bg-white border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-200 transform hover:scale-105">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;