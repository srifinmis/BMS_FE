import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Grid, Typography, TextField, CircularProgress, Paper,
  Button, Divider
} from "@mui/material";
import axios from "axios";

const lenderTypes = ["Public Sector Bank", "Private Sector Bank", "Cooperative Bank", "NBFC"];
const statusOptions = ["Active", "Inactive"];

const generalFields = [
  { name: "lender_code", label: "Lender Code", required: true },
  { name: "lender_name", label: "Lender Name", required: true, minLength: 6, maxLength: 100 },
  { name: "status", label: "Status", type: "select", required: true, options: statusOptions },
  { name: "lender_type", label: "Lender Type", required: true, type: "select", options: lenderTypes },
  { name: "lender_escalation_name", required: true, label: "Escalation Name", maxLength: 255 },
  { name: "lender_escalation_contact", required: true, label: "Escalation Contact", type: "number", length: 10 },
  { name: "lender_escalation_email", required: true, label: "Escalation Email", type: "email" }
];

const addressBlocks = [
  {
    title: "Head Office Details",
    fields: [
      { name: "addr1_line1", label: "Address Line 1", required: true, minLength: 10, maxLength: 225 },
      { name: "addr1_line2", label: "Address Line 2", minLength: 10, maxLength: 225 },
      { name: "addr1_line3", label: "Address Line 3", minLength: 10, maxLength: 225 },
      { name: "addr1_contact1", label: "Contact 1", required: true, type: "number", length: 10 },
      { name: "addr1_contact2", label: "Contact 2", type: "number", length: 10 },
      { name: "addr1_contact3", label: "Contact 3", type: "number", length: 10 },
      { name: "addr1_email1", label: "Lender Email 1", required: true, type: "email" },
      { name: "addr1_email2", label: "Lender Email 2", type: "email" },
      { name: "addr1_email3", label: "Lender Email 3", type: "email" },
      { name: "addr1_spoc_name", label: "SPOC Name", required: true, minLength: 6, maxLength: 225 },
      { name: "addr1_spoc_contact", label: "SPOC Contact", required: true, type: "number", length: 10 },
      { name: "addr1_spoc_email", label: "SPOC Email", required: true, type: "email" }
    ]
  },
  {
    title: "Regional Office",
    fields: [
      { name: "addr2_line1", label: "Address Line 1", minLength: 10, maxLength: 225 },
      { name: "addr2_line2", label: "Address Line 2", minLength: 10, maxLength: 225 },
      { name: "addr2_line3", label: "Address Line 3", minLength: 10, maxLength: 225 },
      { name: "addr2_contact1", label: "Contact 1", type: "number", length: 10 },
      { name: "addr2_contact2", label: "Contact 2", type: "number", length: 10 },
      { name: "addr2_contact3", label: "Contact 3", type: "number", length: 10 },
      { name: "addr2_email1", label: "Lender Email 1", type: "email" },
      { name: "addr2_email2", label: "Lender Email 2", type: "email" },
      { name: "addr2_email3", label: "Lender Email 3", type: "email" },
      { name: "addr2_spoc_name", label: "SPOC Name", minLength: 6, maxLength: 225 },
      { name: "addr2_spoc_contact", label: "SPOC Contact", type: "number", length: 10 },
      { name: "addr2_spoc_email", label: "SPOC Email", type: "email" }
    ]
  },
  {
    title: "Branch",
    fields: [
      { name: "addr3_line1", label: "Address Line 1", minLength: 10, maxLength: 225 },
      { name: "addr3_line2", label: "Address Line 2", minLength: 10, maxLength: 225 },
      { name: "addr3_line3", label: "Address Line 3", minLength: 10, maxLength: 225 },
      { name: "addr3_contact1", label: "Contact 1", type: "number", length: 10 },
      { name: "addr3_contact2", label: "Contact 2", type: "number", length: 10 },
      { name: "addr3_contact3", label: "Contact 3", type: "number", length: 10 },
      { name: "addr3_email1", label: "Lender Email 1", type: "email" },
      { name: "addr3_email2", label: "Lender Email 2", type: "email" },
      { name: "addr3_email3", label: "Lender Email 3", type: "email" },
      { name: "addr3_spoc_name", label: "SPOC Name", minLength: 6, maxLength: 225 },
      { name: "addr3_spoc_contact", label: "SPOC Contact", type: "number", length: 10 },
      { name: "addr3_spoc_email", label: "SPOC Email", type: "email" }
    ]
  }
];

