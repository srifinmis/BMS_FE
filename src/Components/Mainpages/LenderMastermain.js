// import React, { useState, useEffect } from "react";
// import { Table, Spin, message, Button, Input, Select, Tag } from "antd";
// import { Box, TablePagination } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const { Option } = Select;

// const LenderMastermain = ({ isDropped }) => {
//   const API_URL = process.env.REACT_APP_API_URL;

//   const [lenders, setLenders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchText, setSearchText] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchLenders = async () => {
//       setLoading(true);
//       const submissionMessage = localStorage.getItem("submissionMessage");
//       const messageType = localStorage.getItem("messageType");

//       if (submissionMessage) {
//         messageType === "success" ? toast.success(submissionMessage) : toast.error(submissionMessage);
//         setTimeout(() => {
//           localStorage.removeItem("submissionMessage");
//           localStorage.removeItem("messageType");
//         }, 5000);
//       }

//       try {
//         const response = await axios.get(`${API_URL}/lender/list`);
//         console.log("res: ", response)

//         if (response.data.success) {
//           const combinedLenders = [
//             ...response.data.mainData,
//             ...response.data.data,
//           ];
//           setLenders(combinedLenders);
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
//   }, [API_URL]);

//   const handleViewDetails = (lender_code, approval_status, lender_name, updatedat) => {
//     navigate(`/lendermaker/${lender_code}`,
//       {
//         state: { lender_code, approval_status, lender_name, updatedat }
//       });
//   };

//   const handleAddNewLender = () => {
//     navigate("/LenderMaster");
//   };

//   const handleSearch = (e) => {
//     setSearchText(e.target.value.toLowerCase());
//     setCurrentPage(1); // Reset to first page when searching
//   };

