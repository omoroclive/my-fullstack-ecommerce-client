import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { removeFromSavedItems } from "../../store/savedItems/savedItemsSlice";

const SavedItems = () => {
  const savedItems = useSelector((state) => state.savedItems.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromSavedItems(id));
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" gutterBottom>
        Saved Items
      </Typography>

      {savedItems.length > 0 ? (
        <Grid container spacing={4}>
          {savedItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image || "https://via.placeholder.com/150"}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography color="text.secondary">
                    ${item.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/shop/details/${item.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" color="text.secondary">
          No items in your wishlist. Start saving products now!
        </Typography>
      )}
    </Box>
  );
};

export default SavedItems;


