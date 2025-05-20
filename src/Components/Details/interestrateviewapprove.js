import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const fieldConfig = [
    { name: "lender_code", label: "Lender Code", type: "text" },
    { name: "sanction_id", label: "Sanction ID", type: "text" },
    { name: "tranche_id", label: "Tranche ID", type: "text" },
    { name: "new_interest_rate", label: "New Interest Rate(%)", type: "number" },
    { name: "effective_date", label: "Effective Date" },
    { name: "updatedat", label: "Updated Date", type: "date" },
    { name: "updatedby", label: "Updated By", type: "text" },
];

const InterestRateapprove = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const location = useLocation();
    const { tranche_id, lender_code, sanction_id, approval_status, createdat } = location.state || {};
    const [lender, setLender] = useState("");
    const [loading, setLoading] = useState(true);
    const [remarks, setRemarks] = useState("");
    const [remarksError, setRemarksError] = useState(false);
    const [dataSend, setDataSend] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLenderDetails = async () => {
            try {
                // console.log("Interest Rate approval view: ", tranche_id, lender_code, sanction_id, approval_status, createdat)
                const response = await axios.get(
                    `${API_URL}/interest/details`,
                    {
                        params: {
                            sanction_id, tranche_id, lender_code, approval_status, createdat
                        }
                    }
                );
                // console.log("UseEfffect Interest view approval :", response.data.interest)
                if (response.status === 200) {
                    setLender(response.data.interest);
                    setDataSend(response.data.interest);
                }
            } catch (error) {
                console.error("Error fetching Interestrate details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLenderDetails();
    }, [API_URL, tranche_id, approval_status, createdat, lender_code, sanction_id]);


    const handleApprove = async () => {
        try {
            const response = await fetch(`${API_URL}/interest/Approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([{ ...dataSend }]),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);

                localStorage.setItem("submissionMessage", "Interest Rate Approve failed!");
                localStorage.setItem("messageType", "error");

                throw new Error(`Server Error: ${response.status}`);
            }

            localStorage.setItem("submissionMessage", "Interest Rate Approved successfully!");
            localStorage.setItem("messageType", "success");

            navigate("/Approve/Interestrate");

        } catch (error) {
            // console.log("Error: connecting to the server ⚠️");
        }

        setRemarks("");
    };
    const handleBack = () => {
        navigate("/Approve/Interestrate");
    };

    const handleReject = async () => {
        if (!remarks.trim()) {
            setRemarksError(true);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/interest/reject`, {
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
                localStorage.setItem("submissionMessage", "Interest Rate Rejection failed!");
                localStorage.setItem("messageType", "error");
                throw new Error(`Server Error: ${response.status}`);
            }
            localStorage.setItem("submissionMessage", "Interest Rate Rejected successfully!");
            localStorage.setItem("messageType", "success");
            navigate("/Approve/Interestrate");

        } catch (error) {
            // console.log("Error: connecting to the server ⚠️");
        }
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
                Interest Rate Approval
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
                        <TextField
                            label="Remarks (Required for Rejection)"
                            value={remarks}
                            onChange={(e) => {
                                setRemarks(e.target.value);
                                if (e.target.value.trim()) setRemarksError(false);
                            }}
                            fullWidth
                            multiline
                            rows={0} xs={12} sm={6}
                            sx={{ marginTop: 2 }}
                            required
                            error={remarksError}
                            helperText={remarksError ? "Remarks are required when rejecting." : ""}
                        />
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
                <Typography sx={{ textAlign: "center", marginTop: 2 }} >Sanction details not found</Typography>
            )}
        </Box>
    );
};

export default InterestRateapprove;
