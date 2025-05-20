////////////////////////////////////////Test /////////////////////////

import React, { useState, useEffect } from "react";
import { Table, Checkbox, message, Spin } from "antd";
import { Typography, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const BankRepaymentmainApproval = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const [selectedRows, setSelectedRows] = useState([]);
    const [remarks, setRemarks] = useState("");
    const [remarksError, setRemarksError] = useState(false);
    const [lenders, setLenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch Lender Data from Backend
    useEffect(() => {
        const fetchLenders = async () => {
            setLoading(true);

            const submissionMessage = localStorage.getItem("submissionMessage");
            const messageType = localStorage.getItem("messageType");

            if (submissionMessage) {
                // Show toast message
                if (messageType === "success") {
                    toast.success(submissionMessage);
                } else if (messageType === "error") {
                    toast.error(submissionMessage);
                }
                setTimeout(() => {
                    localStorage.removeItem("submissionMessage");
                    localStorage.removeItem("messageType");
                }, 5000);
            }

            try {
                const response = await axios.get(`${API_URL}/bankrepayment/pendingData`);
                // console.log("pending: ", response.data.data);
                if (response.status === 201) {
                    setLenders(response.data.data);
                } else {
                    message.error("Failed to fetch Bank Repayments");
                }
            } catch (error) {
                console.error("Error fetching Bank Repayments:", error);
                message.error("Error fetching Bank Repayments");
            } finally {
                setLoading(false);
            }
        };

        fetchLenders();
    }, [API_URL]);

    // Handle individual row selection
    const handleSelect = (lender) => {
        setSelectedRows((prev) =>
            prev.some((row) => row.sanction_id === lender.sanction_id)
                ? prev.filter((row) => row.sanction_id !== lender.sanction_id)
                : [...prev, lender]
        );
    };

    // Handle select all
    const handleSelectAll = (e) => {
        setSelectedRows(e.target.checked ? lenders : []);
    };

    const handleApprove = async () => {
        if (selectedRows.length === 0) {
            message.warning("No Bank Repayment selected.");
            return;
        }

        // console.log("Approval Request Data: ", selectedRows); // Debugging

        try {
            // Send full lender data for insertion & update
            const response = await axios.post(`${API_URL}/bankrepayment/Approve`, selectedRows.map((lender) => ({
                ...lender,
                approval_status: "Approved"
            })));

            if (response.status === 201) {
                message.success("Bank Repayments approved successfully.");

                localStorage.setItem("submissionMessage", "Bank Repayments Approved successfully!");
                localStorage.setItem("messageType", "success");

                const submissionMessage = localStorage.getItem("submissionMessage");
                const messageType = localStorage.getItem("messageType");

                if (submissionMessage) {
                    // Show toast message
                    if (messageType === "success") {
                        toast.success(submissionMessage);
                    } else if (messageType === "error") {
                        toast.error(submissionMessage);
                    }
                    setTimeout(() => {
                        localStorage.removeItem("submissionMessage");
                        localStorage.removeItem("messageType");
                    }, 5000);
                }

                // Remove approved lenders from UI
                setLenders((prev) => prev.filter((lender) => !selectedRows.some((row) => row.sanction_id === lender.sanction_id)));
                setSelectedRows([]);
            } else {
                message.error("Approval failed.");

                localStorage.setItem("submissionMessage", "Bank Repayments Approval failed!");
                localStorage.setItem("messageType", "error");
                const submissionMessage = localStorage.getItem("submissionMessage");
                const messageType = localStorage.getItem("messageType");

                if (submissionMessage) {
                    // Show toast message
                    if (messageType === "success") {
                        toast.success(submissionMessage);
                    } else if (messageType === "error") {
                        toast.error(submissionMessage);
                    }
                    setTimeout(() => {
                        localStorage.removeItem("submissionMessage");
                        localStorage.removeItem("messageType");
                    }, 5000);
                }
            }
        } catch (error) {
            console.error("Error approving Bank Repayments:", error);
            message.error(`Error: ${error.response?.data?.message || "Approval failed."}`);
        }
        setRemarks("");
    };

    // 
    const handleReject = async () => {
        if (!remarks.trim()) {
            setRemarksError(true);
            return;
        }
        if (selectedRows.length === 0) {
            message.warning("No Bank Repayments selected.");
            return;
        }

        // console.log("Reject Request Data: ", selectedRows);

        try {
            // Send full lender data for rejection

            const response = await axios.post(`${API_URL}/bankrepayment/reject`,
                selectedRows.map((lender) => ({
                    sanction_id: lender.sanction_id,
                    remarks: remarks
                }))
            );


            if (response.status === 201) {
                message.success("Bank Repayment rejected successfully.");

                localStorage.setItem("submissionMessage", "Bank Repayments Rejected successfully!");
                localStorage.setItem("messageType", "success");

                const submissionMessage = localStorage.getItem("submissionMessage");
                const messageType = localStorage.getItem("messageType");

                if (submissionMessage) {
                    // Show toast message
                    if (messageType === "success") {
                        toast.success(submissionMessage);
                    } else if (messageType === "error") {
                        toast.error(submissionMessage);
                    }
                    setTimeout(() => {
                        localStorage.removeItem("submissionMessage");
                        localStorage.removeItem("messageType");
                    }, 5000);
                }

                // Remove rejected lenders from UI
                setLenders((prev) =>
                    prev.filter((lender) => !selectedRows.some((row) => row.sanction_id === lender.sanction_id))
                );
                setSelectedRows([]);
                setRemarks("");
                setRemarksError(false);
            } else {
                message.error("Rejection failed.");
                localStorage.setItem("submissionMessage", "Bank Repayments Rejection failed!");
                localStorage.setItem("messageType", "error");
                const submissionMessage = localStorage.getItem("submissionMessage");
                const messageType = localStorage.getItem("messageType");

                if (submissionMessage) {
                    // Show toast message
                    if (messageType === "success") {
                        toast.success(submissionMessage);
                    } else if (messageType === "error") {
                        toast.error(submissionMessage);
                    }
                    setTimeout(() => {
                        localStorage.removeItem("submissionMessage");
                        localStorage.removeItem("messageType");
                    }, 5000);
                }

            }
        } catch (error) {
            console.error("Error rejecting lenders:", error);
            message.error(`Error: ${error.response?.data?.message || "Rejection failed."}`);
        }

        // console.log("Rejected with remarks:", remarks);
    };

    //
    const handleViewDetails = (sanction_id, approval_status) => {
        navigate(`/bankrepaymentapprove/${sanction_id}`, {
            state: { sanction_id, approval_status },
        });
    };

    const columns = [
        {
            title: <Checkbox onChange={handleSelectAll} checked={selectedRows.length === lenders.length} />,
            dataIndex: "sanction_id",
            render: (_, lender) => (
                <Checkbox
                    checked={selectedRows.some((row) => row.sanction_id === lender.sanction_id)}
                    onChange={() => handleSelect(lender)}
                />
            ),
        },
        { title: "Sanction ID", dataIndex: "sanction_id" },
        { title: "Current Ac No", dataIndex: "current_ac_no" },
        { title: "Bank Name", dataIndex: "bank_name" },
        { title: "Bank Branch", dataIndex: "bank_branch" },
        { title: "Location", dataIndex: "location" },
        // { title: "Remarks", dataIndex: "remarks" },
        {
            title: "Details",
            dataIndex: "sanction_id",
            render: (code, record) => <Button type="link" onClick={() => handleViewDetails(code, record.approval_status)}>View</Button>,
        },
    ];

    return (
        <div style={{
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
            borderRadius: 10,
            // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
        }}>
            <ToastContainer position="top-right" autoClose={5000} />
            <Typography
                sx={{
                    color: "#0056b3",
                    fontWeight: "600",
                    fontSize: "20px",
                    marginTop: "20px",
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
                <Spin size="large" style={{ margin: "20px auto" }} />
            ) : lenders.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: 20 }}>No Bank Repayments available</p>
            ) : (
                <Table dataSource={lenders} columns={columns} rowKey="sanction_id" pagination={false} />
            )}

            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", marginRight: "20px" }}>

                <TextField
                    label="Remarks (Required for Rejection)"
                    value={remarks}
                    onChange={(e) => {
                        setRemarks(e.target.value);
                        if (e.target.value.trim()) setRemarksError(false); // Remove error when user types
                    }}
                    multilines
                    rows={0} xs={12} sm={6}
                    sx={{ marginTop: 2, width: "400px" }}
                    required
                    error={remarksError}
                    helperText={remarksError ? "Remarks are required when rejecting." : ""}
                />
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10, width: "100%" }}>
                <Button variant="contained" color="success" style={{ marginBottom: "20px", marginRight: "20px" }} onClick={handleApprove} disabled={selectedRows.length === 0 || loading}>
                    Approve
                </Button>
                <Button variant="contained" color="error" style={{ marginBottom: "20px", marginRight: "20px" }} onClick={handleReject} disabled={selectedRows.length === 0 || !remarks.trim() || loading}>
                    Reject
                </Button>
            </div>
        </div>
    );
};

export default BankRepaymentmainApproval;

