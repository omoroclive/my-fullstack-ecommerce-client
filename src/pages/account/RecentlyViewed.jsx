import React from "react";
import { useSelector } from "react-redux";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RecentlyViewed = () => {
  const recentlyViewed = useSelector((state) => state.recentlyViewed); // Access state
  const navigate = useNavigate();

  if (recentlyViewed.length === 0) {
    return (
      <Typography variant="h6" className="text-center mt-10">
        No recently viewed products. Start exploring!
      </Typography>
    );
  }

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mt-6 font-bold">
        Recently Viewed 
      </Typography>
      <Grid container spacing={4}>
        {recentlyViewed.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Box
              className="border border-gray-200 mt-6 rounded-lg p-4 transition hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-[200px] object-cover rounded"
              />
              <Typography variant="h6" className="mt-2 font-medium">
                {product.title}
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                ${product.price.toFixed(2)}
              </Typography>
              <Button
                variant="outlined"
                color="warning"
                className="mt-4 w-full"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                View Details
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecentlyViewed;

