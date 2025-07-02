import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const RecentlySearched = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRecentlySearched = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get(`${BASE_URL}/api/recently-searched`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRecentSearches(response.data.searches);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch recently searched data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentlySearched();
  }, [BASE_URL]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recently Searched</h1>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : recentSearches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="border rounded-lg shadow hover:shadow-lg transition duration-300 cursor-pointer p-4"
              onClick={() =>
                search.productId ? navigate(`/shop/details/${search.productId}`) : null
              }
            >
              <h3 className="text-lg font-semibold">
                {search.query || "Unknown Query"}
              </h3>
              {search.productId && (
                <p className="text-blue-600 mt-2">View Product</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-6">
          No recent searches found.
        </p>
      )}
    </div>
  );
};

export default RecentlySearched;
