import React from "react";
import { useNavigate } from "react-router-dom";

const ProductGrid = ({ products }) => {
  const navigate = useNavigate(); 

  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

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
            src={product.images?.[0]?.url || "/placeholder.png"}
            alt={product.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="p-4 text-center">
            <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
            <p className="text-black font-bold">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
