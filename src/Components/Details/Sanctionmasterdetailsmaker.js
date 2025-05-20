import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from "axios";

const fieldConfig = [
    { name: "lender_code", label: "Lender Code", readOnly: true },
    { name: "sanction_id", label: "Sanction Id", readOnly: true },
    { name: "loan_type", label: "Loan Type", required: true },
    { name: "sanction_amount", label: "Sanction Amount", readOnly: true, required: true, type: "number" },
    { name: "sanction_date", label: "Sanction Date", required: true, type: "date" },
    { name: "sanction_validity", label: "Sanction Validity", required: true, type: "date" },
    { name: "interest_type", label: "Interest Type", required: true },
    { name: "interest_rate_fixed", label: "Interest Rate (Fixed)", type: "number" },
    { name: "benchmark_rate", label: "Benchmark Rate (Floating)", required: false, type: "dropdown" },
    { name: "spread_floating", label: "Spread (Floating)", required: false, type: "number" },
    { name: "interest_payment_term", label: "Interest Payment Term", required: true },
    { name: "principal_repayment_term", label: "Principal Repayment Term", required: true },
    { name: "processing_fee", label: "Processing Fee", required: true, type: "number" },
    { name: "prepayment_charges", label: "Prepayment Charges", required: true, type: "number" },
    { name: "penal_charges", label: "Penal Charges", required: true, type: "number" },
    { name: "book_debt_margin", label: "Book Debt Margin", required: true, type: "number" },
    { name: "cash_margin", label: "Cash Margin", required: true, type: "number" },
    { name: "other_expenses", label: "Other Expenses", required: true, type: "number" },
    { name: "corporate_guarantee", label: "Corporate Guarantee", required: true, type: "number" },
    { name: "purpose_of_loan", label: "Purpose of Loan", required: true, type: "text", minLength: 6, maxLength: 100 },
    { name: "syndication_fee", label: "Syndication Fee", required: true, type: "number" },
    { name: "syndicated_by", label: "Syndicated By", required: false, type: "text", maxLength: 100 },
    { name: "tenure_months", label: "Tenure (Months)", required: true, type: "number" },
    // { name: "remarks", label: "Remarks" }
];

const loanTypes = ["Term Loan", "Demand Loan"];
const interestTypes = ["Fixed", "Floating"];
const repaymentTerms = ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "Bullet"];
const benchmarkRates = ["LIBOR", "MIBOR", "Other"];

