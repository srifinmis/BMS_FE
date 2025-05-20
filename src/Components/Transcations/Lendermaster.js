import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, Grid, FormControlLabel, Checkbox, FormGroup
} from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form = ({ isDropped }) => {

  const API_URL = process.env.REACT_APP_API_URL;
  const [lenderCodes, setLenderCodes] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    lender_code: '',
    lender_name: '',
    lender_type: '',
    lender_escalation_name: '',
    lender_escalation_contact: '',
    lender_escalation_email: '',
    status: '',
    addr1_line1: '',
    addr1_line2: '',
    addr1_line3: '',
    addr1_contact1: '',
    addr1_contact2: '',
    addr1_contact3: '',
    addr1_email1: '',
    addr1_email2: '',
    addr1_email3: '',
    addr1_spoc_name: '',
    addr1_spoc_contact: '',
    addr1_spoc_email: '',
    // 2
    addr2_line1: '',
    addr2_line2: '',
    addr2_line3: '',
    addr2_contact1: '',
    addr2_contact2: '',
    addr2_contact3: '',
    addr2_email1: '',
    addr2_email2: '',
    addr2_email3: '',
    addr2_spoc_name: '',
    addr2_spoc_contact: '',
    addr2_spoc_email: '',
    // 3
    addr3_line1: '',
    addr3_line2: '',
    addr3_line3: '',
    addr3_contact1: '',
    addr3_contact2: '',
    addr3_contact3: '',
    addr3_email1: '',
    addr3_email2: '',
    addr3_email3: '',
    addr3_spoc_name: '',
    addr3_spoc_contact: '',
    addr3_spoc_email: '',
    isHeadOfficeChecked: false,
    isRegionalOfficeChecked: false,
    isEscalationOfficeChecked: false,
    createdby: localStorage.getItem("token") || "",
    updatedby: localStorage.getItem("token") || "",
  });

  // Fetch existing sanction IDs
  useEffect(() => {
    const fetchLendercodes = async () => {
      try {

        // main table lender codes
        const response = await axios.get(`${API_URL}/lender/lenderCodecheck`);
        console.log("lender api getting: ", response)
        if (response.data?.data && Array.isArray(response.data.data)) {
          setLenderCodes(response.data.data.map(item => ({
            lender_code: item.lender_code
          })));
        } else {
          console.error("Invalid Lender Code format");
        }
      } catch (error) {
        console.error("Error fetching Lender Code:", error);
      }
    };
    fetchLendercodes();
  }, [API_URL]);


  const [errors, setErrors] = useState({});
  const lenderTypes = ["Public Sector Bank", "Private Sector Bank", "Cooperative Bank", "NBFC"];
  const statusOptions = ['Active', 'Inactive'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));

    setErrors(prev => {
      const updatedErrors = { ...prev };

      if (name === "addr1_line2" || name === "addr1_line3") {
        updatedErrors[name] = value.length < 10 ? "Minimum 10 characters required" : "";
      }

      if (name === "lender_code") {
        const exists = lenderCodes.some(item => item.lender_code === value.trim());
        updatedErrors[name] = exists ? "Lender Code combination already exists" : "";
      }

      return updatedErrors;
    });
  };



  const validateForm = () => {
    const newErrors = {};

    const alwaysRequiredFields = [
      { key: 'lender_code', label: 'Lender Code', minLength: 6, maxLength: 10 },
      { key: 'lender_name', label: 'Lender Name', minLength: 6, maxLength: 100 },
      { key: 'lender_type', label: 'Lender Type' },
      { key: 'status', label: 'Status' },
      { key: 'lender_escalation_name', label: 'Escalation Name', minLength: 6, maxLength: 255 },
      { key: 'lender_escalation_contact', label: 'Escalation Contact', type: "number" },
      { key: 'lender_escalation_email', label: 'Escalation Email', type: "email" },
    ];

    alwaysRequiredFields.forEach(({ key, label, minLength, maxLength, type }) => {
      const value = formData[key];

      if (!value) {
        newErrors[key] = `${label} is required`;
        return;
      }

      if (minLength && value.length < minLength) {
        newErrors[key] = `${label} must be at least ${minLength} characters`;
      }

      if (maxLength && value.length > maxLength) {
        newErrors[key] = `${label} should not exceed ${maxLength} characters`;
      }

      if (type === 'number' && !/^\d{10}$/.test(value)) {
        newErrors[key] = `${label} must be a valid 10-digit number`;
      }
      if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[key] = `${label} must be a valid email`;
      }
    });

    const headOffice = formData.isHeadOfficeChecked;
    const regionalOffice = formData.isRegionalOfficeChecked;
    const escalationOffice = formData.isEscalationOfficeChecked;

    if (!headOffice && !regionalOffice && !escalationOffice) {
      newErrors.officeSection = 'At least one office must be selected & Filled';
    }

    if (formData.addr1_line2 && formData.addr1_line2.length < 10) {
      newErrors.addr1_line2 = 'Address Line 2 must be at least 10 characters';
    }
    if (formData.addr1_line3 && formData.addr1_line3.length < 10) {
      newErrors.addr1_line3 = 'Address Line 3 must be at least 10 characters';
    }

    if (formData.addr1_contact2 && !/^\d{10}$/.test(formData.addr1_contact2)) {
      newErrors.addr1_contact2 = 'Contact 2 must be a valid 10-digit number';
    }

    if (formData.addr1_contact3 && !/^\d{10}$/.test(formData.addr1_contact3)) {
      newErrors.addr1_contact3 = 'Contact 3 must be a valid 10-digit number';
    }

    if (formData.addr1_email2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.addr1_email2)) {
      newErrors.addr1_email2 = 'Lender Email 2 must be a valid email';
    }

    if (formData.addr1_email3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.addr1_email3)) {
      newErrors.addr1_email3 = 'Lender Email 3 must be a valid email';
    }

    if (headOffice) {
      const fields = [
        { key: 'addr1_line1', label: 'Address Line 1', minLength: 10, maxLength: 255 },
        { key: 'addr1_contact1', label: 'Contact 1', type: 'number', length: 10 },
        { key: 'addr1_email1', label: 'Lender Email 1', type: 'email' },
        { key: 'addr1_spoc_name', label: 'SPOC Name', minLength: 6, maxLength: 100 },
        { key: 'addr1_spoc_contact', label: 'SPOC Contact', type: 'number', length: 10 },
        { key: 'addr1_spoc_email', label: 'SPOC Email', type: 'email' },
      ];

      fields.forEach(({ key, label, minLength, type, length }) => {
        const value = formData[key];

        if (!value) {
          newErrors[key] = `${label} is required`;
        } else {
          if (minLength && value.length < minLength) {
            newErrors[key] = `${label} must be at least ${minLength} characters`;
          }

          if (type === 'number' && !/^\d+$/.test(value)) {
            newErrors[key] = `${label} must be numeric`;
          }

          if (type === 'number' && length && !/^\d{10}$/.test(value)) {
            newErrors[key] = `${label} must be a valid 10-digit number`;
          }

          if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[key] = `${label} must be a valid email`;
          }

        }
      });
    }

    if (formData.addr2_line2 && formData.addr2_line2.length < 10) {
      newErrors.addr2_line2 = 'Address Line 2 must be at least 10 characters';
    }
    if (formData.addr2_line3 && formData.addr2_line3.length < 10) {
      newErrors.addr2_line3 = 'Address Line 3 must be at least 10 characters';
    }

    if (formData.addr2_contact2 && !/^\d{10}$/.test(formData.addr2_contact2)) {
      newErrors.addr2_contact2 = 'Contact 2 must be a valid 10-digit number';
    }

    if (formData.addr2_contact3 && !/^\d{10}$/.test(formData.addr2_contact3)) {
      newErrors.addr2_contact3 = 'Contact 3 must be a valid 10-digit number';
    }

    if (formData.addr2_email2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.addr2_email2)) {
      newErrors.addr2_email2 = 'Lender Email 2 must be a valid email';
    }

    if (formData.addr2_email3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.addr2_email3)) {
      newErrors.addr2_email3 = 'Lender Email 3 must be a valid email';
    }

    if (regionalOffice) {
      const fields = [
        { key: 'addr2_line1', label: 'Address Line 1', minLength: 10 },
        { key: 'addr2_contact1', label: 'Contact 1', type: 'number', length: 10 },
        { key: 'addr2_email1', label: 'Lender Email 1', type: 'email' },
        { key: 'addr2_spoc_name', label: 'SPOC Name', minLength: 6, maxLength: 100 },
        { key: 'addr2_spoc_contact', label: 'SPOC Contact', type: 'number', length: 10 },
        { key: 'addr2_spoc_email', label: 'SPOC Email', type: 'email' },
      ];

      fields.forEach(({ key, label, minLength, type, length }) => {
        const value = formData[key];

        if (!value) {
          newErrors[key] = `${label} is required`;
        } else {
          if (minLength && value.length < minLength) {
            newErrors[key] = `${label} must be at least ${minLength} characters`;
          }

          if (type === 'number' && !/^\d+$/.test(value)) {
            newErrors[key] = `${label} must be numeric`;
          }

          if (type === 'number' && length && value.length !== length) {
            newErrors[key] = `${label} must be exactly ${length} digits`;
          }

          if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[key] = `${label} must be a valid email`;
          }
        }
      });
    }

    if (formData.addr3_line2 && formData.addr3_line2.length < 10) {
      newErrors.addr3_line2 = 'Address Line 2 must be at least 10 characters';
    }
    if (formData.addr3_line3 && formData.addr3_line3.length < 10) {
      newErrors.addr3_line3 = 'Address Line 3 must be at least 10 characters';
    }
    
    if (formData.addr3_contact2 && !/^\d{10}$/.test(formData.addr3_contact2)) {
      newErrors.addr3_contact2 = 'Contact 2 must be a valid 10-digit number';
    }

    if (formData.addr3_contact3 && !/^\d{10}$/.test(formData.addr3_contact3)) {
      newErrors.addr3_contact3 = 'Contact 3 must be a valid 10-digit number';
    }

    if (formData.addr3_email2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.addr3_email2)) {
      newErrors.addr3_email2 = 'Lender Email 2 must be a valid email';
    }

    if (formData.addr3_email3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.addr3_email3)) {
      newErrors.addr3_email3 = 'Lender Email 3 must be a valid email';
    }

    if (escalationOffice) {
      const fields = [
        { key: 'addr3_line1', label: 'Address Line 1', minLength: 10 },
        { key: 'addr3_contact1', label: 'Contact 1', type: 'number', length: 10 },
        { key: 'addr3_email1', label: 'Lender Email 1', type: 'email' },
        { key: 'addr3_spoc_name', label: 'SPOC Name', minLength: 6, maxLength: 100 },
        { key: 'addr3_spoc_contact', label: 'SPOC Contact', type: 'number', length: 10 },
        { key: 'addr3_spoc_email', label: 'SPOC Email', type: 'email' },
      ];

      fields.forEach(({ key, label, minLength, type, length }) => {
        const value = formData[key];

        if (!value) {
          newErrors[key] = `${label} is required`;
        } else {
          if (minLength && value.length < minLength) {
            newErrors[key] = `${label} must be at least ${minLength} characters`;
          }

          if (type === 'number' && !/^\d+$/.test(value)) {
            newErrors[key] = `${label} must be numeric`;
          }

          if (type === 'number' && length && value.length !== length) {
            newErrors[key] = `${label} must be exactly ${length} digits`;
          }

          if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[key] = `${label} must be a valid email`;
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const resetForm = () => {
    setFormData({
      lender_code: '',
      lender_name: '',
      lender_type: '',
      lender_escalation_name: '',
      lender_escalation_contact: '',
      lender_escalation_email: '',
      status: '',
      addr1_line1: '',
      addr1_line2: '',
      addr1_line3: '',
      addr1_contact1: '',
      addr1_contact2: '',
      addr1_contact3: '',
      addr1_email1: '',
      addr1_email2: '',
      addr1_email3: '',
      addr1_spoc_name: '',
      addr1_spoc_contact: '',
      addr1_spoc_email: '',
      addr2_line1: '',
      addr2_line2: '',
      addr2_line3: '',
      addr2_contact1: '',
      addr2_contact2: '',
      addr2_contact3: '',
      addr2_email1: '',
      addr2_email2: '',
      addr2_email3: '',
      addr2_spoc_name: '',
      addr2_spoc_contact: '',
      addr2_spoc_email: '',
      addr3_line1: '',
      addr3_line2: '',
      addr3_line3: '',
      addr3_contact1: '',
      addr3_contact2: '',
      addr3_contact3: '',
      addr3_email1: '',
      addr3_email2: '',
      addr3_email3: '',
      addr3_spoc_name: '',
      addr3_spoc_contact: '',
      addr3_spoc_email: '',
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.addr1_line2.length < 10) {

    }
    if (validateForm()) {
      console.log('Form submitted', formData);

      try {
        console.log("form data lender: ", formData)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/Lender/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server responded with error:", errorData);
          throw new Error(`Server Error: ${response.status}`);
        }

        // setMessage("Lender Sent to Approval ✅");
        localStorage.setItem("submissionMessage", "Lender Sent to Approval!");
        localStorage.setItem("messageType", "success");

        navigate("/DataCreation/LenderMaster");
      } catch (error) {
        // setMessage("Error connecting to the server ⚠️");
        console.log("Error: connecting to the server ⚠️");
      }

    }
  };

  const renderTextField = (name, label) => (
    <Grid item xs={12} sm={6}>
      <TextField
        label={label}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        error={Boolean(errors[name])}
        helperText={errors[name]}
        fullWidth
      />
    </Grid>
  );

  return (
    <Box sx={{
      margin: "auto", marginTop: "70px", marginLeft: isDropped ? "100px" : "280px",
      transition: "margin-left 0.3s ease",
      width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
      padding: 3,
      border: "3px solid #ccc",
      borderRadius: 2,
      // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
    }}>
      <Typography sx={{
        color: "#0056b3", fontWeight: "600", fontSize: "20px", marginBottom: "20px",
        textAlign: "center", textTransform: "uppercase", letterSpacing: "1px",
        borderBottom: "2px solid #0056b3",
         paddingBottom: "10px",
      }}>
        Lender Details
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {renderTextField("lender_code", "Lender Code")}
          {renderTextField("lender_name", "Lender Name")}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(errors.lender_type)}>
              <InputLabel>Lender Type</InputLabel>
              <Select name="lender_type" value={formData.lender_type} onChange={handleChange}>
                {/* <MenuItem value=""><em>None</em></MenuItem> */}
                {lenderTypes.map((type, i) => (
                  <MenuItem key={i} value={type}>{type}</MenuItem>
                ))}
              </Select>
              {errors.lender_type && <Typography color="error">{errors.lender_type}</Typography>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(errors.status)}>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={formData.status} onChange={handleChange}>
                {/* <MenuItem value=""><em>None</em></MenuItem> */}
                {statusOptions.map((stat, i) => (
                  <MenuItem key={i} value={stat}>{stat}</MenuItem>
                ))}
              </Select>
              {errors.status && <Typography color="error">{errors.status}</Typography>}
            </FormControl>
          </Grid>

          {renderTextField("lender_escalation_name", "Escalation Name")}
          {renderTextField("lender_escalation_contact", "Escalation Contact")}
          {renderTextField("lender_escalation_email", "Escalation Email")}
          <FormGroup sx={{ display: 'flex', alignItems: 'center', marginLeft: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isHeadOfficeChecked"
                      checked={formData.isHeadOfficeChecked}
                      onChange={handleChange}
                    />
                  }
                  label="Head Office"
                />
                {formData.isHeadOfficeChecked && (
                  <Grid container spacing={2}>
                    {renderTextField("addr1_line1", "Address Line 1")}
                    {renderTextField("addr1_line2", "Address Line 2", {
                      inputProps: { minLength: 10, maxLength: 255 },
                      error: !!errors.addr1_line2,
                      helperText: errors.addr1_line2
                    })}
                    {renderTextField("addr1_line3", "Address Line 3", {
                      inputProps: { minLength: 10, maxLength: 255 },
                      error: !!errors.addr1_line3,
                      helperText: errors.addr1_line3
                    })}
                    {renderTextField("addr1_contact1", "Contact 1")}
                    {renderTextField("addr1_contact2", "Contact 2", {
                      inputProps: { type: "number", length: 10 },
                      error: !!errors.addr1_contact2,
                      helperText: errors.addr1_contact2
                    })}
                    {renderTextField("addr1_contact3", "Contact 3", {
                      inputProps: { type: "number", length: 10 },
                      error: !!errors.addr1_contact3,
                      helperText: errors.addr1_contact3
                    })}
                    {renderTextField("addr1_email1", "Lender Email 1")}
                    {renderTextField("addr1_email2", "Lender Email 2", {
                      inputProps: { type: "email" },
                      error: !!errors.addr1_email2,
                      helperText: errors.addr1_email2
                    })}
                    {renderTextField("addr1_email3", "Lender Email 3", {
                      inputProps: { type: "email" },
                      error: !!errors.addr1_email3,
                      helperText: errors.addr1_email3
                    })}
                    {renderTextField("addr1_spoc_name", "SPOC Name")}
                    {renderTextField("addr1_spoc_contact", "SPOC Contact")}
                    {renderTextField("addr1_spoc_email", "SPOC Email")}
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isRegionalOfficeChecked"
                      checked={formData.isRegionalOfficeChecked}
                      onChange={handleChange}
                    />
                  }
                  label="Regional Office"
                />
                {formData.isRegionalOfficeChecked && (
                  <Grid container spacing={2}>
                    {renderTextField("addr2_line1", "Address Line 1")}
                    {renderTextField("addr2_line2", "Address Line 2", {
                      inputProps: { minLength: 10, maxLength: 255 },
                      error: !!errors.addr2_line2,
                      helperText: errors.addr2_line2
                    })}
                    {renderTextField("addr2_line3", "Address Line 3", {
                      inputProps: { minLength: 10, maxLength: 255 },
                      error: !!errors.addr2_line3,
                      helperText: errors.addr2_line3
                    })}
                    {renderTextField("addr2_contact1", "Contact 1")}
                    {renderTextField("addr2_contact2", "Contact 2", {
                      inputProps: { type: "number", length: 10 },
                      error: !!errors.addr2_contact2,
                      helperText: errors.addr2_contact2
                    })}
                    {renderTextField("addr2_contact3", "Contact 3", {
                      inputProps: { type: "number", length: 10 },
                      error: !!errors.addr2_contact3,
                      helperText: errors.addr2_contact3
                    })}
                    {renderTextField("addr2_email1", "Lender Email 1")}
                    {renderTextField("addr2_email2", "Lender Email 2", {
                      inputProps: { type: "email" },
                      error: !!errors.addr2_email2,
                      helperText: errors.addr2_email2
                    })}
                    {renderTextField("addr2_email3", "Lender Email 3", {
                      inputProps: { type: "email" },
                      error: !!errors.addr2_email3,
                      helperText: errors.addr2_email3
                    })}
                    {renderTextField("addr2_spoc_name", "SPOC Name")}
                    {renderTextField("addr2_spoc_contact", "SPOC Contact")}
                    {renderTextField("addr2_spoc_email", "SPOC Email")}
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isEscalationOfficeChecked"
                      checked={formData.isEscalationOfficeChecked}
                      onChange={handleChange}
                    />
                  }
                  label="Escalation Office"
                />
                {formData.isEscalationOfficeChecked && (
                  <Grid container spacing={2}>
                    {renderTextField("addr3_line1", "Address Line 1")}
                    {renderTextField("addr3_line2", "Address Line 2", {
                      inputProps: { minLength: 10, maxLength: 255 },
                      error: !!errors.addr3_line2,
                      helperText: errors.addr3_line2
                    })}
                    {renderTextField("addr3_line3", "Address Line 3", {
                      inputProps: { minLength: 10, maxLength: 255 },
                      error: !!errors.addr3_line3,
                      helperText: errors.addr3_line3
                    })}
                    {renderTextField("addr3_contact1", "Contact 1")}
                    {renderTextField("addr3_contact2", "Contact 2", {
                      inputProps: { type: "number", length: 10 },
                      error: !!errors.addr3_contact2,
                      helperText: errors.addr3_contact2
                    })}
                    {renderTextField("addr3_contact3", "Contact 3", {
                      inputProps: { type: "number", length: 10 },
                      error: !!errors.addr3_contact3,
                      helperText: errors.addr3_contact3
                    })}
                    {renderTextField("addr3_email1", "Lender Email 1")}
                    {renderTextField("addr3_email2", "Lender Email 2", {
                      inputProps: { type: "email" },
                      error: !!errors.addr3_email2,
                      helperText: errors.addr3_email2
                    })}
                    {renderTextField("addr3_email3", "Lender Email 3", {
                      inputProps: { type: "email" },
                      error: !!errors.addr3_email3,
                      helperText: errors.addr3_email3
                    })}
                    {renderTextField("addr3_spoc_name", "SPOC Name")}
                    {renderTextField("addr3_spoc_contact", "SPOC Contact")}
                    {renderTextField("addr3_spoc_email", "SPOC Email")}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </FormGroup>

        </Grid>

        {errors.officeSection && (
          <Grid item xs={12}>
            <Typography color="error">{errors.officeSection}</Typography>
          </Grid>
        )}

        <Box mt={3} textAlign="center">
          <Button type="submit" variant="contained" color="primary" sx={{ marginRight: '20px' }}> Submit</Button>
          <Button variant="contained" color="error" onClick={resetForm}> Reset</Button>
        </Box>

      </form>
    </Box >
  );
};

export default Form;