//   const handleFilterChange = async (value) => {
//     setFilterStatus(value);
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/lender/list`);
//       if (response.data.success) {
//         let filteredLenders = [];

//         if (value === "") {
//           // Combine Approved and others
//           filteredLenders = [...response.data.mainData, ...response.data.data];
//         }
//         else if (value === "Approved") {
//           filteredLenders = response.data.mainData;
//         } else {
//           filteredLenders = response.data.data.filter((lender) => lender.approval_status === value);
//         }

//         setLenders(filteredLenders);
//       } else {
//         message.error("Failed to filter lenders");
//       }
//     } catch (error) {
//       console.error("Error filtering lenders:", error);
//       message.error("Error filtering lenders");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleTableChange = (pagination) => {
//     setCurrentPage(pagination.current);
//   };

//   const statusColors = {
//     Approved: "green",
//     Rejected: "red",
//     "Approval Pending": "orange",
//   };

//   const filteredLenders = lenders
//     .filter((lender) =>
//       Object.values(lender).some(
//         (field) => field && field.toString().toLowerCase().includes(searchText)
//       )
//     )
//     .sort((a, b) => new Date(b.updatedat || b.createdat) - new Date(a.updatedat || a.createdat));

//   const columns = [
//     {
//       title: "Lender Code", dataIndex: "lender_code",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" }
//       }),
//     },
//     {
//       title: "Lender Name", dataIndex: "lender_name",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" }
//       }),
//     },
//     {
//       title: "Lender Type", dataIndex: "lender_type",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" }
//       }),
//     },
//     // {
//     //   title: "Lender Email", dataIndex: "lender_escalation_email",
//     //   onHeaderCell: () => ({
//     //     style: { backgroundColor: "#a2b0cc", color: "black" }
//     //   }),
//     // },
//     {
//       title: "Approval Status",
//       dataIndex: "approval_status",
//       render: (status) => <Tag color={statusColors[status] || "blue"}>{status}</Tag>,
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" }
//       }),
//     },
//     {
//       title: "Details",
//       dataIndex: "lender_code",
//       onHeaderCell: () => ({
//         style: { backgroundColor: "#a2b0cc", color: "black" }
//       }),
//       render: (code, record) => (
//         <Button type="link" onClick={() => handleViewDetails(code, record.approval_status, record.lender_name, record.updatedat)}>
//           View
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Box
//       style={{
//         display: "flex",
//         height: "auto",
//         position: "fixed",
//         flexDirection: "column",
//         marginTop: "70px",
//         marginLeft: isDropped ? "100px" : "280px",
//         transition: "margin-left 0.3s ease-in-out",
//         width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//         padding: 3,
//       }}>
//       <ToastContainer position="top-right" autoClose={5000} />

//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h2>Lender Master Creation</h2>
//         <Input
//           placeholder="Search lenders..."
//           value={searchText}
//           onChange={handleSearch}
//           style={{ width: "300px", height: "40px" }}
//         />
//         <Select
//           value={filterStatus}
//           onChange={handleFilterChange}
//           style={{ width: "200px", height: "40px" }}
//           placeholder="Filter by status">
//           <Option value="">All</Option>
//           <Option value="Approved">Approved</Option>
//           <Option value="Rejected">Rejected</Option>
//           <Option value="Approval Pending">Approval Pending</Option>
//         </Select>
//         <Button type="primary" style={{ height: "40px" }} onClick={handleAddNewLender}>
//           Add New Lender
//         </Button>
//       </div>

//       {loading ? (
//         <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
//       ) : (
//         <div
//           style={{
//             position: "relative",
//             borderRadius: "8px",
//             padding: "0px",
//           }}
//         >
//           {/* <div style={{ height: '450px', overflowY: 'auto' }}> */}
//           {/* <Table
//             bordered
//             style={{ margin: 0, padding: 0 }}
//             size="small"
//             dataSource={filteredLenders}

//             columns={columns}
//             rowKey="id"
//             pagination={{
//               current: currentPage,
//               pageSize: 7,
//               total: filteredLenders.length,
//               onChange: handleTableChange,
//               showSizeChanger: false,
//               position: ["bottomRight"], // Keeps pagination at bottom-right
//             }}
//             scroll={{ y: 400 }}
//           /> */}
//           <TablePagination
//             // bordered
//             // style={{ margin: 0, padding: 0 }}
//             // size="small"
//             component="div"
//             count={filteredLenders.length}
//             page={page}
//             dataSource={filteredLenders}
//             columns={columns}
//             scroll={{ y: 400 }}
//           />
//           {/* Total Records in bottom-left */}
//           <div style={{ position: "absolute", bottom: "30px", left: "10px" }}>
//             Total Records : {filteredLenders.length}
//           </div>
//           {/* </div> */}
//         </div>

//       )}
//     </Box>
//   );
// };

// export default LenderMastermain;










import React, { useState, useEffect } from "react";
import { Table, Spin, message, Button, Input, Select, Tag } from "antd";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const { Option } = Select;

const LenderMastermain = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLenders = async () => {
      setLoading(true);
      const submissionMessage = localStorage.getItem("submissionMessage");
      const messageType = localStorage.getItem("messageType");

      if (submissionMessage) {
        messageType === "success"
          ? toast.success(submissionMessage)
          : toast.error(submissionMessage);
        setTimeout(() => {
          localStorage.removeItem("submissionMessage");
          localStorage.removeItem("messageType");
        }, 5000);
      }

      try {
        const response = await axios.get(`${API_URL}/lender/list`);
        if (response.data.success) {
          const combinedLenders = [
            ...response.data.mainData,
            ...response.data.data,
          ];
          setLenders(combinedLenders);
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

  const handleViewDetails = (lender_code, approval_status, lender_name, updatedat) => {
    navigate(`/lendermaker/${lender_code}`, {
      state: { lender_code, approval_status, lender_name, updatedat },
    });
  };

  const handleAddNewLender = () => {
    navigate("/LenderMaster");
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleFilterChange = async (value) => {
    setFilterStatus(value);
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/lender/list`);
      if (response.data.success) {
        let filteredLenders = [];

        if (value === "") {
          filteredLenders = [...response.data.mainData, ...response.data.data];
        } else if (value === "Approved") {
          filteredLenders = response.data.mainData;
        } else {
          filteredLenders = response.data.data.filter(
            (lender) => lender.approval_status === value
          );
        }

        setLenders(filteredLenders);
      } else {
        message.error("Failed to filter lenders");
      }
    } catch (error) {
      console.error("Error filtering lenders:", error);
      message.error("Error filtering lenders");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const statusColors = {
    Approved: "green",
    Rejected: "red",
    "Approval Pending": "orange",
  };

  const filteredLenders = lenders
    .filter((lender) =>
      Object.values(lender).some(
        (field) =>
          field && field.toString().toLowerCase().includes(searchText)
      )
    )
    .sort(
      (a, b) =>
        new Date(b.updatedat || b.createdat) -
        new Date(a.updatedat || a.createdat)
    );

  const columns = [
    {
      title: "Lender Code",
      dataIndex: "lender_code",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    {
      title: "Lender Name",
      dataIndex: "lender_name",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    {
      title: "Lender Type",
      dataIndex: "lender_type",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    {
      title: "Approval Status",
      dataIndex: "approval_status",
      render: (status) => (
        <Tag color={statusColors[status] || "blue"}>{status}</Tag>
      ),
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    {
      title: "Details",
      dataIndex: "lender_code",
      render: (code, record) => (
        <Button
          type="link"
          onClick={() =>
            handleViewDetails(
              code,
              record.approval_status,
              record.lender_name,
              record.updatedat
            )
          }
        >
          View
        </Button>
      ),
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
  ];

  return (
    <Box
      style={{
        position: "fixed",
        marginTop: "70px", // navbar
        marginLeft: isDropped ? "100px" : "280px",
        transition: "margin-left 0.3s ease-in-out",
        width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
        height: "calc(100vh - 70px)", // full remaining height
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Fixed Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          backgroundColor: "#f9f9f9",
          zIndex: 1000,
          // borderBottom: "1px solid #ddd",
        }}
      >
        <h2 style={{ margin: 0 }}>Lender Master Creation</h2>
        <Input
          placeholder="Search lenders..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "230px", height: "40px" }}
        />
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          style={{ width: "180px", height: "40px" }}
          placeholder="Filter by status"
        >
          <Option value="">All</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Rejected">Rejected</Option>
          <Option value="Approval Pending">Approval Pending</Option>
        </Select>
        <Button type="primary" style={{ height: "40px" }} onClick={handleAddNewLender}>
          Add New Lender
        </Button>
      </div>

      {/* Scrollable Content */}
      <div
        style={{

          marginTop: "70px",
          // flexGrow: 1,
          overflowY: "hidden",
          // padding: "16px",
          // backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "-40px", marginTop: "20px", fontSize: "18px", color: "#555" }}>
          Total Records: {filteredLenders.length}
        </div>
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "0px auto" }} />
        ) : (
          <>
            <Table
              bordered
              size="small"
              dataSource={filteredLenders}
              columns={columns}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize,
                pageSizeOptions: ["5", "10", "15", "20", "30"],
                showSizeChanger: true,
                total: filteredLenders.length,
                onChange: handleTableChange,
                position: ["topRight"],
              }}
              scroll={{ y: 350 }}
            />
          </>
        )}
      </div>
    </Box>
  );
};

export default LenderMastermain;