const SanctionDetailsmaker = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();
    const location = useLocation();
    const { sanction_id, lender_code, approval_status, updatedat } = location.state;
    const [sanction, setSanction] = useState(null);
    const [errors, setErrors] = useState({});
    const [lenderCodes, setLenderCodes] = useState([]);
    const [originalLender, setOriginalLender] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchLenderCodes = async () => {
            try {
                const response = await axios.get(`${API_URL}/sanction/lendercodes`);
                setLenderCodes(response.data.data.map((item) => item.lender_code));
            } catch (error) {
                console.error("Error fetching lender codes:", error);
            }
        };
        fetchLenderCodes();
    }, [API_URL]);

    useEffect(() => {
        const fetchLenderDetails = async () => {
            try {
                // console.log("maker view: ", sanction_id, lender_code, approval_status, updatedat)
                const response = await axios.get(`${API_URL}/sanction/details`, {
                    params: { sanction_id, lender_code, approval_status, updatedat },
                });
                // console.log("sanction: ", response)
                if (response.status === 200) {
                    setSanction(response.data.sanction);
                    setOriginalLender(response.data.sanction);
                }
            } catch (error) {
                console.error("Error fetching lender details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLenderDetails();
    }, [API_URL, sanction_id, approval_status, lender_code, updatedat]);

    const hasChanges = (current, original) => {
        if (!current || !original) return false;
        return JSON.stringify(current) !== JSON.stringify(original);
    };

    const handleEdit = () => setIsEditing(true);
    const validateForm = () => {
        const newErrors = {};

        const validateField = (field) => {
            const value = sanction[field.name];

            if (field.required && (!value || value.toString().trim() === "")) {
                newErrors[field.name] = `${field.label} is required`;
                return;
            }

            if (value && field.type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
                newErrors[field.name] = `${field.label} is not a valid email`;
            }

            if (value && field.type === "number" && !/^\d+(\.\d+)?$/.test(value)) {
                newErrors[field.name] = `${field.label} must be 0 or positive number`;
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
        fieldConfig.forEach(validateField);
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
            try {
                const { sanction_date, sanction_validity } = sanction;
                if (sanction_validity <= sanction_date) {
                    alert("Sanction Validity must be after Sanction Date.");
                    return;
                }

                if (sanction.interest_type !== "Fixed") {
                    sanctionData.benchmark_rate = sanction.benchmark_rate;
                    sanctionData.spread_floating = Number(sanction.spread_floating);
                } 
                // else {
                //     sanctionData.benchmark_rate = "";
                //     sanctionData.spread_floating = "";
                // }

                const createdby = localStorage.getItem("token");  // Fallback to a default value
                const updatedby = localStorage.getItem("token");  // Fallback to a default value

                const sanctionData = {
                    ...sanction,
                    createdby,
                    updatedby,
                };

                console.log("Check payload: ", sanctionData);
                const response = await fetch(`${API_URL}/sanction/update/${sanction.sanction_id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(sanctionData),
                });
                if (response.ok) {
                    if (response.status === 201) {
                        alert("Sanction updated Sent to Approval!");
                    } else {
                        alert("Sanction updated Sent to Approval Failed!");
                    }
                } else {
                    const errorResponse = await response.json();
                    alert(errorResponse.message);
                }
                navigate("/DataCreation/SanctionDetails");
                setIsEditing(false);
            } catch (error) {
                console.error("Error updating Sanction details:", error);
                alert("Failed to update Sanction details");
            }
        }
    };

    const handleBack = () => navigate("/DataCreation/SanctionDetails");

    const handleChange = (e) => setSanction({ ...sanction, [e.target.name]: e.target.value });

    return (
        <Box sx={{
            display: "flex", flexDirection: "column", gap: 2, margin: "auto", marginTop: "70px", marginLeft: isDropped ? "100px" : "280px", transition: "margin-left 0.3s ease-in-out", width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)", padding: 3, border: "3px solid #ccc", borderRadius: 2,
            //  boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)" 
        }}>
            <Typography sx={{ color: "#0056b3", fontWeight: "600", fontSize: "20px", marginBottom: "20px", textAlign: "center", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #0056b3", paddingBottom: "10px" }}>Sanction Details</Typography>
            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : sanction ? (
                <Paper elevation={0} sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        {fieldConfig.map((field) => (
                            <Grid key={field.name} item xs={12} sm={6}>
                                {field.name === "lender_code" ||
                                    field.name === "loan_type" ||
                                    field.name === "interest_type" ||
                                    field.name === "interest_payment_term" ||
                                    field.name === "principal_repayment_term" ? (
                                    <FormControl fullWidth required={field.required} error={!!errors[field.name]} variant="outlined"
                                        sx={{
                                            cursor: "default",
                                            backgroundColor: sanction.updated_fields?.includes(field.name) ? "#fcec03" : "#ebeced",
                                            "& .MuiInputBase-root": {
                                                // pointerEvents: "none"
                                            }
                                        }}
                                        disabled={
                                            (sanction.interest_type === "Fixed" &&
                                                (field.name === "benchmark_rate" || field.name === "spread_floating"))
                                        }
                                    >
                                        <InputLabel>{field.label}</InputLabel>
                                        <Select label={field.label} name={field.name} value={sanction?.[field.name] || ""} onChange={handleChange} disabled={!isEditing || field.name === "lender_code"}>
                                            {(field.name === "lender_code" ? lenderCodes : field.name === "loan_type" ? loanTypes : field.name === "interest_type" ? interestTypes : field.name === "interest_payment_term" || field.name === "principal_repayment_term" ? repaymentTerms : benchmarkRates).map((option) => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField
                                        required={field.required}
                                        label={field.label}
                                        name={field.name}
                                        error={Boolean(errors[field.name])}
                                        helperText={errors[field.name] || ""}
                                        disabled={
                                            sanction.interest_type === "Fixed" &&
                                            (field.name === "benchmark_rate" || field.name === "spread_floating")
                                        }
                                        value={
                                            ["sanction_date", "sanction_validity"].includes(field.name)
                                                ? (sanction[field.name] ? sanction[field.name].slice(0, 10) : "")
                                                : sanction[field.name] || ""
                                        }
                                        type={
                                            isEditing && field.type
                                                ? field.type === "number"
                                                    ? "number"
                                                    : field.type === "date"
                                                        ? "date"
                                                        : "text"
                                                : "text"
                                        }

                                        fullWidth
                                        onChange={handleChange}
                                        inputProps={{
                                            minLength: field.minLength,
                                            maxLength: field.maxLength,
                                            length: field.length
                                        }}
                                        InputProps={{
                                            readOnly: !isEditing || field.name === "sanction_id" || field.name === "sanction_amount" || field.name === "lender_code",
                                            style:
                                                field.name === "sanction_id" || field.name === "sanction_amount" || field.name === "lender_code"
                                                    ? { pointerEvents: "none", cursor: "not-allowed", backgroundColor: "#ebeced" }
                                                    : {},
                                        }}
                                        sx={{
                                            cursor: "default",
                                            backgroundColor: sanction.updated_fields?.includes(field.name) ? "#fcec03" : "#ebeced",
                                        }}
                                    />

                                )}
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3, gap: 2 }}>
                        <Button variant="contained" color="warning" onClick={handleBack}>
                            Back
                        </Button>
                        {isEditing ?
                            <Button variant="contained" color="primary" onClick={handleUpdate} disabled={!hasChanges(sanction, originalLender)}
                            >update</Button>
                            :
                            <Button variant="contained" color="error" onClick={handleEdit}>Edit</Button>
                        }
                    </Box>
                    {isEditing && !hasChanges(sanction, originalLender) && (
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
                            Make changes to enable the Update button.
                        </Typography>
                    )}
                </Paper>
            ) : (
                <Typography sx={{ textAlign: "center", marginTop: 2 }}>Sanction details not found</Typography>
            )}
        </Box>
    );
};

export default SanctionDetailsmaker;
