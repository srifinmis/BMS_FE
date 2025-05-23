import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { message } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Grid, Card, CardContent, Typography, Modal, CircularProgress, IconButton } from "@mui/material";
import "./Dashboard.css";

const Dashboard = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalData, setApprovalData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsset] = useState(null);
  const isTotalAssetsPage = location.pathname.includes("/total-assets");

  useEffect(() => {
    const fetchLenderDetails = async () => {
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
        const response = await axios.get(`${API_URL}/Load/AllData`);
        if (response.status === 200) {
          setApprovalData(response.data);
        } else {
          message.error("Failed to fetch lender details");
        }
      } catch (error) {
        console.error("Error fetching asset data:", error);
        setError("Failed to load assets");
      } finally {
        setLoading(false);
      }
    };
    fetchLenderDetails();
  }, [API_URL]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        marginTop: "70px",
        marginLeft: isDropped ? "100px" : "280px",
        transition: "margin-left 0.3s ease",
        width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
        padding: 3,
        border: "3px solid #ccc",
        borderRadius: 2,
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />

      <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, mt: 0 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="h6" color="error" textAlign="center">
            {error}
          </Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Card sx={cardStyle}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
                    LenderMaster
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {!isTotalAssetsPage && (
                      <Box sx={{ textAlign: "center", flex: 1 }}>
                        <Typography variant="h4" sx={{ ...valueStyle, color: "#2ECC71" }} onClick={() => navigate(`/approved`)}>
                          {approvalData?.Approved ?? 0}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#27AE60" }}>Approved</Typography>
                        <Typography variant="h4" sx={{ ...valueStyle, color: "#E74C3C", mt: 1 }} onClick={() => navigate(`/rejected`)}>
                          {approvalData?.Rejected ?? 0}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#C0392B", fontSize: "12px" }}>Rejected</Typography>
                      </Box>
                    )}
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography variant="h4" sx={{ ...valueStyle, color: "#2980B9" }} onClick={() => navigate(`/Pending`)}>
                        {approvalData?.ApprovalPending ?? 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#3498DB" }}>Pending</Typography>
                      <Typography variant="h4" sx={{ ...valueStyle, color: "#34495E", mt: 1 }} onClick={() => navigate(`/FetchAll`)}>
                        {approvalData?.Total ?? 0}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#2C3E50" }}>Total</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={() => setModalOpen(false)}>
            <CloseIcon />
          </IconButton>
          {selectedAsset && (
            <>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                {selectedAsset.name} Details
              </Typography>
              <Typography variant="h6">Total: {selectedAsset.total}</Typography>
              <Typography variant="h6">Assigned: {selectedAsset.assigned}</Typography>
              <Typography variant="h6">Free Pool: {selectedAsset.free}</Typography>
              <Typography variant="h6" sx={{ color: "#E74C3C", fontWeight: "bold" }}>
                Under Maintenance: {selectedAsset.underMaintenance}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

const cardStyle = {
  backgroundColor: "#ECF0F1",
  color: "#1C2833",
  borderRadius: 3,
  p: 2,
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor: "#D5DBDB",
    boxShadow: "0px 6px 12px rgba(0,0,0,0.2)",
  },
};

const valueStyle = {
  fontWeight: "bold",
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out",
  "&:hover": { transform: "scale(1.2)" },
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#ECF0F1",
  color: "#34495E",
  p: 4,
  borderRadius: 3,
  textAlign: "center",
  boxShadow: 4,
  maxWidth: 400,
  width: "90%",
};

export default Dashboard;
