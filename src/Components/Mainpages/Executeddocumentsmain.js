import React, { useState, useEffect } from "react";
import { Table, Spin, message, Button, Input, Select, Tag } from "antd";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const { Option } = Select;

const ExecutedDocumentsMain = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [executedDocuments, setExecutedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExecutedDocuments = async () => {
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
        const response = await axios.get(`${API_URL}/executed/fetchAll`);
        if (response.data.success) {
          const combinedData = [...response.data.mainData, ...(response.data.data || [])];
          setExecutedDocuments(combinedData);
        } else {
          message.error("Failed to fetch executed documents");
        }
      } catch (error) {
        console.error("Error fetching executed documents:", error);
        message.error("Error fetching executed documents");
      } finally {
        setLoading(false);
      }
    };
    fetchExecutedDocuments();
  }, [API_URL]);

  const handleViewDetails = async (sanction_id, lender_code) => {
    try {
      const response = await axios.get(`${API_URL}/executed/document/${sanction_id}`, {
        params: { sanction_id, lender_code }
      });

      // if (response.status === 200) {
      //   window.open(response.request.responseURL, "_blank"); // Open document in new tab
      // } else {
      //   message.error("Document not found");
      // }

      // if (response.ok) {
      // const msg = response.status === 201
      if (response.status === 200) {
        window.open(response.request.responseURL, "_blank");
      }
      else {
        alert("Document not found on the server. Please re-upload the file.");
      }
      //   : "Document not found on the server. Please re-upload the file.";
      // alert(msg);
      // } else {
      //   const errorResponse = await response.json();
      //   alert(errorResponse.message);
      // }

      // if (response.ok) {
      // if (response.status === 200) {
      //   window.open(response.request.responseURL, "_blank");
      // } else {
      //   alert("Document not found on the server. Please re-upload the file.");
      // }
      // } else {
      //   const errorResponse = await response.json();
      //   alert(errorResponse.message || "An error occurred while fetching the document.");
      // }

    } catch (error) {
      // console.error("Error fetching document:", error);
      message.error("Error fetching document");
    }
  };

  const handleAddNewDocument = () => {
    navigate("/addexecuteddocument");
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const handleFilterChange = async (value) => {
    setFilterStatus(value);
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/executed/fetchAll`);
      if (response.data.success) {
        let filteredLenders = [];
        if (value === "") {
          // Combine Approved and others
          filteredLenders = [...response.data.mainData, ...response.data.data];
        }
        else if (value === "Approved") {
          filteredLenders = response.data.mainData;
        } else {
          filteredLenders = response.data.data.filter((lender) => lender.approval_status === value);
        }
        setExecutedDocuments(filteredLenders);
      } else {
        message.error("Failed to filter Executed");
      }
    } catch (error) {
      console.error("Error filtering Executed:", error);
      message.error("Error filtering Executed");
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = executedDocuments.filter((doc) =>
    Object.values(doc).some(
      (field) => field && field.toString().toLowerCase().includes(searchText)
    )).sort((a, b) => new Date(b.updatedat || b.createdat) - new Date(a.updatedat || a.createdat));

  // Apply status filter
  // const displayedDocuments =
  //   filterStatus === "approved"
  //     ? filteredDocuments
  //     : filteredDocuments.filter((doc) => doc.approval_status === filterStatus);
  const displayedDocuments =
    filterStatus === "All"
      ? filteredDocuments
      : filteredDocuments.filter((doc) => doc.approval_status === filterStatus);

  const statusColors = {
    Approved: "green",
    Pending: "orange",
    Rejected: "red",
  };

  const columns = [
    {
      title: "Lender Code", dataIndex: "lender_code", key: "lender_code",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Sanction ID", dataIndex: "sanction_id", key: "sanction_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Document Type", dataIndex: "document_type", key: "document_type",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Uploaded Date", dataIndex: "uploaded_date", key: "uploaded_date",
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
      key: "approval_status",
      render: (status) => <Tag color={statusColors[status] || "blue"}>{status}</Tag>,
    },
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
          {/* <Button type="link" onClick={() => handleEditDocument(record.document_id)}>
            Edit
          </Button> */}
        </>
      ),
    },
  ];

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "70px",
        marginLeft: isDropped ? "100px" : "280px",
        transition: "margin-left 0.3s ease-in-out",
        width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
        padding: 3,
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Executed Documents</h2>
        <Input
          placeholder="Search executed documents..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px", height: "40px" }}
        />
        {/* <Select
          value={filterStatus}
          onChange={handleFilterChange}
          style={{ width: "200px", height: "40px" }}
        >
          <Option value="">All</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Approval Pending">Pending</Option>
          <Option value="Rejected">Rejected</Option>
        </Select> */}
        <Select value={filterStatus} onChange={handleFilterChange} style={{ width: "200px", height: "40px" }}>
          <Option value="All">All</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Approval Pending">Approval Pending</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>
        <Button type="primary" style={{ height: "40px" }} onClick={handleAddNewDocument}>
          Add New Document
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
            dataSource={displayedDocuments}
            columns={columns}
            rowKey="document_id"
            pagination={{ pageSize: 6 }}
          />
          {/* Total Records in bottom-left */}
          <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
            Total Records : {displayedDocuments.length}
          </div>
        </div>
      )
      }
    </Box >
  );
};

export default ExecutedDocumentsMain;
