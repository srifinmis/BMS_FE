import React, { useState, useEffect } from "react";
import { Table, Spin, message, Button, Input } from "antd";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AlertsPage = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Fetch Alerts Data from Backend
  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/alert/findall`);
        if (response.data.success) {
          setAlerts(response.data.data);
        } else {
          message.error("Failed to fetch alerts");
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
        message.error("Error fetching alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [API_URL]);

  // const handleViewDetails = (alert_id, lender_code, sanction_id, tranche_id) => {
  //   navigate(`/alertmaker/${alert_id}`, {
  //     state: { lender_code, approval_status, lender_name, updatedat },
  //   });
  // };

  const handleViewDetails = (alert_id) => {
    navigate(`/alertmaker/${alert_id}`, {
      // state: { lender_code},
    });
  };

  const handleAddNewAlert = () => {
    navigate("/AddAlert");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  // Filter alerts based on search input
  const filteredAlerts = alerts.filter((alert) =>
    Object.values(alert).some(
      (field) => field && field.toString().toLowerCase().includes(searchText)
    )
  );

  const columns = [
    {
      title: "Lender Code", dataIndex: "lender_code",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    {
      title: "Sanction ID", dataIndex: "sanction_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    {
      title: "Tranche ID", dataIndex: "tranche_id",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    {
      title: "Alert Frequency", dataIndex: "alert_frequency",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    // { title: "Message", dataIndex: "message" },
    {
      title: "Alert Time", dataIndex: "alert_time",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    {
      title: "Alert Start Date", dataIndex: "alert_start_date",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    {
      title: "Alert End Date", dataIndex: "alert_end_date",
      onHeaderCell: () => ({
        style: { backgroundColor: "#a2b0cc", color: "black" },
      }),
    },
    // {
    //   title: "Details",
    //   dataIndex: "alert_id",
    //   onHeaderCell: () => ({
    //     style: { backgroundColor: "#a2b0cc", color: "black" },
    //   }),
    //   render: (id, record) => (
    //     <Button type="link" onClick={() => handleViewDetails(id, record.lender_code, record.sanction_id, record.tranche_id)}>View</Button>
    //   ),
    // },
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
      }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Alerts Management</h2>
        <Input
          placeholder="Search alerts..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: "300px", height: "40px" }}
        />
        <Button type="primary" style={{ height: "40px" }} onClick={handleAddNewAlert}>Add New Alert</Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Paper elevation={3} >
          {/* <Typography variant="h6" gutterBottom>Alerts</Typography> */}
          {filteredAlerts.length === 0 ? (
            <p style={{ textAlign: "center" }}>No alerts available</p>
          ) : (
            <Table
              dataSource={filteredAlerts}
              columns={columns}
              rowKey="alert_id"
              pagination={{ pageSize: 5 }}
            />
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AlertsPage;
