import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../store/product/productsSlice";
import ProductGrid from "./ProductGrid";

const SearchResults = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products?.items || []);
  const isLoading = useSelector((state) => state.products?.status === "loading");

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products when query changes
  useEffect(() => {
    //console.log(" Products received:", products);
    if (query && products.length > 0) {
      const results = products.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]); // Ensure it's always an array
    }
  }, [query, products]);

  if (isLoading) return <p>Loading products...</p>;

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
