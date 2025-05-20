
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button } from "@mui/material";
import axios from "axios";
const fieldConfig = [
    { name: "sanction_id", label: "Sanction ID" },
    { name: "document_type", label: "Document Type" },
    { name: "file_name", label: "File Name" },
    { name: "uploaded_date", label: "Uploaded Date" },
    { name: "document_url", label: "Document URL" },
    { name: "approval_status", label: "Approval Status" },
    { name: "remarks", label: "Remarks" },
];

const Executedmaker = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const { sanction_id } = useParams();
    const navigate = useNavigate();
    const [sanction, setSanction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchLenderDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/executed/details/${sanction_id}`);
                // console.log('Response: ', response.data.data[0]);
                if (response.status === 201) {
                    setSanction(response.data.data[0]);
                }
            } catch (error) {
                console.error("Error fetching roc details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLenderDetails();
    }, [API_URL, sanction_id]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        try {
            // console.log("update roc: ", sanction);
            const response = await fetch(`${API_URL}/executed/update/${sanction.sanction_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify(`[ ${dataSend} ]`),
                body: JSON.stringify(sanction),
            });
            // console.log("API hit data : ", response);
            if (response.status === 201) {
                alert("Execution Documents updated Sent to Approval!");
            } else {
                alert("Execution Documents updated Sent to Approval failed.");
            }
            navigate("/DataCreation/ExecutedDocuments");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating ROC details:", error);
            alert("Failed to update lender details");
        }
    };

    const handleBack = () => {
        navigate("/DataCreation/ExecutedDocuments"); // Adjust as per actual main page route
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
                Executed Documents
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : sanction ? (
                <Paper elevation={0} sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        {fieldConfig.map((field) => (
                            <Grid key={field.name} item xs={12} sm={6}>
                                <TextField
                                    label={field.label}
                                    name={field.name}
                                    value={sanction[field.name] || ""}
                                    fullWidth
                                    onChange={handleChange}
                                    InputProps={{ readOnly: !isEditing }}
                                    // sx={{
                                    //     backgroundColor: isEditing ? "#fff" : "#ebeced",
                                    // }}
                                    sx={{
                                        cursor: "default",
                                        backgroundColor: sanction.updated_fields?.includes(field.name) ? "#fcec03" : "#fff",
                                        "& .MuiInputBase-root": {
                                            // pointerEvents: "none"
                                        }
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Box mt={3} sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
                        <Button variant="contained" color="warning" onClick={handleBack}>
                            Back
                        </Button>
                        {isEditing ? (
                            <Button variant="contained" color="primary" onClick={handleUpdate}>
                                Update
                            </Button>
                        ) : (
                            <Button variant="contained" color="error" onClick={handleEdit}>
                                Edit
                            </Button>
                        )}

                    </Box>
                </Paper>
            ) : (
                <Typography sx={{ textAlign: "center", marginTop: 2 }}>Bank Repayment details not found</Typography>
            )}
        </Box>
    );
};

export default Executedmaker;