import React from "react";
import { Drawer, FormControl, InputLabel, Select, MenuItem, TextField, Button, Fab } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const FilterDrawer = ({
  isOpen,
  toggleDrawer,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
}) => {
  const categories = ["Men", "Women", "Kids", "Accessories", "Footwear"];

  return (
    <>
      {/* Floating Filter Button */}
      <Fab 
        color="primary" 
        aria-label="filter" 
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          bottom: 20, 
          right: 20, 
          zIndex: 1000, // Ensure it stays above other elements
          backgroundColor: "#ff9800",
          "&:hover": { backgroundColor: "#f57c00" }
        }}
      >
        <FilterListIcon />
      </Fab>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: 300,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }
        }}
      >
        <h2 className="text-xl font-semibold">Filters</h2>

        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title"
        />

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            displayEmpty
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          onClick={toggleDrawer}
          sx={{
            mt: "auto",
            py: 1.5,
            fontWeight: 600,
            backgroundColor: "#ff9800",
            "&:hover": { backgroundColor: "#f57c00" }
          }}
        >
          Apply Filters
        </Button>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
