import React, { useState } from "react";
import { TextField, Button, Select, MenuItem, CircularProgress } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";

function CommonForm({ formControls, onSubmit, submitButtonText = "Submit" }) {
  const [formValues, setFormValues] = useState(
    Object.fromEntries(formControls.map((control) => [control.name, ""]))
  );

  const handleChange = (name) => (event) => {
    const value =
      event.target.type === "file" ? event.target.files : event.target.value;
    setFormValues({ ...formValues, [name]: value });
  };

  const renderInputsByComponentType = (control) => {
    const Component = control.componentType;
    switch (control.componentType) {
      case TextField:
        return (
          <Component
            key={control.name}
            label={control.label}
            placeholder={control.placeholder}
            type={control.type}
            variant="outlined"
            fullWidth
            value={formValues[control.name]}
            onChange={handleChange(control.name)}
            style={{ marginBottom: "16px" }}
          />
        );
      case "textarea":
        return (
          <TextareaAutosize
            key={control.name}
            minRows={3}
            placeholder={control.placeholder}
            value={formValues[control.name]}
            onChange={handleChange(control.name)}
            style={{
              width: "100%",
              marginBottom: "16px",
              padding: "8px",
              borderColor: "#ccc",
              borderRadius: "4px",
            }}
          />
        );
      case "select":
        return (
          <Select
            key={control.name}
            value={formValues[control.name]}
            onChange={handleChange(control.name)}
            displayEmpty
            fullWidth
            variant="outlined"
            style={{ marginBottom: "16px" }}
          >
            <MenuItem value="" disabled>
              {control.placeholder}
            </MenuItem>
            {control.options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      case "file":
        return (
          <input
            key={control.name}
            type="file"
            multiple={control.multiple}
            onChange={handleChange(control.name)}
            style={{ marginBottom: "16px", display: "block" }}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(formValues);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render form controls */}
      {formControls.map((control) => renderInputsByComponentType(control))}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          variant="contained"
          style={{
            backgroundColor: "#FF6F00", // Orange
            color: "#FFFFFF", // White text
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
          type="submit"
        >
          {submitButtonText}
        </Button>
      </div>

      {/* Spinner Example (if required elsewhere) */}
      {/* Replace with a condition or a loading state as needed */}
      <div className="flex justify-center mt-4">
        <CircularProgress style={{ color: "#FF6F00" }} />
      </div>
    </form>
  );
}

export default CommonForm;

