// BrandList.jsx
import React from "react";

const BrandList = ({ onBrandSelect }) => {
  const brands = ["Nike", "Adidas", "Puma", "Zara"]; // Example brands

  return (
    <div>
      {brands.map((brand) => (
        <button
          key={brand}
          onClick={() => onBrandSelect(brand)} // Dispatch the selected brand to Redux
          className="px-4 py-2 text-sm"
        >
          {brand}
        </button>
      ))}
    </div>
  );
};

export default BrandList;
