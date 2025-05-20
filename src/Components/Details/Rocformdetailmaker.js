import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button, MenuItem } from "@mui/material";
import axios from "axios";

const RocformDetailsmaker = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const approvedByOptions = ["Board", "Finance Committee"];

    const fieldConfig = [
        { name: "lender_code", label: "Lender Code", type: "select", readOnly: true },
        { name: "sanction_id", label: "Sanction Id", type: "select", readOnly: true },
        { name: "approved_by", label: "Approved By", type: "select", required: true, options: approvedByOptions },
        { name: "date_of_approval", label: "Date of Approval", type: "date", required: true },
        { name: "document_executed_date", label: "Document Executed Date", type: "date", required: true },
        { name: "due_date_charge_creation", label: "Due Date Charge Creation", type: "date", required: true },
        { name: "date_of_form_filed_creation", label: "Date of Form Filed Creation", type: "date" },
        { name: "due_date_satisfaction", label: "Due Date Satisfaction", type: "date" },
        { name: "date_of_filing_satisfaction", label: "Date of Filing Satisfaction", type: "date" },
        // { name: "remarks", label: "Remarks" },
    ];
    const location = useLocation();
    const { lender_code, sanction_id, approval_status, updatedat } = location.state;
    const navigate = useNavigate();
    const [sanction, setSanction] = useState(null);
    const [sanctionIds, setSanctionIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [originalLender, setOriginalLender] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchSanctionIds = async () => {
            try {
                const response = await axios.get(`${API_URL}/roc/sanctionid`);
                // console.log("roc sanctionids: ", response);
                if (response.data?.data) {
                    setSanctionIds(response.data.data.map((item) => item.sanction_id));
                } else {
                    setSanctionIds([]);
                }
            } catch (error) {
                console.error("Error fetching sanction IDs:", error);
            }
        };
        fetchSanctionIds();
    }, [API_URL]);

    useEffect(() => {
        const fetchLenderDetails = async () => {
            try {
                // console.log("params roc : ", sanction_id, lender_code, approval_status, updatedat)
                const response = await axios.get(`${API_URL}/roc/details`, {
                    params: { lender_code, sanction_id, approval_status, updatedat },
                });
                // console.log("Response maker: ", response.data.roc);
                if (response.status === 200) {
                    setSanction(response.data.roc);
                    setOriginalLender(response.data.roc);
                }
            } catch (error) {
                console.error("Error fetching roc details:", error);
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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const validateRequiredFields = () => {
        const missingFields = fieldConfig
            .filter((field) => field.required)
            .filter((field) => !sanction[field.name] || sanction[field.name].toString().trim() === "");

        if (missingFields.length > 0) {
            alert(`Please fill in all required fields:\n${missingFields.map(f => f.label).join(", ")}`);
            return false;
        }
        return true;
    };

    const handleUpdate = async () => {
        if (!validateRequiredFields()) return;

        try {

            const createdby = localStorage.getItem("token");  // Fallback to a default value
            const updatedby = localStorage.getItem("token");  // Fallback to a default value

            const rocData = {
                ...sanction,
                createdby,
                updatedby,
            };

            // console.log("Check lender: ", rocData);

            // console.log("update roc: ", sanction);
            const response = await fetch(`${API_URL}/roc/update/${sanction.sanction_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rocData),
            });
            // console.log("API hit data : ", response);
            if (response.ok) {
                if (response.status === 201) {
                    alert("Roc Form updated Sent to Approval!");
                } else {
                    alert("Roc Form updated Sent to Approval Failed!");
                }
            } else {
                const errorResponse = await response.json();
                alert(errorResponse.message);
            }
            navigate("/DataCreation/ROCForm");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating ROC details:", error);
            alert("Failed to update lender details");
        }
    };

    const handleBack = () => {
        navigate("/DataCreation/ROCForm");
    };

    const handleChange = (e) => {
        setSanction({ ...sanction, [e.target.name]: e.target.value });
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
                ROC Forms
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : sanction ? (
                <Paper elevation={0} sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        {fieldConfig.map((field) => (
                            <Grid key={field.name} item xs={12} sm={6}>
                                {field.name === "sanction_id" ? (
                                    <TextField
                                        select
                                        label={field.label}
                                        name={field.name}
                                        value={sanction[field.name] || ""}
                                        fullWidth
                                        disabled
                                        onChange={handleChange}
                                        sx={{
                                            backgroundColor: isEditing ? "#ebeced" : "#ebeced",
                                        }}
                                    >
                                        {sanctionIds.map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </TextField>
                                ) : field.name === "approved_by" ? (
                                    <TextField
                                        required={field.required}
                                        select
                                        label={field.label}
                                        name={field.name}
                                        value={sanction[field.name] || ""}
                                        fullWidth
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        sx={{
                                            cursor: "default",
                                            backgroundColor: sanction.updated_fields?.includes(field.name) ? "#fcec03" : "#ebeced",
                                            "& .MuiInputBase-root": {
                                                // pointerEvents: "none"
                                            }
                                        }}
                                    >
                                        {field.options.map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </TextField>
                                ) : (
                                    <TextField
                                        required={field.required}
                                        type={field.type === "date" ? "date" : "text"}
                                        label={field.label}
                                        name={field.name}
                                        value={field.type === "date" && sanction[field.name] ? sanction[field.name].split("T")[0] : (sanction[field.name] || "")}
                                        fullWidth
                                        onChange={handleChange}
                                        InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                                        InputProps={{
                                            readOnly: field.name === "lender_code" || field.name === "sanction_id" || !isEditing,
                                            style: field.name === "sanction_id" || field.name === "lender_code"
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
                    <Box mt={3} sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
                        <Button variant="contained" color="warning" onClick={handleBack}>
                            Back
                        </Button>
                        {isEditing ? (
                            <Button variant="contained" color="primary" onClick={handleUpdate} disabled={!hasChanges(sanction, originalLender)}
                            > Update
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
                <Typography sx={{ textAlign: "center", marginTop: 2 }}>Roc Form details not found</Typography>
            )}
        </Box>
    );
};

export default RocformDetailsmaker;
