// import React, { useState, useEffect } from "react";
// import { Table, Spin, message, Button, Input } from "antd";
// import { EditOutlined } from '@ant-design/icons';
// import { Box, Typography, Paper } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const AlertsPage = ({ isDropped }) => {
//   const API_URL = process.env.REACT_APP_API_URL;

//   const [alerts, setAlerts] = useState([]);
//   const [lenders, setLenders] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [searchText, setSearchText] = useState("");
//   const navigate = useNavigate();

//   // Fetch Alerts Data from Backend
//   useEffect(() => {
//     const fetchAlerts = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_URL}/alert/findall`);
//         if (response.data.success) {
//           setAlerts(response.data.data);
//         } else {
//           message.error("Failed to fetch alerts");
//         }
//       } catch (error) {
//         console.error("Error fetching alerts:", error);
//         message.error("Error fetching alerts");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAlerts();
//   }, [API_URL]);

//   // const handleViewDetails = (alert_id, lender_code, sanction_id, tranche_id) => {
//   //   navigate(`/alertmaker/${alert_id}`, {
//   //     state: { lender_code, approval_status, lender_name, updatedat },
//   //   });
//   // };

//   const handleViewDetails = (alert_id) => {
//     navigate(`/alertmaker/${alert_id}`, {
//       // state: { lender_code},
//     });
//   };

//   const groupedLenders = lenders.reduce((groups, lender) => {
//     const key = `${lender.sanction_id}-${lender.tranche_id}`;
//     if (!groups[key]) {
//       groups[key] = [];
//     }
//     groups[key].push(lender);
//     return groups;
//   }, {});

//   const handleView = (key) => {
//     setSelectedGroup(groupedLenders[key]);
//     setModalVisible(true);
//   };

//   const handleAddNewAlert = () => {
//     navigate("/AddAlert");
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchText(value);
//   };

//   // Filter alerts based on search input
//   const filteredAlerts = alerts.filter((alert) =>
//     Object.values(alert).some(
//       (field) => field && field.toString().toLowerCase().includes(searchText)
//     )
//   );

//   const columns = [
//     {
//       title: "Lender Code", dataIndex: "lender_code",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" },
//       }),
//     },
//     {
//       title: "Sanction ID", dataIndex: "sanction_id",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" },
//       }),
//     },
//     {
//       title: "Tranche ID", dataIndex: "tranche_id",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" },
//       }),
//     },
//     {
//       title: "Alert Frequency", dataIndex: "alert_frequency",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" },
//       }),
//     },
//     {
//       title: "Alert Trigger Freqency", dataIndex: "alert_trigger",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" },
//       }),
//     },
//     // { title: "Message", dataIndex: "message" },
//     // {
//     //   title: "Alert Time", dataIndex: "alert_time",
//     //   onHeaderCell: () => ({
//     //     style: { backgroundColor: "#a2b0cc", color: "black" },
//     //   }),
//     // },
//     // {
//     //   title: "Alert Start Date", dataIndex: "alert_start_date",
//     //   onHeaderCell: () => ({
//     //     style: { backgroundColor: "#a2b0cc", color: "black" },
//     //   }),
//     // },
//     // {
//     //   title: "Alert End Date", dataIndex: "alert_end_date",
//     //   onHeaderCell: () => ({
//     //     style: { backgroundColor: "#a2b0cc", color: "black" },
//     //   }),
//     // },
//     {
//       title: "Edit",
//       dataIndex: "alert_id",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" },
//       }),
//       render: (id, record) => (
//         <Button
//           type="link"
//           icon={<EditOutlined />}
//           onClick={() => handleViewDetails(id, record.lender_code, record.sanction_id, record.tranche_id)}
//         />
//       ),
//     },
//     {
//       title: "Details",
//       key: "action",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" }
//       }),
//       render: (_, record) => (
//         <Button type="primary" onClick={() => handleView(`${record.sanction_id}-${record.tranche_id}`)}>
//           View
//         </Button>
//       ),
//     }
//   ];

//   return (
//     <Box
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         marginTop: "70px",
//         marginLeft: isDropped ? "100px" : "280px",
//         transition: "margin-left 0.3s ease-in-out",
//         width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//         padding: 3,
//       }}>

