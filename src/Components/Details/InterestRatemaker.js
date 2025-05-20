import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button, MenuItem } from "@mui/material";
import axios from "axios";

const fieldConfig = [
    { name: "lender_code", label: "Lender Code", type: "select", readOnly: true },
    { name: "sanction_id", label: "Sanction Id", type: "select", readOnly: true },
    { name: "tranche_id", label: "Tranche ID", type: "select", readOnly: true },
    { name: "new_interest_rate", label: "New Interest Rate(%)", type: "number", required: true },
    { name: "effective_date", label: "Effective Date", type: "date", required: true, },
    { name: "updatedby", label: "Updated By", type: "text", required: true, minLength: 6, maxLength: 100 },
    { name: "updatedat", label: "Updated Date", type: "date", required: true }
];

const InterestRatemaker = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const location = useLocation();
    const { sanction_id, lender_code, tranche_id, approval_status, createdat } = location.state;
    const navigate = useNavigate();
    const [sanction, setSanction] = useState(null);
    const [sanctionIds, setSanctionIds] = useState([]);
    const [trancheIds, setTrancheIds] = useState([]);
    const [trancheData, setTrancheData] = useState([]);
    const [date, setDate] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [originalLender, setOriginalLender] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchSanctionIds = async () => {
            try {
                const response = await axios.get(`${API_URL}/roc/sanctionid`);
                if (response.data?.data) {
                    setSanctionIds(response.data.data.map((item) => item.sanction_id));
                }
            } catch (error) {
                console.error("Error fetching sanction IDs:", error);
            }
        };
        fetchSanctionIds();
    }, [API_URL]);

    useEffect(() => {
        const fetchTrancheIds = async () => {
            try {
                const response = await axios.get(`${API_URL}/tranche/findTwo`);
                console.log("tranche data: ", response)
                if (response.data?.data) {
                    setTrancheIds(response.data.data.map((item) => item.tranche_id));
                    setTrancheData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching tranche IDs:", error);
            }
        };
        fetchTrancheIds();
    }, [API_URL]);

    useEffect(() => {
        const fetchLenderDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/interest/details`, {
                    params: { sanction_id, lender_code, tranche_id, approval_status, createdat },
                });
                if (response.status === 200) {
                    setSanction(response.data.interest);
                    setOriginalLender(response.data.interest);
                }
            } catch (error) {
                console.error("Error fetching interest rate details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLenderDetails();
    }, [API_URL, sanction_id, approval_status, createdat, lender_code, tranche_id]);

    const hasChanges = (current, original) => {
        if (!current || !original) return false;
        return JSON.stringify(current) !== JSON.stringify(original);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };
        let newErrors = { ...errors };

        // Update formData immediately
        setFormData(newFormData);

        if (name === "effective_date") {
            const selectedTranche = trancheData.find(t => t.tranche_id === sanction.tranche_id);
            if (selectedTranche) {
                const interestStartDate = new Date(selectedTranche.interest_start_date);
                setDate(interestStartDate);
                const effectiveDate = new Date(value);

                if (effectiveDate <= interestStartDate) {
                    newErrors.effective_date = `Effective Date must be after Interest Start Date (${selectedTranche.interest_start_date})`;
                } else {
                    newErrors.effective_date = "";
                }
            }
        }

        setErrors(newErrors);

        // Update the sanction object so the field value changes in the UI
        setSanction(prev => ({
            ...prev,
            [name]: value,
        }));
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


    const handleUpdate = async (e) => {

        const formErrors = validateForm();
        setErrors(formErrors);

        if (!validateForm()) {
            alert("Please fix the validation errors before submitting.");
            return;
        }

        if (validateForm()) {
            try {

                const updatedFormData = { ...formData };

                const interestStartDate = new Date(date);
                console.log("update interest start date: ", interestStartDate)
                const effectiveDate = new Date(updatedFormData.effective_date);
                // console.log("effective date: ", effectiveDate)
                if (effectiveDate <= interestStartDate) {
                    setErrors.effective_date = `Effective Date should be after Interest Start Date (${date})!`;
                    alert(`Effective Date should be after Interest Start Date (${date})!`);
                    return
                } else {
                    setErrors.effective_date = "";
                }

                const createdby = localStorage.getItem("token");  // Fallback to a default value


                const rocData = {
                    ...sanction,
                    createdby,
                    updatedFormData
                };

                console.log("interest_maker : ", rocData)
                const response = await fetch(`${API_URL}/interest/update/${sanction.sanction_id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(rocData),
                });

                if (response.ok) {
                    if (response.status === 201) {
                        alert("Interest Rate updated and sent for approval!");
                    } else {
                        alert("Interest Rate update failed!");
                    }
                } else {
                    const errorResponse = await response.json();
                    alert(errorResponse.message);
                }
                navigate("/DataCreation/InterestRate");
                setIsEditing(false);
            } catch (error) {
                console.error("Error updating interest rate:", error);
                alert("Failed to update interest rate");
            }
        }

    };


    const handleBack = () => navigate("/DataCreation/InterestRate");

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
                transition: "margin-left 0.3s ease-in-out",
                width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
                padding: 3,
                border: "3px solid #ccc",
                borderRadius: 2,
                // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
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
                Interest Rate
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : sanction ? (
                <Paper elevation={0} sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        {fieldConfig.map((field) => (
                            <Grid key={field.name} item xs={12} sm={6}>
                                {field.type === "select" ? (
                                    <TextField
                                        select
                                        label={field.label}
                                        name={field.name}
                                        type={field.type}
                                        value={sanction[field.name] || ""}
                                        fullWidth
                                        required={field.required}
                                        disabled={field.readOnly}
                                        InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                                        sx={{ backgroundColor: "#ebeced" }}
                                    >
                                        {(field.name === "sanction_id"
                                            ? sanctionIds
                                            : field.name === "tranche_id"
                                                ? trancheIds
                                                : [sanction[field.name]]).map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                    </TextField>
                                ) : (
                                    <TextField
                                        label={field.label}
                                        name={field.name}
                                        type={field.type}
                                        value={sanction[field.name] || ""}
                                        fullWidth
                                        error={!!errors[field.name]}
                                        helperText={errors[field.name]}
                                        required={field.required}
                                        onChange={handleChange}
                                        InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                                        InputProps={{ readOnly: !isEditing || field.readOnly }}
                                        sx={{
                                            cursor: "default",
                                            backgroundColor: sanction.updated_fields?.includes(field.name) ? "#fcec03" : "#ebeced",
                                            "& .MuiInputBase-root": {
                                                // pointerEvents: "none"
                                            }
                                        }}
                                    // sx={{ backgroundColor: !isEditing || field.readOnly ? "#ebeced" : "#fff" }}
                                    />
                                )}
                            </Grid>
                        ))}
                    </Grid>
                    <Box mt={3} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                        <Button variant="contained" color="warning" onClick={handleBack}>
                            Back
                        </Button>
                        {isEditing ? (
                            <Button variant="contained" color="primary" onClick={handleUpdate} disabled={!hasChanges(sanction, originalLender)}>
                                Update
                            </Button>
                        ) : (
                            <Button variant="contained" color="error" onClick={handleEdit}>
                                Edit
                            </Button>
                        )}
                    </Box>
                    {isEditing && !hasChanges(sanction, originalLender) && (
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
                            Make changes to enable the Update button.
                        </Typography>
                    )}
                </Paper>
            ) : (
                <Typography sx={{ textAlign: "center", marginTop: 2 }}>
                    Interest rate details not found
                </Typography>
            )}
        </Box>
    );
};

export default InterestRatemaker;