const LenderDetailsMaker = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const { lender_code, approval_status, lender_name, updatedat } = location.state || {};
  const navigate = useNavigate();
  const [lender, setLender] = useState(null);
  const [originalLender, setOriginalLender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchLenderDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/lender/details`, {
          params: { lender_code, approval_status, lender_name, updatedat }
        });

        if (response.status === 200) {
          setLender(response.data.lender);
          setOriginalLender(response.data.lender);
        }
      } catch (error) {
        console.error("Error fetching lender details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLenderDetails();
  }, [API_URL, lender_code, approval_status, lender_name, updatedat]);

  const hasChanges = (current, original) => {
    if (!current || !original) return false;
    return JSON.stringify(current) !== JSON.stringify(original);
  };

  const handleEdit = () => setIsEditing(true);

  const validateForm = () => {
    const newErrors = {};

    const validateField = (field) => {
      const value = lender[field.name];

      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }

      if (value && field.type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        newErrors[field.name] = `${field.label} is not a valid email`;
      }

      if (value && field.type === "number" && !/^\d+$/.test(value)) {
        newErrors[field.name] = `${field.label} must be a number`;
      }

      if (value && field.minLength && value.length < field.minLength) {
        newErrors[field.name] = `${field.label} must be at least ${field.minLength} characters`;
      }

      if (value && field.maxLength && value.length > field.maxLength) {
        newErrors[field.name] = `${field.label} must be less than ${field.maxLength} characters`;
      }

      if (value && field.length && value.length !== field.length) {
        newErrors[field.name] = `${field.label} must be exactly ${field.length} digits`;
      }
    };

    generalFields.forEach(validateField);
    addressBlocks.forEach((block) => {
      block.fields.forEach(validateField);
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleUpdate = async () => {

    const formErrors = validateForm();
    setErrors(formErrors);

    if (!validateForm()) {
      alert("Please fix the validation errors before submitting.");
      return;
    }
    if (validateForm()) {
      // console.log('Form submitted', formData);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/lender/update/${lender.lender_code}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...lender, createdby: token, updatedby: token })
        });

        if (response.ok) {
          const msg = response.status === 201
            ? "Lender updated Sent to Approval!"
            : "Lender update failed!";
          alert(msg);
        } else {
          const errorResponse = await response.json();
          alert(errorResponse.message);
        }
        navigate("/DataCreation/LenderMaster");
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating lender details:", error);
        alert("Failed to update lender details");
      }
    }
  };

  const handleBack = () => navigate("/DataCreation/LenderMaster");


  const handleChange = (e) => {
    setLender({ ...lender, [e.target.name]: e.target.value });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        margin: "auto",
        marginTop: "70px",
        marginLeft: isDropped ? "100px" : "280px",
        transition: "margin-left 0.3s ease",
        width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
        padding: 3,
        border: "3px solid #ccc",
        borderRadius: 2,
        // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Typography

        sx={{
          color: "#0056b3",
          fontWeight: "600",
          fontSize: "20px",
          marginBottom: "20px",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "1px",
          borderBottom: "2px solid #0056b3",
          paddingBottom: "10px",
        }}

      >
        Lender Details
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : lender ? (
        <Paper elevation={0} sx={{ padding: 3 }}>
          <Grid container spacing={2}>
            {generalFields.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                {(field.options && field.type === "select") ? (
                  <TextField
                    select
                    type={field.type}
                    label={field.label}
                    name={field.name}
                    value={lender[field.name] || ""}
                    onChange={handleChange}
                    fullWidth
                    required={field.required}
                    error={Boolean(errors[field.name])}
                    // helperText={errors[field.name] || " "}
                    SelectProps={{ native: true }}
                    InputProps={{ readOnly: !isEditing }}
                    inputProps={{
                      minLength: field.minLength,
                      maxLength: field.maxLength,
                      length: field.length
                    }}
                    sx={{ backgroundColor: "#ebeced" }}
                  >
                    <option value="">Select</option>
                    {field.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    type={field.type}
                    label={field.label}
                    name={field.name}
                    value={lender[field.name] || ""}
                    fullWidth
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name] || ""}
                    onChange={handleChange}
                    InputProps={{
                      readOnly: field.name === "lender_code" || !isEditing,
                      style: field.name === "lender_code"
                        ? { pointerEvents: "none", cursor: "not-allowed", backgroundColor: "#ebeced" }
                        : {}
                    }}
                    sx={{ backgroundColor: "#ebeced" }}
                  />
                )}

              </Grid>
            ))}
          </Grid>

          {addressBlocks.map((block, idx) => (
            <Box key={idx} sx={{ mt: 4 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>{block.title}</Typography>
              <Grid container spacing={2}>
                {block.fields.map((field) => (
                  <Grid item xs={12} sm={6} key={field.name}>
                    <TextField
                      type={field.type}
                      label={field.label}
                      name={field.name}
                      value={lender[field.name] || ""}
                      fullWidth
                      error={Boolean(errors[field.name])}
                      helperText={errors[field.name] || ""}
                      onChange={handleChange}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      required={field.required}
                      inputProps={{
                        maxLength: field.maxLength || undefined,
                        minLength: field.minLength || undefined,
                      }}
                      sx={{ backgroundColor: "#ebeced" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <Box mt={3} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" color="warning" onClick={handleBack}>Back</Button>
            {isEditing ? (
              <Button variant="contained" color="primary" onClick={handleUpdate} disabled={!hasChanges(lender, originalLender)}
              >Update</Button>
            ) : (
              <Button variant="contained" color="error" onClick={handleEdit}>Edit</Button>
            )}
          </Box>
          {isEditing && !hasChanges(lender, originalLender) && (
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
              Make changes to enable the Update button.
            </Typography>
          )}
        </Paper>
      ) : (
        <Typography sx={{ textAlign: "center", mt: 2 }}>Lender details not found</Typography>
      )}
    </Box>
  );
};

export default LenderDetailsMaker;
