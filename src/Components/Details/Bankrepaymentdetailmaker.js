import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button, MenuItem } from "@mui/material";
import axios from "axios";

const fieldConfig = [
    { name: "sanction_id", label: "Sanction Id", type: "select" },
    { name: "bank_name", label: "Bank Name" },
    { name: "current_ac_no", label: "Current A/C No" },
    { name: "conf_acc_no", label: "Confirmed A/C No" },
    { name: "bank_branch", label: "Bank Branch" },
    { name: "ifsc_code", label: "IFSC Code" },
    { name: "location", label: "Location" },
    { name: "remarks", label: "Remarks" },
];

const SanctionDetailsmaker = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const location = useLocation();
    const { sanction_id, approval_status } = location.state;
    const navigate = useNavigate();
    const [sanction, setSanction] = useState(null);
    const [sanctionIds, setSanctionIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchSanctionIds = async () => {
            try {
                const response = await axios.get(`${API_URL}/roc/sanctionid`);
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
                // console.log("Bank 2: ", sanction_id, approval_status)
                const response = await axios.get(`${API_URL}/bankrepayment/details`, {
                    params: { sanction_id, approval_status },
                });
                // console.log("Bank: ", response)
                if (response.status === 200) {
                    setSanction(response.data.sanction);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLenderDetails();
    }, [API_URL, sanction_id, approval_status]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        try {
            const createdby = localStorage.getItem("token");  // Fallback to a default value
            const updatedby = localStorage.getItem("token");  // Fallback to a default value

            const bankData = {
                ...sanction,
                createdby,
                updatedby,
            };

            // console.log("Check Bank: ", bankData);
            if (bankData.current_ac_no !== bankData.conf_acc_no) {
                alert("Account numbers must be the same");
                return;
            }
            const response = await fetch(`${API_URL}/bankrepayment/update/${sanction.sanction_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bankData),
            });
            // if (response.status === 201) {
            //     alert("Bank Repayment updated successfully");
            // } else {
            //     alert("Bank Repayment updated failed.");
            // }
            if (response.ok) {
                if (response.status === 201) {
                    alert("Bank Repayment updated Sent to Approval!");
                } else {
                    alert("Bank Repayment updated Sent to Approval Failed!");
                }
            } else {
                const errorResponse = await response.json();
                alert(errorResponse.message);
            }
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating details:", error);
            alert("Failed to update details");
        }
    };

    const handleBack = () => {
        navigate("/DataCreation/RepaymentDetails");
    };

    const handleChange = (e) => {
        setSanction({ ...sanction, [e.target.name]: e.target.value });
    };

    return (
        <Box sx={{
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
        }}>
            <Typography sx={{
                color: "#0056b3",
                fontWeight: "600",
                fontSize: "20px",
                marginBottom: "20px",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: "2px solid #0056b3",
                paddingBottom: "10px",
            }}>
                Bank Repayment
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
                                    >
                                        {(field.name === "sanction_id" ? sanctionIds : field.options).map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </TextField>
                                ) : (
                                    <TextField
                                        label={field.label}
                                        name={field.name}
                                        value={sanction[field.name] || ""}
                                        fullWidth
                                        onChange={handleChange}
                                        InputProps={{ readOnly: !isEditing }}
                                        sx={{ backgroundColor: isEditing ? "#fff" : "#ebeced" }}
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

export default SanctionDetailsmaker;
