// import React, { useState } from "react";
// import { TextField, Button, Grid, Box, Typography } from "@mui/material";

// // const approvedByOptions = ["Board", "Finance Committee"];

// const BankAccount = ({ isDropped }) => {
//   const [formData, setFormData] = useState({
//     sanctionId: "",
//     currentAccountNo: "",
//     bankName: "",
//     bankBranch: "",
//     location: "",
//     ifscCode: "",
//     approvedBy: "",
//     dateOfApproval: "",
//     documentExecutedDate: "",
//     dueDateChargeCreation: "",
//     dateOfFormFiledCreation: "",
//     dueDateSatisfaction: "",
//     dateOfFilingSatisfaction: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // const handleSelectChange = (name) => (event) => {
//   //   setFormData({ ...formData, [name]: event.target.value });
//   // };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted", formData);
//   };

//   return (
//     <Box sx={{
//       display: "flex",
//       justifyContent: "center",
//       flexDirection: "column",
//       gap: 2,
//       margin: "auto",
//       marginTop: "70px",
//       marginLeft: isDropped ? "100px" : "280px",
//       transition: "margin-left 0.3s ease",
//       width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//       // marginLeft: `calc(${isDropped}px + 20px)`,
//       padding: 3,
//       border: "1px solid #ccc",
//       borderRadius: 2,
//       boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
//     }}>
//       <Typography sx={{ color: "#0056b3", fontWeight: "600", fontSize: "20px", marginBottom: "20px", textAlign: "center", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #0056b3", paddingBottom: "10px" }}>
//         Bank Account Details for Repayment
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={6}><TextField label="Sanction ID" name="sanctionId" value={formData.sanctionId} onChange={handleChange} fullWidth required /></Grid>
//         <Grid item xs={6}><TextField label="Current A/C No" name="currentAccountNo" value={formData.currentAccountNo} onChange={handleChange} fullWidth required /></Grid>
//         <Grid item xs={6}><TextField label="Name of the Bank" name="bankName" value={formData.bankName} onChange={handleChange} fullWidth required /></Grid>
//         <Grid item xs={6}><TextField label="Bank Branch" name="bankBranch" value={formData.bankBranch} onChange={handleChange} fullWidth required /></Grid>
//         <Grid item xs={6}><TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth required /></Grid>
//         <Grid item xs={6}><TextField label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} fullWidth required /></Grid>
//       </Grid>
//       <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
//         <Button variant="contained" color="secondary">Cancel</Button>
//         <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
//       </Box>
//     </Box>
//   );
// };

// export default BankAccount;
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const BankAccount = ({ isDropped }) => {
  const fieldConfig = [
    { name: "sanctionId", label: "Sanction ID", required: true, type: "dropdown", options: [] },
    { name: "currentAccountNo", label: "Current A/C No", required: true, type: "text" },
    { name: "conf_acc_no", label: "Confirm A/C No", required: true, type: "text" },
    { name: "bankName", label: "Name of the Bank", required: true, type: "text" },
    { name: "bankBranch", label: "Bank Branch", required: true, type: "text" },
    { name: "location", label: "Location", required: true, type: "text" },
    { name: "ifscCode", label: "IFSC Code", required: true, type: "text" },
  ];

  const [formData, setFormData] = useState(
    fieldConfig.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {
      createdby: localStorage.getItem("token") || "",
      updatedby: localStorage.getItem("token") || "",
    })
  );
  const [sanctionIds, setSanctionIds] = useState([]);
  const [message, setMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSanctionIds = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/roc/sanctionid`
        );
        if (response.data?.data) {
          setSanctionIds(response.data.data.map((item) => item.sanction_id));
        } else {
          setSanctionIds([]); // Clear sanction ids if no data returned
        }
      } catch (error) {
        console.error("Error fetching sanction IDs:", error);
      }
    };
    fetchSanctionIds();
  }, [API_URL]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.currentAccountNo !== formData.conf_acc_no) {
      alert("Account numbers must be the same");
      return;
    }

    for (let field of fieldConfig) {
      if (field.required && !formData[field.name]?.trim()) {
        setMessage(`Error: ${field.label} is required ⚠️`);
        return;
      }
    }

    // console.log("Form Data:", formData);

    try {
      const response = await axios.post(`${API_URL}/bankrepayment/create`, formData);
      if (response.status === 200 || response.status === 201) {
        setMessage("Bank Repayment Sent to Approval✅");
      } else {
        setMessage("Bank Repayment Sent to Approval failed ⚠️");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Error connecting to the server ⚠️");
    }
    navigate(-1);
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
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
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
        Bank Account Details for Repayment
      </Typography>
      {message && (
        <Typography color="error" sx={{ textAlign: "center", fontWeight: "bold" }}>
          {message}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {fieldConfig.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {field.type === "dropdown" ? (
                <FormControl fullWidth required={field.required}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  >
                    {sanctionIds.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  fullWidth
                  required={field.required}
                />
              )}
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
          <Button variant="contained" color="warning" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            type="button"
            onClick={() => setFormData(fieldConfig.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}))}
          >
            Reset
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default BankAccount;
