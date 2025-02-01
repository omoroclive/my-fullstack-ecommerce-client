import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "Men", label: "Men" },
      { id: "Women", label: "Women" },
      { id: "Kids", label: "Kids" },
      { id: "Accessories", label: "Accessories" },
      { id: "Footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "Nike", label: "Nike" },
      { id: "Adidas", label: "Adidas" },
      { id: "Puma", label: "Puma" },
      { id: "Levi", label: "Levi's" },
      { id: "Zara", label: "Zara" },
      { id: "H&M", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
  {
    label: "Product Images",
    name: "images",  
    componentType: "file",  
    placeholder: "Upload product images",
    multiple: true,  // Allow multiple images
  },
];
