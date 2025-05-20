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
import { useNavigate } from "react-router-dom";
import axios from "axios";

const loanTypes = ["Term Loan", "Demand Loan"];
const interestTypes = ["Fixed", "Floating"];
const repaymentTerms = ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "Bullet"];
const benchmarkRates = ["LIBOR", "MIBOR", "Other"];

const fieldConfig = [
  { name: "lender_code", label: "Lender Code/Lender Name", required: true, type: "dropdown", options: [] },
  { name: "sanction_id", label: "Sanction ID", required: true, type: "text", minLength: 6, maxLength: 10 },
  { name: "loan_type", label: "Loan Type", required: true, type: "dropdown", options: loanTypes },
  { name: "purpose_of_loan", label: "Purpose of the Loan", required: true, type: "text", minLength: 6, maxLength: 200 },
  { name: "interest_type", label: "Interest Type", required: true, type: "dropdown", options: interestTypes },
  { name: "interest_rate_fixed", label: "Interest Rate (Fixed)", required: false, type: "number" },
  { name: "benchmark_rate", label: "Benchmark Rate (Floating)", required: false, type: "dropdown", options: benchmarkRates },
  { name: "spread_floating", label: "Spread (Floating)", required: false, type: "number" },
  { name: "tenure_months", label: "Tenure (Months)", required: true, type: "number" },
  { name: "principal_repayment_term", label: "Principal Repayment Term", required: true, type: "dropdown", options: repaymentTerms },
  { name: "interest_payment_term", label: "Interest Payment Term", required: true, type: "dropdown", options: repaymentTerms },
  { name: "sanction_validity", label: "Sanction Validity", required: true, type: "date" },
  { name: "sanction_amount", label: "Sanction Amount", required: true, type: "number" },
  { name: "processing_fee", label: "Processing Fee (%)", required: true, type: "number" },
  { name: "other_expenses", label: "Other Expenses (%)", required: true, type: "number" },
  { name: "book_debt_margin", label: "Book Debt Margin (%)", required: true, type: "number" },
  { name: "cash_margin", label: "Cash Margin (%)", required: true, type: "number" },
  { name: "prepayment_charges", label: "Prepayment Charges (%)", required: true, type: "number" },
  { name: "corporate_guarantee", label: "Corporate Guarantee (%)", required: true, type: "number" },
  { name: "penal_charges", label: "Penal Charges (%)", required: true, type: "number" },
  { name: "syndication_fee", label: "Syndication Fee (%)", required: true, type: "number" },
  { name: "syndicated_by", label: "Syndicated By", required: false, type: "text" },
  { name: "sanction_date", label: "Sanction Date", required: true, type: "date" },
];

