import React from "react";
import {
  Drawer,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

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
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={toggleDrawer}
      PaperProps={{ style: { width: "300px", padding: "16px" } }}
    >
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title"
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
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
      <FormControl fullWidth margin="normal">
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
        color="primary"
        fullWidth
        onClick={toggleDrawer}
      >
        Apply Filters
      </Button>
    </Drawer>
  );
};

export default FilterDrawer;
