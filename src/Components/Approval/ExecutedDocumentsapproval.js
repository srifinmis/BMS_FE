import React, { useState, useEffect } from "react";
import { Table, Checkbox, message, Spin } from "antd";
import { Typography, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ExecutedDocumentApproval = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const [selectedRows, setSelectedRows] = useState([]);
    const [remarks, setRemarks] = useState("");
    const [remarksError, setRemarksError] = useState(false);
    const [lenders, setLenders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Lender Data from Backend
    useEffect(() => {
        const fetchLenders = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`${API_URL}/executed/pendingData`);
                // console.log("execution : ", response)
                if (response.status === 201) {
                    setLenders(response.data.data);
                } else {
                    message.error("Failed to fetch Executed Documents");
                }
            } catch (error) {
                console.error("Error fetching Executed Documents:", error);
                message.error("Error fetching Executed Documents");
            } finally {
                setLoading(false);
            }
        };

        fetchLenders();
    }, [API_URL]);

    // Handle row selection
    const handleSelect = (lender) => {
        setSelectedRows((prev) =>
            prev.some((row) => row.document_id === lender.document_id && row.sanction_id === lender.sanction_id)
                ? prev.filter((row) => row.document_id !== lender.document_id && row.sanction_id !== lender.sanction_id)
                : [...prev, lender]
        );
    };

    // Handle select all
    const handleSelectAll = (e) => {
        setSelectedRows(e.target.checked ? lenders : []);
    };
    const handleApprove = async () => {
        if (selectedRows.length === 0) {
            message.warning("No Executed Documents selected.");
            return;
        }

        try {
            setLoading(true);

            // Upload selected documents to S3
            const uploadedDocuments = await Promise.all(
                selectedRows.map(async (lender) => {
                    // Log the lender's document_url to check if it is correct
                    // console.log("Uploading lender document:", lender.document_url);

                    if (!lender.document_url) {
                        throw new Error("Document URL is missing");
                    }

                    const formData = new FormData();
                    formData.append("filePath", lender.document_url); // Send file path as a field

                    // Upload to S3
                    const s3Response = await axios.post(`${API_URL}/upload-s3`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });

                    if (s3Response.status === 200) {
                        return {
                            ...lender,
                            approval_status: "Approved",
                            document_url: s3Response.data.s3Url,
                        };
                    } else {
                        throw new Error("S3 Upload Failed");
                    }
                })
            );

            // Store approved documents in DB
            const response = await axios.post(`${API_URL}/executed/Approve`, uploadedDocuments);

            if (response.status === 201) {
                toast.success("Executed Documents approved and uploaded successfully.");
                setLenders((prev) => prev.filter((lender) => !selectedRows.some((row) => row.sanction_id === lender.sanction_id)));
                setSelectedRows([]);
            } else {
                throw new Error("Approval failed.");
            }
        } catch (error) {
            console.error("Error approving Executed Documents:", error);
            message.error(`Error: ${error.response?.data?.message || "Approval failed."}`);
        } finally {
            setLoading(false);
        }
    };

    // Handle Reject
    const handleReject = async () => {
        if (!remarks.trim()) {
            setRemarksError(true);
            return;
        }
        if (selectedRows.length === 0) {
            message.warning("No Executed Documents selected.");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/executed/reject`,
                selectedRows.map((lender) => ({
                    sanction_id: lender.sanction_id,
                    document_id: lender.document_id,
                    lender_code: lender.lender_code,
                    remarks: remarks
                }))
            );

            if (response.status === 201) {
                toast.success("Executed Documents rejected successfully.");
                setLenders((prev) =>
                    prev.filter((lender) => !selectedRows.some((row) => row.sanction_id === lender.sanction_id))
                );
                setSelectedRows([]);
                setRemarks("");
                setRemarksError(false);
            } else {
                throw new Error("Rejection failed.");
            }
        } catch (error) {
            console.error("Error rejecting Executed Documents:", error);
            message.error(`Error: ${error.response?.data?.message || "Rejection failed."}`);
        }
    };

    // Handle View Document
    const handleViewDetails = async (sanction_id, lender_code) => {
        try {
            const response = await axios.get(`${API_URL}/executed/document/${sanction_id}`, {
                params: { sanction_id, lender_code }
            });

            if (response.status === 200) {
                window.open(response.request.responseURL, "_blank"); // Open document in new tab
            } else {
                message.error("Document not found");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            message.error("Error fetching document");
        }
    };

    const columns = [
        {
            title: <Checkbox style={{ transform: "scale(1.6)" }} onChange={handleSelectAll} checked={selectedRows.length === lenders.length} />,
            dataIndex: "sanction_id",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
            render: (_, lender) => (
                <Checkbox
                    style={{ transform: "scale(1.6)" }}
                    checked={selectedRows.some((row) => row.lender_code === lender.lender_code && row.sanction_id === lender.sanction_id)}
                    onChange={() => handleSelect(lender)}
                />
            ),
        },
        {
            title: "Lender Code", dataIndex: "lender_code",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
        },
        {
            title: "Sanction ID", dataIndex: "sanction_id",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
        },
        {
            title: "Document Type", dataIndex: "document_type",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
        },
        {
            title: "File Name", dataIndex: "file_name",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
        },
        {
            title: "Uploaded Date", dataIndex: "uploaded_date",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
        },
        // { title: "Remarks", dataIndex: "remarks" },
        {
            title: "Actions",
            key: "actions",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
            render: (record) => (
                <>
                    <Button type="link" onClick={() => handleViewDetails(record.sanction_id, record.lender_code)}>
                        View
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                margin: "70px auto",
                marginLeft: isDropped ? "100px" : "280px",
                transition: "margin-left 0.3s ease-in-out",
                width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
                padding: 20,
                border: "3px solid #ccc",
                borderRadius: 10,
                // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
            }}
        >
            <ToastContainer position="top-right" autoClose={5000} />
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
                <Spin size="large" style={{ margin: "20px auto" }} />
            ) : (
                <Table bordered dataSource={lenders} columns={columns} rowKey="sanction_id" pagination={false} />
            )}
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10 }}>
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

export default ExecutedDocumentApproval;