const SanctionDetails = ({ isDropped }) => {
  const navigate = useNavigate();
  const [lenderCodes, setLenderCodes] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState(
    fieldConfig.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [sanctionIds, setSanctionIds] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch existing sanction IDs
  useEffect(() => {
    const fetchSanctionIds = async () => {
      try {
        // BELOW CODE MAIN table call api
        // const response = await axios.get(`${API_URL}/roc/sanctionid`);
        const response = await axios.get(`${API_URL}/sanction/sanctionidcheck`);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setSanctionIds(response.data.data.map(item => ({
            sanction_id: item.sanction_id,
            lender_code: item.lender_code
          })));
        } else {
          console.error("Invalid sanction ID format");
        }
      } catch (error) {
        console.error("Error fetching sanction IDs:", error);
      }
    };
    fetchSanctionIds();
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    if (name === "sanction_id" || name === "lender_code") {
      const exists = sanctionIds.some(
        item => item.sanction_id === newFormData.sanction_id && item.lender_code === newFormData.lender_code
      );

      if (exists) {
        setErrors({ ...errors, sanction_id: "Sanction ID and Lender Code combination already exists!" });
      } else {
        setErrors({ ...errors, sanction_id: "" });
      }
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/sanction/lendercodes`);
        // console.log("Response:", response.data);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setLenderCodes(response.data.data.map((item) => ({
            code: item.lender_code,
            name: item.lender_name
          })));
        } else {
          console.error("Invalid lender code format");
        }
      } catch (error) {
        console.error("Error fetching lenders:", error);
      }
    };
    fetchData();
  }, [API_URL]);

  const validateForm = () => {
    const newErrors = {};

    fieldConfig.forEach((field) => {
      const value = formData[field.name];

      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.maxLength && value?.length < field.minLength) {
        newErrors[field.name] = `${field.label} must be at least ${field.minLength} characters`;
      }

      if (field.maxLength && value?.length > field.maxLength) {
        newErrors[field.name] = `${field.label} should not exceed ${field.maxLength} characters`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const sanctionAmount = Number(formData.sanction_amount);
    if (sanctionAmount <= 0) {
      setErrors((prev) => ({
        ...prev,
        sanction_amount: "Sanction Amount must be greater than 0",
      }));
      return;
    } else if (sanctionAmount > 100000000) {
      setErrors((prev) => ({
        ...prev,
        sanction_amount: "Sanction Amount must not exceed 100,000,000",
      }));
      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        sanction_amount: "",
      }));
    }

    const tenureMonths = Number(formData.tenure_months);
    if (tenureMonths <= 0) {
      setErrors((prev) => ({
        ...prev,
        tenure_months: "Tenure (Months) must be a positive number",
      }));
      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        tenure_months: "",
      }));
    } 

    if (formData.interest_type !== "Fixed") {
      finalFormData.benchmark_rate = formData.benchmark_rate;
      finalFormData.spread_floating = Number(formData.spread_floating);
    } else {
      finalFormData.benchmark_rate = null;
      finalFormData.spread_floating = null;
    }

    const processingFee = Number(formData.processing_fee);
    const otherExpenses = Number(formData.other_expenses);
    const bookDebtMargin = Number(formData.book_debt_margin);
    const cashMargin = Number(formData.cash_margin);
    const prepaymentCharges = Number(formData.prepayment_charges);
    const corporateGuarantee = Number(formData.corporate_guarantee);
    const penalCharges = Number(formData.penal_charges);
    const syndicationFee = Number(formData.syndication_fee);

    if (processingFee < 0) {
      setErrors((prev) => ({
        ...prev,
        processing_fee: "Processing Fee (%) must be 0 or positive number",
      }));
      return;
    } 
    else if (otherExpenses < 0) {
      setErrors((prev) => ({
        ...prev,
        other_expenses: "Other Expenses (%) must be 0 or positive number",
      }));
      return;
    }
    else if (bookDebtMargin < 0) {
      setErrors((prev) => ({
        ...prev,
        book_debt_margin: "Book Debt Margin (%) must be 0 or positive number",
      }));
      return;
    }
    else if (cashMargin < 0) {
      setErrors((prev) => ({
        ...prev,
        cash_margin: "Cash Margin (%) must be 0 or positive number",
      }));
      return;
    }
    else if (prepaymentCharges < 0) {
      setErrors((prev) => ({
        ...prev,
        prepayment_charges: "Prepayment Charges (%) must be 0 or positive number",
      }));
      return;
    }
    else if (corporateGuarantee < 0) {
      setErrors((prev) => ({
        ...prev,
        corporate_guarantee: "Corporate Guarantee (%) must be 0 or positive number",
      }));
      return;
    }
    else if (penalCharges < 0) {
      setErrors((prev) => ({
        ...prev,
        penal_charges: "Penal Charges (%) must be 0 or positive number",
      }));
      return;
    }
    else if (syndicationFee < 0) {
      setErrors((prev) => ({
        ...prev,
        syndication_fee: "Syndication Fee (%) must be 0 or positive number",
      }));
      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        processing_fee: "",
        other_expenses: "",
        book_debt_margin: "",
        cash_margin: "",
        prepayment_charges: "",
        corporate_guarantee: "",
        penal_charges: "",
        syndication_fee: "",
      }));
    } 

    const sanctionDate = new Date(formData.sanction_date);
    const sanctionValidity = new Date(formData.sanction_validity);

    if (sanctionValidity <= sanctionDate) {
      setErrors((prev) => ({
        ...prev,
        sanction_validity: "Sanction Validity must be after the Sanction Date",
      }));
      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        sanction_validity: "",
      }));
    }

    // console.log("Submitting 1:", formData);
    const createdby = localStorage.getItem("token");  // Assuming token is the user ID
    const updatedby = localStorage.getItem("token");

    const finalFormData = {
      ...formData,
      createdby,
      updatedby,
    };

    // console.log("Submitting final:", finalFormData);

    try {
      const response = await fetch(`${API_URL}/sanction/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      // const data = await response.json();
      // console.log("Response Data sent: ", data);

      if (!response.ok) {
        const errorData = await response.json();

        localStorage.setItem("submissionMessage", "Sanction Sent to Approval failed!");
        localStorage.setItem("messageType", "error");

        console.error("Server responded with error:", errorData);
        throw new Error(`Server Error: ${response.status}`);
      }

      localStorage.setItem("submissionMessage", "Sanction Sent to Approval!");
      localStorage.setItem("messageType", "success");

      setFormData(
        fieldConfig.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {

        })
      );

      navigate("/DataCreation/SanctionDetails");

    } catch (error) {
      console.log("Error: connecting to the server ⚠️");
    }
  };
  const handleReset = () => {
    setFormData(fieldConfig.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));
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
        Sanction Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {fieldConfig.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {field.type === "dropdown" ? (
                <FormControl fullWidth required={field.required} error={!!errors[field.name]}
                  disabled={
                    (formData.interest_type === "Fixed" &&
                    (field.name === "benchmark_rate" || field.name === "spread_floating"))
                  }
                >
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  >
                    {field.name === "lender_code"
                      ? lenderCodes.map((option) => (
                        <MenuItem key={option.code} value={option.code}>
                          {option.code} - {option.name}
                        </MenuItem>
                      ))
                      : field.options.map((option) => (
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
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  type={field.type}
                  fullWidth
                  required={field.required}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  disabled={
                    formData.interest_type === "Fixed" &&
                    (field.name === "benchmark_rate" || field.name === "spread_floating")
                  }
                  InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                />
              )}
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
          <Button variant="contained" color="warning" onClick={() => navigate(-1)}>Back</Button>
          <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>Save</Button>
          <Button variant="contained" color="error" onClick={handleReset}>Reset</Button>
        </Box>
      </form>
    </Box>
  );
};

export default SanctionDetails;