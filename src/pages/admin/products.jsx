import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const renderProductImage = (product) => {
    const hasImages = Array.isArray(product.images) && product.images.length > 0;
    const imageUrl = hasImages ? product.images[0]?.url : "/placeholder.png";

    return (
      <img
        src={imageUrl}
        alt={product.title || "Product"}
        className="w-full h-48 object-cover rounded-md mb-4"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/placeholder.png";
        }}
      />
    );
  };

  if (loading) return <p className="text-center text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products?.map((product) => (
        <div
          key={product._id}
          className="bg-white shadow-md rounded-lg overflow-hidden relative"
        >
          {renderProductImage(product)}

          <div className="p-4">
            <h2 className="text-lg font-semibold truncate">{product.title}</h2>
            <p className="text-gray-600">${product.price}</p>
            <div className="flex justify-between mt-4">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => navigate(`/edit-product/${product._id}`)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleDelete(product._id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;

