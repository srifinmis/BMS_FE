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
        const response = await axios.get(`${API_URL}/alerts/list`);
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

  const handleViewDetails = (alert_id) => {
    navigate(`/alertdetails/${alert_id}`);
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
    { title: "Alert ID", dataIndex: "alert_id" },
    { title: "Alert Type", dataIndex: "alert_type" },
    { title: "Message", dataIndex: "message" },
    { title: "Timestamp", dataIndex: "timestamp" },
    {
      title: "Details",
      dataIndex: "alert_id",
      render: (id) => (
        <Button type="link" onClick={() => handleViewDetails(id)}>View</Button>
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
        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>Alerts</Typography>
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
