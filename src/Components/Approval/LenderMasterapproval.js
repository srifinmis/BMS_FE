import React, { useState, useEffect } from "react";
import { Table, Checkbox, message, Spin } from "antd";
import { Typography, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const LenderMasterApproval = ({ isDropped }) => {
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
        const response = await axios.get(`${API_URL}/lender/pendingData`);
        if (response.status === 200) {
          const sortedData = response.data.sort(
            (a, b) => new Date(b.updatedat || b.createdat) - new Date(a.updatedat || a.createdat)
          );
          setLenders(sortedData);
        } else {
          message.error("Failed to fetch lenders");
        }
      } catch (error) {
        console.error("Error fetching lenders:", error);
        message.error("Error fetching lenders");
      } finally {
        setLoading(false);
      }
    };

    fetchLenders();
  }, [API_URL]);

  const handleSelect = (lender) => {
    const exists = selectedRows.some(
      (row) =>
        row.lender_code === lender.lender_code &&
        row.updatedat === lender.updatedat
    );

    if (exists) {
      setSelectedRows((prev) =>
        prev.filter(
          (row) =>
            !(
              row.lender_code === lender.lender_code &&
              row.updatedat === lender.updatedat
            )
        )
      );
    } else {
      setSelectedRows((prev) => [...prev, lender]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all lenders
      setSelectedRows(lenders);
    } else {
      // Deselect all
      setSelectedRows([]);
    }
  };


  const handleApprove = async () => {
    if (selectedRows.length === 0) {
      message.warning("No lenders selected.");
      return;
    }
    // console.log("Approval Request Data: ", selectedRows); // Debugging

    try {
      const remarksString = Array.isArray(remarks) ? remarks.join(", ") : remarks;
      // Send full lender data for insertion & update
      const response = await axios.post(`${API_URL}/lender/Approve`, selectedRows.map((lender) => ({
        ...lender,
        remarks: remarksString,
        approval_status: "Approved"
      })));
      if (response.status === 201) {
        message.success("Lenders approved successfully.");

        localStorage.setItem("submissionMessage", "Lender's Approved successfully!");
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
        setLenders((prev) => prev.filter((lender) => !selectedRows.some((row) => row.lender_code === lender.lender_code)));
        setSelectedRows([]);
      } else {
        message.error("Approval failed.");

        localStorage.setItem("submissionMessage", "Lender's Approval failed!");
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
      console.error("Error approving lenders:", error);
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
      message.warning("No lenders selected.");
      return;
    }
    // console.log("Reject Request Data: ", selectedRows);

    try {
      // Send full lender data for rejection

      const response = await axios.post(`${API_URL}/lender/reject`,
        selectedRows.map((lender) => ({
          lender_code: lender.lender_code,
          remarks: remarks
        }))
      );


      if (response.status === 201) {
        message.success("Lenders rejected successfully.");

        localStorage.setItem("submissionMessage", "Lender's Rejected successfully!");
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
          prev.filter((lender) => !selectedRows.some((row) => row.lender_code === lender.lender_code))
        );
        setSelectedRows([]);
        setRemarks("");
        setRemarksError(false);
      } else {
        message.error("Rejection failed.");
        localStorage.setItem("submissionMessage", "Lender's Approval failed!");
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
  const handleViewDetails = (lender_code, approval_status, lender_name, updatedat) => {
    // console.log("Lender Details:", lender_code, approval_status, lender_name, updatedat);
    navigate(`/lenderapprove/${lender_code}`, {
      state: { lender_code, approval_status, lender_name, updatedat },
    });
  };

  const columns = [
    {
      title: (
        <Checkbox
          onChange={handleSelectAll}
          style={{ transform: "scale(1.6)", width: "20px" }}
          checked={
            selectedRows.length === lenders.length &&
            selectedRows.every((row, index) =>
              row.lender_code === lenders[index]?.lender_code &&
              row.updatedat === lenders[index]?.updatedat
            )
          }
        />
      ),
      dataIndex: "lender_code",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (_, lender) => (
        <Checkbox
          style={{ transform: "scale(1.6)" }}
          checked={selectedRows.some(
            (row) =>
              row.lender_code === lender.lender_code &&
              row.updatedat === lender.updatedat
          )}
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
      title: "Lender Name", dataIndex: "lender_name",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Lender Type", dataIndex: "lender_type",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Status", dataIndex: "status",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    // { title: "Lender Escalation Email", dataIndex: "lender_escalation_email" },
    {
      title: "Details",
      dataIndex: "lender_code",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (code, record) => <Button type="link" onClick={() => handleViewDetails(code, record.approval_status, record.lender_name, record.updatedat)}>View</Button>,
    },
  ];

  return (
    <div style={{
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
        Lender Master Approval
      </Typography>

      {loading ? (
        <Spin size="large" style={{ margin: "20px auto" }} />
      ) : lenders.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: 20 }}>No Pending lenders available</p>
      ) : (
        // <Table style={{}} bordered dataSource={lenders} columns={columns} rowKey="lender_code" pagination={false} />
        <div style={{ height: 460, overflowY: 'auto' }}>
          <Table
            bordered
            dataSource={lenders}
            columns={columns}
            rowKey="lender_code"
            pagination={false}
            scroll={{ y: 400 }} // Fixed height for scrollable body with sticky header
          />

        </div>
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

export default LenderMasterApproval;






//working code 

// import React, { useState, useEffect } from "react";
// import { Table, Checkbox, Button, Input, message, Spin } from "antd";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const LenderMasterApproval = ({ isDropped }) => {
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [remarks, setRemarks] = useState("");
//   const [lenders, setLenders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch Lender Data from Backend
//   useEffect(() => {
//     const fetchLenders = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://localhost:5002/api/lender/pendingdata");
//         console.log("UseEfffect approval :", response)
//         // const data = Array.isArray(response.data) ? response.data : [response.data]; // Force into array if not
//         // console.log("Fetched approval data:", data);
//         if (response.status === 200) {
//           setLenders(response.data);
//           console.log('lender setterd: ',lenders);
//         } else {
//           message.error("Failed to fetch lenders");
//         }
//       } catch (error) {
//         console.error("Error fetching lenders:", error);
//         message.error("Error fetching lenders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLenders();
//   }, []);

//   const handleSelect = (lender_code) => {
//     setSelectedRows((prev) =>
//       prev.includes(lender_code) ? prev.filter((code) => code !== lender_code) : [...prev, lender_code]
//     );
//   };

//   const handleSelectAll = (e) => {
//     setSelectedRows(e.target.checked ? lenders.map((lender) => lender.lender_code) : []);
//   };

//   const handleViewDetails = (lender_code) => {
//     console.log("Navigating to:", `/lenderapprove/${lender_code}`);
//     navigate(`/lenderapprove/${lender_code}`);

//   };

//   const columns = [
//     {
//       title: <Checkbox onChange={handleSelectAll} checked={selectedRows.length === lenders.length} />,
//       dataIndex: "lender_code",
//       render: (lender_code) => (
//         <Checkbox checked={selectedRows.includes(lender_code)} onChange={() => handleSelect(lender_code)} />
//       ),
//     },
//     { title: "Lender Code", dataIndex: "lender_code" },
//     { title: "Lender Name", dataIndex: "lender_name" },
//     { title: "Lender Type", dataIndex: "lender_type" },
//     { title: "Status", dataIndex: "status" },
//     { title: "Lender Email", dataIndex: "lender_email_id_1" },
//     {
//       title: "Details",
//       dataIndex: "lender_code",
//       render: (code) => (
//         <Button type="link" onClick={() => handleViewDetails(code)}>View</Button>
//       ),
//     },
//   ];

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         flexDirection: "column",
//         gap: 2,
//         width: "auto",
//         margin: "auto",
//         marginTop: "70px",
//         marginLeft: isDropped ? "100px" : "280px",
//         transition: "margin-left 0.3s ease-in-out",
//         width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//         padding: 3,
//         border: "1px solid #ccc",
//         borderRadius: 2,
//         boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
//       }}>
//       <h2 style={{
//         display: "flex",
//         justifyContent: "center"
//       }}>Lender Master Approval</h2>

//       {loading ? (
//         <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
//       ) : lenders.length === 0 ? (
//         <p style={{ textAlign: "center", marginTop: 20 }}>No lenders available</p>
//       ) : (
//         <Table dataSource={lenders} columns={columns} rowKey="lender_code" pagination={false} />
//       )}

//       <div style={{ marginTop: 20 }}>
//         <Input.TextArea
//           placeholder="Enter remarks..."
//           value={remarks}
//           onChange={(e) => setRemarks(e.target.value)}
//           rows={3} 
//           disabled={loading}
//         />
//       </div>

//       <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
//         <Button type="primary" disabled={selectedRows.length === 0 || loading}>Approve</Button>
//         <Button type="danger" disabled={selectedRows.length === 0 || !remarks.trim() || loading}>Reject</Button>
//       </div>
//     </div>
//   );
// };

// export default LenderMasterApproval;