//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h2>Alerts Management</h2>
//         <Input
//           placeholder="Search alerts..."
//           value={searchText}
//           onChange={handleSearch}
//           style={{ width: "300px", height: "40px" }}
//         />
//         <Button type="primary" style={{ height: "40px" }} onClick={handleAddNewAlert}>Add New Alert</Button>
//       </div>

//       {loading ? (
//         <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
//       ) : (
//         <Paper elevation={3} >
//           {/* <Typography variant="h6" gutterBottom>Alerts</Typography> */}
//           {filteredAlerts.length === 0 ? (
//             <p style={{ textAlign: "center" }}>No alerts available</p>
//           ) : (
//             <Table
//               dataSource={filteredAlerts}
//               columns={columns}
//               rowKey="alert_id"
//               pagination={{ pageSize: 5 }}
//             />
//           )}
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default AlertsPage;




import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Spin, message, Checkbox, Input } from "antd";
import axios from "axios";
import { Box, Typography, Paper } from "@mui/material";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EditOutlined } from '@ant-design/icons';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlertApprovalAll = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);
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
        const response = await axios.get(`${API_URL}/alert/fetchAll`);
        console.log("get Alert Details fetchall: ", response)
        if (response.status === 201) {
          const sortedData = response.data.data.sort(
            (a, b) => new Date(b.createdat) - new Date(a.createdat)
          );
          setLenders(sortedData);
          // setLenders(response.data.data);
        } else {
          message.error("Failed to fetch Alert Details");
        }
      } catch (error) {
        message.error("Error fetching Alert Details");
      } finally {
        setLoading(false);
      }
    };
    fetchLenders();
  }, [API_URL]);

  const groupedLenders = lenders.reduce((groups, lender) => {
    const key = `${lender.sanction_id}-${lender.tranche_id}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(lender);
    return groups;
  }, {});

  const handleView = (key) => {
    setSelectedGroup(groupedLenders[key]);
    setModalVisible(true);
  };

  const handleSelectAllChange = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedRows(Object.keys(groupedLenders).map((key) => key));
    } else {
      setSelectedRows([]);
    }
  };

  const handleViewDetails = (sanction_id, lender_code, tranche_id, approval_status, createdat) => {
    console.log("alertmaker navigate: ", sanction_id, lender_code, tranche_id, approval_status, createdat);
    navigate(`/alertmaker/${sanction_id}`, {
      state: { sanction_id, lender_code, tranche_id, approval_status, createdat },
    });
    // console.log("alertmaker navigate: ", sanction_id, lender_code, tranche_id, approval_status, createdat);
  };

  const handleAddNewAlert = () => {
    navigate("/AddAlert");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const handleSelectRow = (e, key) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, key]);
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== key));
    }
  };

  const columns = [
    {
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      title: (
        <Checkbox
          style={{ transform: "scale(1.6)" }}
          indeterminate={selectedRows.length > 0 && selectedRows.length < Object.keys(groupedLenders).length}
          checked={selectAll}
          onChange={handleSelectAllChange}
        />
      ),
      key: "selectAll",
      render: (_, record) => (
        <Checkbox
          style={{ transform: "scale(1.6)" }}
          checked={selectedRows.includes(record.key)}
          onChange={(e) => handleSelectRow(e, record.key)}
        />
      ),
    },
    {
      title: "Lender Code",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      dataIndex: "lender_code",
      key: "lender_code",
      render: (_, record) => groupedLenders[record.key]?.[0]?.lender_code || "N/A"
    },
    {
      title: "Sanction ID", dataIndex: "sanction_id", key: "sanction_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    {
      title: "Tranche ID", dataIndex: "tranche_id", key: "tranche_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
    },
    // {
    //   title: "Details",
    //   dataIndex: "sanction_id",
    //   onHeaderCell: () => ({
    //     style: { backgroundColor: "#a2b0cc", color: "black" }
    //   }),
    //   render: (id, record) => (
    //     <Button
    //       type="link"
    //       onClick={() =>
    //         handleViewDetails(
    //           id,
    //           record.lender_code,
    //           record.tranche_id,
    //           record.approval_status,
    //           record.createdat
    //         )
    //       }
    //     >
    //       Edit
    //     </Button>
    //   ),
    // },
    {
      title: "Edit",
      dataIndex: "sanction_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
      render: (id, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleViewDetails(id, record.lender_code, record.tranche_id, record.approval_status, record.createdat)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" }
      }),
      render: (_, record) => (
        <Button type="primary" onClick={() => handleView(`${record.sanction_id}-${record.tranche_id}`)}>
          View
        </Button>
      ),
    },
  ];

  const detailColumns = [
    // { title: "Lender Code", dataIndex: "lender_code", key: "lender_code" },
    // { title: "Sanction ID", dataIndex: "sanction_id", key: "sanction_id" },
    // { title: "Tranche ID", dataIndex: "tranche_id", key: "tranche_id" },
    { title: "Alert Start Date", dataIndex: "alert_start_date", key: "alert_start_date" },
    { title: "Alert End Date", dataIndex: "alert_end_date", key: "alert_end_date" },
    { title: "Alert Time", dataIndex: "alert_time", key: "alert_time" },
    { title: "Alert Frequency", dataIndex: "alert_frequency", key: "alert_frequency" },
    { title: "Alert Trigger", dataIndex: "alert_trigger", key: "alert_trigger" },
    { title: "Mail To", dataIndex: "to_addr", key: "to_addr" },
    { title: "Mail CC", dataIndex: "cc_addr", key: "cc_addr" },
  ];

  return (
    // <div
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     flexDirection: "column",
    //     gap: 2,
    //     margin: "auto",
    //     marginTop: "70px",
    //     marginLeft: isDropped ? "100px" : "280px",
    //     transition: "margin-left 0.3s ease-in-out",
    //     width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
    //     padding: 3,
    //     border: "3px solid #ccc",
    //     borderRadius: 10,
    //     // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
    //   }}
    // >
    //   <ToastContainer position="top-right" autoClose={5000} />
    //   <h2 style={{ textAlign: "center", borderBottom: "2px solid #0056b3", paddingBottom: 10 }}>
    //     ALERT DETAILS EDIT
    //   </h2>
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "70px",
        marginLeft: isDropped ? "100px" : "280px",
        transition: "margin-left 0.3s ease-in-out",
        width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
        padding: 3,
      }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Alerts Management vvvvvvvvvvvvv</h2>
        <Input
          placeholder="Search alerts..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px", height: "40px" }}
        />
        <Button type="primary" style={{ height: "40px" }} onClick={handleAddNewAlert}>Add New Alert</Button>
      </div>
      {
        loading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : Object.keys(groupedLenders).length === 0 ? (
          <p style={{ textAlign: "center" }}>No Pending Alert's Available</p>
        ) : (
          <Table bordered
            dataSource={Object.keys(groupedLenders).map((key) => {
              const [sanction_id, tranche_id] = key.split("-");
              return { key, sanction_id, tranche_id };
            })}
            columns={columns}
            pagination={false}
            rowKey="key"
          />
        )
      }

      <Modal
        // title="Alert Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}

        style={{
          width: "1000",
          position: "relative",
          right: "-100px",
          zIndex: 1001,
          transform: "translateY(0%)",
        }}
        bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
        centered
      >
        {selectedGroup && (
          <Table
            dataSource={selectedGroup}
            columns={detailColumns}
            rowKey={(record) => record.repayment_id}
            pagination={false}
          />
        )}
      </Modal>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 5, width: "100%" }}>
        <Button
          type="primary"
          style={{ marginBottom: "20px", marginRight: "20px", fontSize: "18px", height: "40px" }}
          // onClick={handleApprove}
          disabled={selectedRows.length === 0 || loading}
        >
          Approve
        </Button>
        <Button
          type="primary" danger
          style={{ marginBottom: "20px", marginRight: "20px", fontSize: "18px", height: "40px", borderColor: "white" }}
          // onClick={handleReject}
          disabled={selectedRows.length === 0 || loading || !remarks.trim()}
        >
          Reject
        </Button>

      </div>
      {/* </div > */}
    </Box>
  );
};

export default AlertApprovalAll;