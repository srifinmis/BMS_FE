import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
const fieldConfig = [
    { name: "lender_code", label: "Lender Code" },
    { name: "sanction_id", label: "Sanction ID" },
    { name: "approved_by", label: "Approved By" },
    { name: "date_of_approval", label: "Date of Approval", type: "date" },
    { name: "document_executed_date", label: "Document Executed Date", type: "date" },
    { name: "due_date_charge_creation", label: "Due Date Charge Creation", type: "date" },
    { name: "date_of_form_filed_creation", label: "Date of Form Filed Creation", type: "date" },
    { name: "due_date_satisfaction", label: "Due Date Satisfaction", type: "date" },
    { name: "date_of_filing_satisfaction", label: "Date of Filing Satisfaction", type: "date" },
];

const LenderDetailsapprove = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const location = useLocation();
    const { sanction_id, lender_code, approval_status, updatedat } = location.state || {};
    const [lender, setLender] = useState("");
    const [loading, setLoading] = useState(true);
    const [remarks, setRemarks] = useState("");
    const [remarksError, setRemarksError] = useState(false);
    const [dataSend, setDataSend] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // setAction("reject");
        const fetchLenderDetails = async () => {
            try {
                // console.log("both param roc: ", sanction_id, lender_code, approval_status, updatedat)
                const response = await axios.get(`${API_URL}/roc/details`, {
                    params: { sanction_id, lender_code, approval_status, updatedat },
                });
                // console.log("UseEfffect roc approval all Individual :", response.data.roc)
                if (response.status === 200) {
                    setLender(response.data.roc);
                    setDataSend(response.data.roc);
                }
            } catch (error) {
                console.error("Error fetching lender details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLenderDetails();
    }, [API_URL, sanction_id, approval_status, lender_code, updatedat]);


    const handleApprove = async () => {
        try {
            const response = await fetch(`${API_URL}/roc/Approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify(`[ ${dataSend} ]`),
                body: JSON.stringify([{ ...dataSend }]),
            });

            // console.log("Response Data sent: ", data);
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);

                localStorage.setItem("submissionMessage", "ROC Forms Approve failed!");
                localStorage.setItem("messageType", "error");

                throw new Error(`Server Error: ${response.status}`);
            }
            localStorage.setItem("submissionMessage", "ROC Forms Approved successfully!");
            localStorage.setItem("messageType", "success");
            navigate("/Approve/ROCForm");

        } catch (error) {
            console.log("Error: connecting to the server ⚠️");
        }

        setRemarks("");
    };
    const handleBack = () => {
        navigate("/Approve/ROCForm");
    };
    const handleReject = async () => {
        if (!remarks.trim()) {
            setRemarksError(true);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/roc/reject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify(`[ ${dataSend} ]`),
                body: JSON.stringify([{ ...dataSend, remarks }]),
            });

            // const data = await response.json();
            // console.log("Response Data sent: ", data);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
                localStorage.setItem("submissionMessage", "ROC Forms Rejection failed!");
                localStorage.setItem("messageType", "error");
                throw new Error(`Server Error: ${response.status}`);
            }
            localStorage.setItem("submissionMessage", "ROC Forms Rejected successfully!");
            localStorage.setItem("messageType", "success");
            // Reset form data after successful submission
            navigate("/Approve/ROCForm"); // If you want to navigate, otherwise remove this line

        } catch (error) {
            // setMessage("Error connecting to the server ⚠️");
            console.log("Error: connecting to the server ⚠️");
        }

        // Reset state after rejection
        setRemarks("");
        setRemarksError(false);

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
                ROC Forms Approval
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : lender ? (
                <Paper elevation={0} sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        {fieldConfig.map((field) => (
                            <Grid key={field.name} item xs={12} sm={6}>
                                <TextField
                                    label={field.label}
                                    value={lender[field.name] || "N/A"}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                    sx={{
                                        cursor: "default", // Prevents pointer from changing
                                        backgroundColor: lender.updated_fields?.includes(field.name) ? "#fcec03" : "#ebeced",
                                        "& .MuiInputBase-root": {
                                            pointerEvents: "none"
                                        }
                                    }}

                                />
                            </Grid>
                        ))}
                        {/* {action === "reject" && ( */}
                        <TextField
                            label="Remarks (Required for Rejection)"
                            value={remarks}
                            onChange={(e) => {
                                setRemarks(e.target.value);
                                if (e.target.value.trim()) setRemarksError(false); // Remove error when user types
                            }}
                            fullWidth
                            multiline
                            rows={0} xs={12} sm={6}
                            sx={{ marginTop: 2 }}
                            required
                            error={remarksError}
                            helperText={remarksError ? "Remarks are required when rejecting." : ""}
                        />
                        {/* )} */}
                    </Grid>
                    <Box sx={{ marginTop: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                        <Button variant="contained" color="warning" onClick={handleBack}>
                            Back
                        </Button>
                        <Button variant="contained" color="success" onClick={handleApprove}>
                            Approve
                        </Button>
                        <Button variant="contained" color="error" onClick={handleReject} disabled={!remarks.trim()}>
                            Reject
                        </Button>
                    </Box>
                </Paper>
            ) : (
                <Typography sx={{ textAlign: "center", marginTop: 2 }} >ROC Forms details not found</Typography>
            )}
        </Box>
    );
};

export default LenderDetailsapprove;
