import React, { useState, useEffect } from "react";
import { Table, Checkbox, message, Spin } from "antd";
import { Typography, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InterestRateChangeApproval = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [selectedRows, setSelectedRows] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);
  const [interestRates, setInterestRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterestRates = async () => {
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
        const response = await axios.get(`${API_URL}/interest/pendingData`);
        // console.log("pending intrest: ", response)
        if (response.status === 201) {
          const sortedData = response.data.data.sort(
            (a, b) => new Date(b.updatedat || b.createdat) - new Date(a.updatedat || a.createdat));

          setInterestRates(sortedData);
        } else {
          message.error("Failed to fetch interest rate changes");
        }
      } catch (error) {
        console.error("Error fetching interest rates:", error);
        message.error("Error fetching interest rates");
      } finally {
        setLoading(false);
      }
    };
    fetchInterestRates();
  }, [API_URL]);

  const handleSelect = (record) => {
    setSelectedRows((prev) => {
      const exists = prev.some(
        (row) => row.change_id === record.change_id && row.sanction_id === record.sanction_id && row.tranche_id === record.tranche_id
      );

      if (exists) {
        return prev.filter(
          (row) => !(row.change_id === record.change_id && row.sanction_id === record.sanction_id && row.tranche_id === record.tranche_id)
        );
      } else {
        return [...prev, record];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(interestRates.map(({ sanction_id, tranche_id }) => ({ sanction_id, tranche_id })));
    } else {
      setSelectedRows([]);
    }
  };

  const handleViewDetails = (sanction_id, lender_code, tranche_id, approval_status, createdat) => {
    navigate(`/interestrateapprove/${sanction_id}`, {
      state: { sanction_id, lender_code, tranche_id, approval_status, createdat },
    });
  };

  const handleApprove = async () => {
    if (selectedRows.length === 0) {
      message.warning("No interest rate changes selected.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/interest/Approve`, selectedRows);
      if (response.status === 201) {
        message.success("Interest rate changes approved successfully.");
        localStorage.setItem("submissionMessage", "Interest Rate Approved successfully!");
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
        setInterestRates((prev) => prev.filter((rate) => !selectedRows.includes(rate)));
        setSelectedRows([]);
      } else {
        message.error("Approval failed.");
      }
    } catch (error) {
      console.error("Error approving interest rates:", error);
      message.error("Approval failed.");
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      setRemarksError(true);
      return;
    }
    if (selectedRows.length === 0) {
      message.warning("No interest rate changes selected.");
      return;
    }
    try {
      // console.log("slected: rows: ", selectedRows)
      const response = await axios.post(`${API_URL}/interest/reject`, selectedRows.map(lender => ({
        tranche_id: lender.tranche_id,
        sanction_id: lender.sanction_id,
        lender_code: lender.lender_code,
        change_id: lender.change_id,
        remarks: remarks
      })));
      if (response.status === 201) {
        message.success("Interest rate changes rejected successfully.");
        localStorage.setItem("submissionMessage", "Interest Rate Rejected successfully!");
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
        setInterestRates((prev) => prev.filter((rate) => !selectedRows.includes(rate)));
        setSelectedRows([]);
        setRemarks("");
        setRemarksError(false);
      } else {
        message.error("Rejection failed.");
      }
    } catch (error) {
      console.error("Error rejecting interest rates:", error);
      message.error("Rejection failed.");
    }
  };

  const columns = [
    {
      title: <Checkbox style={{ transform: "scale(1.6)" }} onChange={handleSelectAll} checked={selectedRows.length === interestRates.length} />,
      dataIndex: "change_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (_, record) => (
        <Checkbox
          style={{ transform: "scale(1.6)" }}
          checked={selectedRows.some(
            (row) => row.change_id === record.change_id && row.sanction_id === record.sanction_id && row.tranche_id === record.tranche_id
          )}
          onChange={() => handleSelect(record)}
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
      title: "New Interest Rate", dataIndex: "new_interest_rate",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    // { title: "Effective Date", dataIndex: "effective_date" },
    // { title: "Updated Date", dataIndex: "updatedat" },
    {
      title: "Updated By", dataIndex: "updatedby",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Details",
      dataIndex: "sanction_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (code, record) => <Button type="link" onClick={() => handleViewDetails(code, record.lender_code, record.tranche_id, record.approval_status, record.createdat)}>View</Button>,
    },
  ];

  return (
    <div style={{
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
    }}>
      <ToastContainer position="top-right" autoClose={5000} />
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
        Interest Rate Change Approval
      </Typography>
      {
        loading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : interestRates.length === 0 ? (
          <p style={{ textAlign: "center" }}>No pending Interest Rate Changes Available</p>
        ) : (
          <Table bordered dataSource={interestRates}
            columns={columns}
            rowKey="change_id"
            pagination={false} />
        )
      }
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", marginRight: "20px" }}>
        <TextField
          label="Remarks (Required for Rejection)"
          value={remarks}
          onChange={(e) => {
            setRemarks(e.target.value);
            setRemarksError(!e.target.value.trim());
          }}
          fullWidth
          multiline
          rows={2}
          error={remarksError}
          helperText={remarksError ? "Remarks are required when rejecting." : ""}
          sx={{ marginTop: 2, width: "400px" }}
        />
      </div>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10 }}>
        <Button variant="contained" color="success" onClick={handleApprove} disabled={selectedRows.length === 0 || loading}>
          Approve
        </Button>
        <Button variant="contained" color="error" onClick={handleReject} disabled={selectedRows.length === 0 || !remarks.trim() || loading}>
          Reject
        </Button>
      </div>
    </div >
  );
};

export default InterestRateChangeApproval;