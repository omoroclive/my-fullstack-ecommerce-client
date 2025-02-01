// AddressFormControls.js

import { TextField, Switch, FormControlLabel } from "@mui/material";

const AddressFormControls = [
  { 
    name: "fullName", 
    label: "Full Name", 
    placeholder: "Enter your full name", 
    componentType: TextField, 
    type: "text",
    required: true,
  },
  { 
    name: "streetAddress", 
    label: "Street Address", 
    placeholder: "Enter your street address", 
    componentType: TextField, 
    type: "text",
    required: true,
  },
  { 
    name: "city", 
    label: "City", 
    placeholder: "Enter your city", 
    componentType: TextField, 
    type: "text",
    required: true,
  },
  { 
    name: "state", 
    label: "State", 
    placeholder: "Enter your state", 
    componentType: TextField, 
    type: "text",
    required: true,
  },
  { 
    name: "zipCode", 
    label: "Zip Code", 
    placeholder: "Enter your zip code", 
    componentType: TextField, 
    type: "text",
    required: true,
  },
  { 
    name: "country", 
    label: "Country", 
    placeholder: "Enter your country", 
    componentType: TextField, 
    type: "text",
    required: true,
  },
  { 
    name: "phoneNumber", 
    label: "Phone Number", 
    placeholder: "Enter your phone number", 
    componentType: TextField, 
    type: "text",
    required: true,
  },
  
];

export default AddressFormControls;

  