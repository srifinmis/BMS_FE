// import React, { useState, useEffect } from "react";
// import { Table, Spin, message, Button, Input, Select, Tag } from "antd";
// import { Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const { Option } = Select;

// const BankAccountsMain = ({ isDropped }) => {
//   const [bankAccounts, setBankAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchText, setSearchText] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBankAccounts = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://localhost:5002/api/bankrepayment/fetchAll");
//         if (response.data.success) {
//           setBankAccounts(response.data.data);
//         } else {
//           message.error("Failed to fetch bank account details");
//         }
//       } catch (error) {
//         console.error("Error fetching bank account details:", error);
//         message.error("Error fetching bank account details");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBankAccounts();
//   }, []);

//   const handleViewDetails = (sanction_id) => {
//     navigate(`/bankrepaymentmaker/${sanction_id}`);
//   };

//   const getStatusTag = (status) => {
//     switch (status) {
//       case "Approved":
//         return <Tag color="green">Approved</Tag>;
//       case "Approval Pending":
//         return <Tag color="orange">Pending</Tag>;
//       case "Rejected":
//         return <Tag color="red">Rejected</Tag>;
//       default:
//         return <Tag color="default">{status}</Tag>;
//     }
//   };

//   const handleAddNewAccount = () => {
//     navigate("/addbankaccount");
//   };

//   const handleSearch = (e) => {
//     setSearchText(e.target.value.toLowerCase());
//   };

//   const handleFilterChange = (value) => {
//     setFilterStatus(value);
//   };

//   // Filter bank accounts based on search text
//   const filteredBankAccounts = bankAccounts.filter((account) =>
//     Object.values(account).some(
//       (field) => field && field.toString().toLowerCase().includes(searchText)
//     )
//   );

//   // Apply status filter
//   const displayedBankAccounts =
//     filterStatus === "All"
//       ? filteredBankAccounts
//       : filteredBankAccounts.filter((account) => account.approval_status === filterStatus);

//   const columns = [
//     { title: "Sanction ID", dataIndex: "sanction_id", key: "sanction_id" },
//     { title: "Current A/C No", dataIndex: "current_ac_no", key: "current_ac_no" },
//     { title: "Name of the Bank", dataIndex: "bank_name", key: "bank_name" },
//     { title: "Bank Branch", dataIndex: "bank_branch", key: "bank_branch" },
//     { title: "Location", dataIndex: "location", key: "location" },
//     { title: "IFSC Code", dataIndex: "ifsc_code", key: "ifsc_code" },
//     {
//       title: "Approval Status",
//       dataIndex: "approval_status",
//       key: "approval_status",
//       render: (status) => getStatusTag(status),
//     },
//     {
//       title: "Details",
//       dataIndex: "sanction_id",
//       key: "details",
//       render: (id) => (
//         <Button type="link" onClick={() => handleViewDetails(id)}>
//           View
//         </Button>
//       ),
//     },
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
//       }}
//     >
//       <ToastContainer position="top-right" autoClose={5000} />
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h2>Bank Accounts</h2>
//         <Input
//           placeholder="Search bank accounts..."
//           value={searchText}
//           onChange={handleSearch}
//           style={{ width: "300px", height: "40px" }}
//         />
//         <Select
//           value={filterStatus}
//           onChange={handleFilterChange}
//           style={{ width: "200px", height: "40px" }}
//         >
//           <Option value="All">All</Option>
//           <Option value="Approved">Approved</Option>
//           <Option value="Approval Pending">Pending</Option>
//           <Option value="Rejected">Rejected</Option>
//         </Select>
//         <Button type="primary" style={{ height: "40px" }} onClick={handleAddNewAccount}>
//           Add New Account
//         </Button>
//       </div>

//       {loading ? (
//         <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
//       ) : (
//         <Table
//           dataSource={displayedBankAccounts}
//           columns={columns}
//           rowKey="sanction_id"
//           pagination={{ pageSize: 5 }}
//         />
//       )}
//     </Box>
//   );
// };

// export default BankAccountsMain;
import React, { useState, useEffect } from "react";
import { Table, Spin, message, Button, Input, Select, Tag } from "antd";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const { Option } = Select;

const BankAccountsMain = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("Approved"); // Default to "Approved"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankAccounts = async () => {
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
        const response = await axios.get(`${API_URL}/bankrepayment/fetchAll`);
        // console.log("got data: ", response);
        if (response.data.success) {
          const approvedAccounts = response.data.mainData;
          setBankAccounts(approvedAccounts); // Show only approved bank accounts initially
        } else {
          message.error("Failed to fetch bank account details");
        }
      } catch (error) {
        console.error("Error fetching bank account details:", error);
        message.error("Error fetching bank account details");
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, [API_URL]);

  const handleViewDetails = (sanction_id, approval_status) => {
    navigate(`/bankrepaymentmaker/${sanction_id}`, {
      state: { sanction_id, approval_status },
    });
  };

  const handleAddNewAccount = () => {
    navigate("/addbankaccount");
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const handleStatusFilterChange = async (value) => {
    setApprovalFilter(value);
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/bankrepayment/fetchAll`);
      if (response.data.success) {
        let filteredAccounts = [];

        if (value === "Approved") {
          filteredAccounts = response.data.mainData;
        } else if (value) {
          filteredAccounts = response.data.data.filter(
            (sanction) => sanction.approval_status === value
          );
        } else {
          filteredAccounts = [...response.data.mainData, ...response.data.data];
        }

        setBankAccounts(filteredAccounts);
      } else {
        message.error("Failed to filter bank accounts");
      }
    } catch (error) {
      console.error("Error filtering bank accounts:", error);
      message.error("Error filtering bank accounts");
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

  const filteredBankAccounts = bankAccounts.filter((account) => {
    const matchesSearch = Object.values(account).some(
      (field) => field && field.toString().toLowerCase().includes(searchText)
    );
    const matchesStatus = approvalFilter === "All" || account.approval_status === approvalFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { title: "Sanction ID", dataIndex: "sanction_id" },
    { title: "Current A/C No", dataIndex: "current_ac_no" },
    { title: "Name of the Bank", dataIndex: "bank_name" },
    { title: "Bank Branch", dataIndex: "bank_branch" },
    { title: "Location", dataIndex: "location" },
    { title: "IFSC Code", dataIndex: "ifsc_code" },
    {
      title: "Approval Status",
      dataIndex: "approval_status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Details",
      dataIndex: "sanction_id",
      render: (id, record) => (
        <Button type="link" onClick={() => handleViewDetails(id, record.approval_status)}>
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
        marginLeft: isDropped ? "100px" : "280px",
        transition: "margin-left 0.3s ease-in-out",
        width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
        padding: 3,
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Bank Accounts</h2>

        {/* Search Input */}
        <Input
          placeholder="Search bank accounts..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "250px", height: "40px", marginRight: "10px" }}
        />

        {/* Approval Status Filter Dropdown */}
        <Select
          value={approvalFilter}
          onChange={handleStatusFilterChange}
          style={{ width: "200px", height: "40px", marginRight: "10px" }}
          defaultValue="Approved"
        >
          <Option value="Approved">Approved</Option>
          <Option value="Approval Pending">Approval Pending</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>

        <Button type="primary" style={{ height: "40px" }} onClick={handleAddNewAccount}>
          Add New Account
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Table
          dataSource={filteredBankAccounts}
          columns={columns}
          rowKey="sanction_id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </Box>
  );
};

export default BankAccountsMain;
