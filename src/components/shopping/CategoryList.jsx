// CategoryList.jsx
import React from "react";

const CategoryList = ({ onCategorySelect }) => {
  const categories = ["Electronics", "Clothing", "Shoes", "Accessories"]; // Example categories

  return (
    <div>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)} // Dispatch the selected category to Redux
          className="px-4 py-2 text-sm"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;
