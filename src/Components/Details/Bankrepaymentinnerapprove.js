
import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const fieldConfig = [
    { name: "sanction_id", label: "Sanction ID" },
    { name: "current_ac_no", label: "Current Account No" },
    { name: "bank_name", label: "Bank Name" },
    { name: "bank_branch", label: "Bank Branch" },
    { name: "location", label: "Location" },
    { name: "ifsc_code", label: "IFSC Code" },
    { name: "conf_acc_no", label: "Confirm Account No" },
    { name: "remarks", label: "Remarks" },
];

const Bankrepaymentinnerapprove = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const location = useLocation();
    const { sanction_id, approval_status } = location.state || {};
    const [lender, setLender] = useState(null);
    const [loading, setLoading] = useState(true);
    const [remarks, setRemarks] = useState("");
    const [remarksError, setRemarksError] = useState(false);

    // const [action, setAction] = useState(null);
    const [dataSend, setDataSend] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // setAction("reject");
        const fetchLenderDetails = async () => {
            try {
                // console.log("bank inner 2 params: ", sanction_id, approval_status)
                const response = await axios.get(`${API_URL}/bankrepayment/details`, {
                    params: { sanction_id, approval_status },
                });
                // console.log("UseEfffect inner view :", response.data.sanction)
                if (response.status === 200) {
                    setLender(response.data.sanction);
                    setDataSend(response.data.sanction);
                }
            } catch (error) {
                console.error("Error fetching Bank Repayments details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLenderDetails();
    }, [API_URL, sanction_id, approval_status]);


    const handleApprove = async () => {
        // setAction("approve");
        // console.log("handle Approve: ", JSON.stringify(dataSend, null, 2));
        try {
            // console.log(dataSend)
            const response = await fetch(`${API_URL}/bankrepayment/Approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify(`[ ${dataSend} ]`),
                body: JSON.stringify([{ ...dataSend }]),
            });

            // const data = await response.json();
            // console.log("Response Data sent: ", data);
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);

                localStorage.setItem("submissionMessage", "Bank Repayment Approve failed!");
                localStorage.setItem("messageType", "error");

                throw new Error(`Server Error: ${response.status}`);
            }

            // setMessage("Lender added successfully ✅");

            localStorage.setItem("submissionMessage", "Bank Repayment Approved successfully!");
            localStorage.setItem("messageType", "success");

            // console.log("Response Data sent to api: ", response);
            navigate("/Approve/BankRepayment");

        } catch (error) {
            // setMessage("Error connecting to the server ⚠️");
            // console.log("Error: connecting to the server ⚠️");
        }

        setRemarks("");
    };
    const handleBack = () => {
        navigate("/Approve/BankRepayment");
    };

    const handleReject = async () => {
        // setAction("reject");
        if (!remarks.trim()) {
            setRemarksError(true);
            return;
        }


        // console.log("handle Approve: ", JSON.stringify(dataSend, null, 2));
        try {
            const response = await fetch(`${API_URL}/bankrepayment/reject`, {
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
                localStorage.setItem("submissionMessage", "Bank Repayment Rejection failed!");
                localStorage.setItem("messageType", "error");
                throw new Error(`Server Error: ${response.status}`);
            }

            // setMessage("Lender added successfully ✅");
            // console.log("Response Data sent to api: ", response);
            localStorage.setItem("submissionMessage", "Bank Repayment Rejected successfully!");
            localStorage.setItem("messageType", "success");
            // Reset form data after successful submission
            navigate("/Approve/BankRepayment"); // If you want to navigate, otherwise remove this line

        } catch (error) {
            // setMessage("Error connecting to the server ⚠️");
            // console.log("Error: connecting to the server ⚠️");
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
                Bank Repayment Approval
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : lender ? (
                <Paper elevation={0} sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        {fieldConfig.map((field) => (
                            <Grid key={field.name} item xs={12} sm={6}>
                                <TextField sx={{
                                    cursor: "default", // Prevents pointer from changing
                                    "& .MuiInputBase-root": {
                                        pointerEvents: "none", // Disables interactions
                                    },
                                    backgroundColor: "#ebeced"
                                }}
                                    label={field.label}
                                    value={lender[field.name] || "N/A"}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
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
                <Typography sx={{ textAlign: "center", marginTop: 2 }} >Bank Repayment not found</Typography>
            )}
        </Box>
    );
};

export default Bankrepaymentinnerapprove;
