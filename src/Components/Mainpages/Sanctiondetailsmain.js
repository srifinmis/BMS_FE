import React, { useState, useEffect } from "react";
import { Table, Spin, message, Button, Input, Select, Tag } from "antd";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const { Option } = Select;

const SanctionDetailsMain = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [sanctions, setSanctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("All"); // Default to "Approved"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSanctions = async () => {
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

        const response = await axios.get(`${API_URL}/sanction/fetchAll`, {
          params: {
            token: localStorage.getItem("token")
          }
        })
        // console.log("got data: ", response);
        if (response.data.success) {
          const combinedLenders = [
            ...response.data.mainData,
            ...response.data.data,
          ];
          setSanctions(combinedLenders);
        } else {
          message.error("Failed to fetch sanction details");
        }
      } catch (error) {
        console.error("Error fetching sanction details:", error);
        message.error("Error fetching sanction details");
      } finally {
        setLoading(false);
      }
    };

    fetchSanctions();
  }, [API_URL]);

  const handleViewDetails = (sanction_id, lender_code, approval_status, updatedat) => {
    navigate(`/sanctionmaker/${sanction_id}`, {
      state: { sanction_id, lender_code, approval_status, updatedat },
    });
  };

  const handleAddNewSanction = () => {
    navigate("/SanctionDetails");
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const handleStatusFilterChange = async (value) => {
    setApprovalFilter(value);
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/sanction/fetchAll`, {
        params: {
          token: localStorage.getItem("token")
        }
      })
      if (response.data.success) {
        let filteredSanctions = [];

        if (value === "All") {
          // Combine Approved and others
          filteredSanctions = [...response.data.mainData, ...response.data.data];
        }
        else if (value === "Approved") {
          filteredSanctions = response.data.mainData;
        } else {
          filteredSanctions = response.data.data.filter((lender) => lender.approval_status === value);
        }

        setSanctions(filteredSanctions);
      } else {
        message.error("Failed to filter sanctions");
      }
    } catch (error) {
      console.error("Error filtering sanctions:", error);
      message.error("Error filtering sanctions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "Approved":
        return <Tag color="green">Approved</Tag>;
      case "Approval Pending":
        return <Tag color="orange">Approval Pending</Tag>;
      case "Rejected":
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const filteredSanctions = sanctions.filter((sanction) => {
    const matchesSearch = Object.values(sanction).some(
      (field) => field && field.toString().toLowerCase().includes(searchText)
    );
    const matchesStatus = approvalFilter === "All" || sanction.approval_status === approvalFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.updatedat || b.createdat) - new Date(a.updatedat || a.createdat));

  const columns = [
    {
      title: "Lender Code", dataIndex: "lender_code",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Lender Name", key: "lender_name",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (record) => {
        const lenderName = record.lender_code_lender_master?.lender_name ||  record?.lender_name;
        console.log("fetch : ",record.lender_code_lender_master?.lender_name ," : ", record?.lender_name)
        return `${lenderName}`;
      }

    },
    {
      title: "Sanction ID", dataIndex: "sanction_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    // {
    //   title: "Sanction Amount", dataIndex: "sanction_amount",
    //   onHeaderCell: () => ({
    //     style: { backgroundColor: "#a2b0cc", color: "black" }
    //   }),
    // },
    {
      title: "Sanction Date", dataIndex: "sanction_date",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Approval Status",
      dataIndex: "approval_status",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (status) => getStatusTag(status),
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
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Sanction Details</h2>

        {/* Search Input */}
        <Input
          placeholder="Search sanctions..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "250px", height: "40px", marginRight: "10px" }}
        />

        {/* Approval Status Filter Dropdown (default: Approved) */}
        <Select
          value={approvalFilter}
          onChange={handleStatusFilterChange}
          style={{ width: "200px", height: "40px", marginRight: "10px" }}
        >
          <Option value="All">All</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Approval Pending">Approval Pending</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>

        <Button type="primary" style={{ height: "40px" }} onClick={handleAddNewSanction}>
          Add New Sanction
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <div style={{
          // border: "2px solid #ccc", 
          position: "relative", borderRadius: "8px", padding: "0px"
        }}>
          <Table
            bordered
            size="small"
            dataSource={filteredSanctions}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 7 }}
          />
          {/* Total Records in bottom-left */}
          <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
            Total Records : {filteredSanctions.length}
          </div>
        </div>
      )}
    </Box>
  );
};

export default SanctionDetailsMain;
