import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const fieldConfig = [
    { name: "lender_code", label: "Lender Code" },
    { name: "sanction_id", label: "Sanction ID" },
    { name: "loan_type", label: "Loan Type" },
    { name: "sanction_amount", label: "Sanction Amount" },
    { name: "sanction_date", label: "Sanction Date" },
    { name: "sanction_validity", label: "Sanction Validity" },
    { name: "interest_type", label: "Interest Type" },
    { name: "interest_rate_fixed", label: "Interest Rate (Fixed)" },
    { name: "benchmark_rate", label: "Benchmark Rate" },
    { name: "spread_floating", label: "Spread Floating" },
    { name: "interest_payment_term", label: "Interest Payment Term" },
    { name: "principal_repayment_term", label: "Principal Repayment Term" },
    { name: "processing_fee", label: "Processing Fee" },
    { name: "prepayment_charges", label: "Prepayment Charges" },
    { name: "penal_charges", label: "Penal Charges" },
    { name: "book_debt_margin", label: "Book Debt Margin" },
    { name: "cash_margin", label: "Cash Margin" },
    { name: "other_expenses", label: "Other Expenses" },
    { name: "corporate_guarantee", label: "Corporate Guarantee" },
    { name: "purpose_of_loan", label: "Purpose of Loan" },
    { name: "syndicated_by", label: "Syndicated By" },
    { name: "syndication_fee", label: "Syndication Fee" },
    { name: "tenure_months", label: "Tenure (Months)" },
];


const SanctionDetailsapprove = ({ isDropped }) => {
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
        const fetchLenderDetails = async () => {
            try {
                // console.log("Sanction approval view: ", sanction_id, lender_code, approval_status, updatedat)
                const response = await axios.get(
                    `${API_URL}/sanction/details`,
                    {
                        params: {
                            sanction_id, lender_code, approval_status, updatedat
                        }
                    }
                ); 
                // console.log("UseEfffect sanction view approval :", response.data.sanction)
                if (response.status === 200) {
                    setLender(response.data.sanction);
                    setDataSend(response.data.sanction);
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
            const response = await fetch(`${API_URL}/sanction/Approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([{ ...dataSend }]),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);

                localStorage.setItem("submissionMessage", "Sanction Approve failed!");
                localStorage.setItem("messageType", "error");

                throw new Error(`Server Error: ${response.status}`);
            }
            localStorage.setItem("submissionMessage", "Sanction Approved successfully!");
            localStorage.setItem("messageType", "success");

            // console.log("Response Data sent to api: ", response);
            navigate("/Approve/SanctionDetails");

        } catch (error) {
            // setMessage("Error connecting to the server ⚠️");
            console.log("Error: connecting to the server ⚠️");
        }

        setRemarks("");
    };
    const handleBack = () => {
        navigate("/Approve/SanctionDetails");
    };

    const handleReject = async () => {
        // setAction("reject");
        if (!remarks.trim()) {
            setRemarksError(true);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/sanction/reject`, {
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
                localStorage.setItem("submissionMessage", "Sanction Rejection failed!");
                localStorage.setItem("messageType", "error");
                throw new Error(`Server Error: ${response.status}`);
            }

            localStorage.setItem("submissionMessage", "Sanction Rejected successfully!");
            localStorage.setItem("messageType", "success");
            // Reset form data after successful submission
            navigate("/Approve/SanctionDetails"); // If you want to navigate, otherwise remove this line

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
                Sanction Details Approval
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : lender ? (
                <Paper elevation={0} sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        {fieldConfig.map((field) => (
                            <Grid key={field.name} item xs={6} sm={4}>
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
                <Typography sx={{ textAlign: "center", marginTop: 2 }} >Sanction details not found</Typography>
            )}
        </Box>
    );
};

export default SanctionDetailsapprove;
