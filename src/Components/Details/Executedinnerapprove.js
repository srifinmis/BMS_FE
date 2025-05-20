
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fieldConfig = [
    { name: "sanction_id", label: "Sanction ID" },
    { name: "document_id", label: "Document ID" },
    { name: "document_type", label: "Document Type" },
    { name: "file_name", label: "File Name" },
    { name: "uploaded_date", label: "Uploaded Date" },
    { name: "document_url", label: "Document URL" },
    { name: "remarks", label: "Remarks" },
    { name: "approval_status", label: "Approval Status" }
];

const Executedinnerapprove = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const { sanction_id } = useParams();
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
                const response = await axios.get(`${API_URL}/executed/details/${sanction_id}`);
                // console.log("UseEfffect Individual :", response)
                if (response.status === 201) {
                    setLender(response.data.data[0]);
                    setDataSend(response.data.data[0]);
                }
            } catch (error) {
                console.error("Error fetching Executed details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLenderDetails();
    }, [API_URL, sanction_id]);


    const handleApprove = async () => {
        // setAction("approve");
        // console.log("handle Approve: ", JSON.stringify(dataSend, null, 2));
        try {
            const response = await fetch(`${API_URL}/executed/Approve`, {
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

                localStorage.setItem("submissionMessage", "Executed Documents Approve failed!");
                localStorage.setItem("messageType", "error");

                throw new Error(`Server Error: ${response.status}`);
            }

            // setMessage("Lender added successfully ✅");

            localStorage.setItem("submissionMessage", "Executed Documents Approved successfully!");
            localStorage.setItem("messageType", "success");

            // console.log("Response Data sent to api: ", response);
            navigate("/Approve/ExecutedDocuments");

        } catch (error) {
            // setMessage("Error connecting to the server ⚠️");
            // console.log("Error: connecting to the server ⚠️");
        }

        setRemarks("");
    };

    const handleReject = async () => {
        // setAction("reject");
        if (!remarks.trim()) {
            setRemarksError(true);
            return;
        }


        // console.log("handle Approve: ", JSON.stringify(dataSend, null, 2));
        try {
            const response = await fetch(`${API_URL}/executed/reject`, {
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
                localStorage.setItem("submissionMessage", "Executed Documents Rejection failed!");
                localStorage.setItem("messageType", "error");
                throw new Error(`Server Error: ${response.status}`);
            }

            // setMessage("Lender added successfully ✅");
            // console.log("Response Data sent to api: ", response);
            localStorage.setItem("submissionMessage", "Executed Documents Rejected successfully!");
            localStorage.setItem("messageType", "success");
            // Reset form data after successful submission
            navigate("/Approve/ExecutedDocuments"); // If you want to navigate, otherwise remove this line

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
                Executed Documents Approval
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
                        <Button variant="contained" color="success" onClick={handleApprove}>
                            Approve
                        </Button>
                        <Button variant="contained" color="error" onClick={handleReject} disabled={!remarks.trim()}>
                            Reject
                        </Button>
                    </Box>
                </Paper>
            ) : (
                <Typography sx={{ textAlign: "center", marginTop: 2 }} >Executed Documents not found</Typography>
            )}
        </Box>
    );
};

export default Executedinnerapprove;
