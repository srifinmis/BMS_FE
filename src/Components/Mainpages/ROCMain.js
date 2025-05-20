import React, { useState, useEffect } from "react";
import { Table, Spin, message, Button, Input, Select, Tag } from "antd";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const { Option } = Select;

const RocFormMain = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [rocDetails, setRocDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRocDetails = async () => {
      setLoading(true);
      const submissionMessage = localStorage.getItem("submissionMessage");
      const messageType = localStorage.getItem("messageType");

      if (submissionMessage) {
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
        const response = await axios.get(`${API_URL}/roc/fetchAll`);
        // console.log("roc fetchAll: ", response)
        if (response.data.success) {
          const combinedRoc = [
            ...response.data.mainData,
            ...response.data.data,
          ];
          setRocDetails(combinedRoc);
        } else {
          message.error("Failed to fetch ROC details");
        }
      } catch (error) {
        console.error("Error fetching ROC details:", error);
        message.error("Error fetching ROC details");
      } finally {
        setLoading(false);
      }
    };
    fetchRocDetails();
  }, [API_URL]);

  const handleViewDetails = (sanction_id, lender_code, approval_status, updatedat) => {
    navigate(`/rocmaker/${sanction_id}`, {
      state: { sanction_id, lender_code, approval_status, updatedat },
    });
  };

  const handleAddNewRocForm = () => {
    navigate("/addrocform");
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const handleFilterChange = async (value) => {
    setFilterStatus(value);
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/roc/fetchAll`);
      // console.log("roc fetch:", response)
      if (response.data.success) {
        let filteredRoc = [];

        if (value === "All") {
          // Combine Approved and others
          filteredRoc = [...response.data.mainData, ...response.data.data];
        }
        else if (value === "Approved") {
          filteredRoc = response.data.mainData;
        } else {
          filteredRoc = response.data.data.filter((lender) => lender.approval_status === value);
        }
        setRocDetails(filteredRoc);
      } else {
        message.error("Failed to filter ROC");
      }
    } catch (error) {
      console.error("Error filtering ROC:", error);
      message.error("Error filtering ROC");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Approved: "green",
    "Approval Pending": "orange",
    Rejected: "red",
  };

  const filteredRocDetails = rocDetails.filter((roc) =>
    Object.values(roc).some((field) =>
      field && field.toString().toLowerCase().includes(searchText)
    )).sort((a, b) => new Date(b.updatedat || b.createdat) - new Date(a.updatedat || a.createdat));


  const columns = [
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
      title: "Approved By", dataIndex: "approved_by",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Date of Approval", dataIndex: "date_of_approval",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Document Executed Date", dataIndex: "document_executed_date",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    // {
    //   title: "Due Date - Charge Creation", dataIndex: "due_date_charge_creation",
    //   onHeaderCell: () => ({
    //     style: { backgroundColor: "#a2b0cc", color: "black" }
    //   }),
    // },
    {
      title: "Approval Status",
      dataIndex: "approval_status",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (status) => <Tag color={statusColors[status] || "blue"}>{status}</Tag>,
    },
    {
      title: "Details",
      dataIndex: "sanction_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (code, record) => (
        <Button type="link" onClick={() => handleViewDetails(code, record.lender_code, record.approval_status, record.updatedat)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "70px",
        height: "300px",
        marginLeft: isDropped ? "100px" : "280px",
        transition: "margin-left 0.3s ease-in-out",
        width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
        padding: 3,
      }}>
      <ToastContainer position="top-right" autoClose={5000} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>ROC Form Details</h2>
        <Input
          placeholder="Search ROC details..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px", height: "40px" }}
        />
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          style={{ width: "200px", height: "40px", marginRight: "10px" }}>
          <Option value="All">All</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Approval Pending">Approval Pending</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>
        <Button type="primary" style={{ height: "40px" }} onClick={handleAddNewRocForm}>
          Add New ROC Form
        </Button>
      </div>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <div style={{ 
          // border: "2px solid #ccc", 
          position: "relative", borderRadius: "8px", padding: "0px" }}>
          <Table
            bordered
            size="small"
            dataSource={filteredRocDetails}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 6 }}
          />
          {/* Total Records in bottom-left */}
          <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
            Total Records : {filteredRocDetails.length}
          </div>
        </div>
      )}
    </Box>
  );
};

export default RocFormMain;
