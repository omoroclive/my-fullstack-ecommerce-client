import React from "react";

const ProductGrid = ({ products, navigate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
          onClick={() => navigate(`/shop/details/${product._id}`)}
        >
          {/* Product Image */}
          <img
            src={product.images[0]?.url || "/placeholder.png"}
            alt={product.title}
            className="w-full h-64 object-cover rounded-t-lg" // Full-width image with increased height
          />
          <div className="p-4 text-center"> {/* Center align the title and price */}
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className="text-black font-bold">${product.price}</p> {/* Price color changed to black */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;

