import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const fieldConfig = [
    { name: "lender_code", label: "Lender Code", type: "text" },
    { name: "sanction_id", label: "Sanction ID", type: "text" },
    { name: "tranche_id", label: "Tranche ID", type: "text" },
    { name: "tranche_date", label: "Tranche Date", type: "date" },
    { name: "tranche_number", label: "Tranche Number", type: "number" },
    { name: "tranche_amount", label: "Tranche Amount", type: "number" },
    { name: "interest_type", label: "Interest Type", type: "select", options: ["Fixed", "Floating"] },
    { name: "interest_rate", label: "Interest Rate", type: "number" },
    { name: "tenure_months", label: "Tenure (Months)", type: "number" },
    { name: "principal_start_date", label: "Principal Start Date", type: "date" },
    { name: "interest_start_date", label: "Interest Start Date", type: "date" },
    { name: "principal_payment_frequency", label: "Principal Payment Frequency", type: "text" },
    { name: "interest_payment_frequency", label: "Interest Payment Frequency", type: "text" },
    { name: "applicable_of_leap_year", label: "Applicable for Leap Year", type: "select", options: ["Yes", "No"] },
    { name: "interest_calculation_days", label: "Interest Calculation Days", type: "number" },
    { name: "current_ac_no", label: "Current A/C No", required: true, type: "text" },
    { name: "conf_acc_no", label: "Confirm A/C No", required: true, type: "text" },
    { name: "bank_name", label: "Name of the Bank", required: true, type: "text" },
    { name: "bank_branch", label: "Bank Branch", required: true, type: "text" },
    { name: "location", label: "Location", required: true, type: "text" },
    { name: "ifsc_code", label: "IFSC Code", required: true, type: "text" },
];



const TrancheDetailsapprove = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const location = useLocation();
    const { tranche_id, id, lender_code, sanction_id, approval_status, updatedat } = location.state || {};
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
                // console.log("Tranche approval view: ", tranche_id, approval_status)
                const response = await axios.get(
                    `${API_URL}/tranche/details`,
                    {
                        params: {
                            tranche_id, id, lender_code, sanction_id, approval_status, updatedat
                        }
                    }
                );
                // console.log("UseEfffect tranche view approval :", response.data.tranche)
                if (response.status === 200) {
                    setLender(response.data.tranche);
                    setDataSend(response.data.tranche);
                }
            } catch (error) {
                console.error("Error fetching lender details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLenderDetails();
    }, [API_URL, tranche_id, id, approval_status, lender_code, sanction_id, updatedat]);


    const handleApprove = async () => {
        try {
            const response = await fetch(`${API_URL}/tranche/Approve`, {
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

                localStorage.setItem("submissionMessage", "Tranche Approve failed!");
                localStorage.setItem("messageType", "error");

                throw new Error(`Server Error: ${response.status}`);
            }

            // setMessage("Lender added successfully ✅");

            localStorage.setItem("submissionMessage", "Tranche Approved successfully!");
            localStorage.setItem("messageType", "success");

            // console.log("Response Data sent to api: ", response);
            navigate("/Approve/Tranchedetails");

        } catch (error) {
            // setMessage("Error connecting to the server ⚠️");
            console.log("Error: connecting to the server ⚠️");
        }

        setRemarks("");
    };
    const handleBack = () => {
        navigate("/Approve/Tranchedetails");
    };

    const handleReject = async () => {
        // setAction("reject");
        if (!remarks.trim()) {
            setRemarksError(true);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/tranche/reject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([{ ...dataSend, remarks }]),
            });

            // const data = await response.json();
            // console.log("Response Data sent: ", data);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
                localStorage.setItem("submissionMessage", "Tranche Rejection failed!");
                localStorage.setItem("messageType", "error");
                throw new Error(`Server Error: ${response.status}`);
            }

            // setMessage("Lender added successfully ✅");
            // console.log("Response Data sent to api: ", response);
            localStorage.setItem("submissionMessage", "Tranche Rejected successfully!");
            localStorage.setItem("messageType", "success");
            // Reset form data after successful submission
            navigate("/Approve/Tranchedetails"); // If you want to navigate, otherwise remove this line

        } catch (error) {
            // setMessage("Error connecting to the server ⚠️");
            console.log("Error: connecting to the server ⚠️");
        }

        // console.log("Rejected with remarks:", remarks);

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
                // width: "auto",
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
                Tranche Details Approval
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
                                        cursor: "default",
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
                <Typography sx={{ textAlign: "center", marginTop: 2 }} >Tranche Details not found</Typography>
            )}
        </Box>
    );
};

export default TrancheDetailsapprove;
