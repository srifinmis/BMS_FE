import React, { useState, useEffect } from "react";
import { Table, Checkbox, message, Spin } from "antd";
import { Typography, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TrancheDetailsApproval = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [selectedRows, setSelectedRows] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        const response = await axios.get(`${API_URL}/tranche/pendingData`);
        if (response.status === 201) {
          const sortedData = response.data.data.sort(
            (a, b) => new Date(b.updatedat || b.createdat) - new Date(a.updatedat || a.createdat));
          setLenders(sortedData);
        } else {
          message.error("Failed to fetch tranche details");
        }
      } catch (error) {
        console.error("Error fetching tranche details:", error);
        message.error("Error fetching tranche details");
      } finally {
        setLoading(false);
      }
    };
    fetchLenders();
  }, [API_URL]);

  const handleSelect = (lender) => {
    setSelectedRows((prev) =>
      prev.some((row) => row.tranche_id === lender.tranche_id && row.id === lender.id && row.sanction_id === lender.sanction_id)
        ? prev.filter((row) => !(
          row.sanction_id === lender.sanction_id &&
          row.lender_code === lender.lender_code &&
          row.tranche_id === lender.tranche_id &&
          row.updatedat === lender.updatedat
        ))
        : [...prev, lender]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? lenders : []);
  };

  const handleApprove = async () => {
    if (selectedRows.length === 0) {
      message.warning("No tranches selected.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/tranche/Approve`, selectedRows);
      if (response.status === 201) {
        message.success("Tranches Approved successfully.");

        localStorage.setItem("submissionMessage", "Tranches's Approved successfully!");
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
        setLenders((prev) => prev.filter((lender) => !selectedRows.some((row) => row.tranche_id === lender.tranche_id)));
        setSelectedRows([]);
      } else {
        message.error("Approval failed.");
      }
    } catch (error) {
      console.error("Error approving tranches:", error);
      message.error("Approval failed.");
    }
  };
  const handleViewDetails = (tranche_id, id, lender_code, sanction_id, approval_status, updatedat) => {
    navigate(`/trancheapprove/${tranche_id}`, {
      state: { tranche_id, id, lender_code, sanction_id, approval_status, updatedat },
    });
  };
  const handleReject = async () => {
    if (!remarks.trim()) {
      setRemarksError(true);
      return;
    }
    if (selectedRows.length === 0) {
      message.warning("No tranches selected.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/tranche/reject`, selectedRows.map(lender => ({
        tranche_id: lender.tranche_id,
        lender_code: lender.lender_code,
        sanction_id: lender.sanction_id,
        id: lender.id,
        remarks: remarks
      })));
      if (response.status === 201) {
        message.success("Tranches Rejected successfully.");
        localStorage.setItem("submissionMessage", "Tranche Rejected successfully!");
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
        setLenders((prev) => prev.filter((lender) => !selectedRows.some((row) => row.tranche_id === lender.tranche_id)));
        setSelectedRows([]);
        setRemarks("");
        setRemarksError(false);
      } else {
        message.error("Rejection failed.");
      }
    } catch (error) {
      console.error("Error rejecting tranches:", error);
      message.error("Rejection failed.");
    }
  };

  const columns = [
    {
      title: <Checkbox style={{ transform: "scale(1.6)" }} onChange={handleSelectAll} checked={selectedRows.length === lenders.length} />,
      dataIndex: "tranche_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (_, lender) => (
        <Checkbox
          style={{ transform: "scale(1.6)" }}
          checked={selectedRows.some((row) => row.lender_code === lender.lender_code && row.sanction_id === lender.sanction_id && row.tranche_id === lender.tranche_id)}
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
      title: "Tranche ID", dataIndex: "tranche_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Tranche Date", dataIndex: "tranche_date",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Tranche Amount", dataIndex: "tranche_amount",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Interest Type", dataIndex: "interest_type",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Details",
      dataIndex: "tranche_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (code, record) => <Button type="link" onClick={() => handleViewDetails(code, record.id, record.lender_code, record.sanction_id, record.approval_status, record.updatedat)}>View</Button>,
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
        Tranche Details Approval
      </Typography>

      {loading ? (
        <Spin size="large" style={{ margin: "20px auto" }} />
      ) : lenders.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: 20 }}>No Pending Tranches available</p>
      ) : (
        <Table bordered dataSource={lenders} columns={columns} rowKey="tranche_id" pagination={false} />
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

export default TrancheDetailsApproval;
