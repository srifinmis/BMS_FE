// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Box, Grid, Typography, TextField, CircularProgress, Paper, Button } from "@mui/material";
// import axios from "axios";

// const fieldConfig = [
//   // { name: "lender_code", label: "Lender Code" },
//   // { name: "lender_name", label: "Lender Name" },
//   // { name: "lender_type", label: "Lender Type" },
//   // { name: "lender_address_1", label: "Address Line 1" },
//   // { name: "lender_address_2", label: "Address Line 2" },
//   // { name: "lender_address_3", label: "Address Line 3" },
//   // { name: "lender_contact_1", label: "Contact 1" },
//   // { name: "lender_contact_2", label: "Contact 2" },
//   // { name: "lender_contact_3", label: "Contact 3" },
//   // { name: "lender_email_id_1", label: "Lender Email 1" },
//   // { name: "lender_email_id_2", label: "Lender Email 2" },
//   // { name: "lender_email_id_3", label: "Lender Email 3" },
//   // { name: "lender_spoc_name", label: "SPOC Name" },
//   // { name: "lender_spoc_contact", label: "SPOC Contact" },
//   // { name: "lender_spoc_email", label: "SPOC Email" },
//   // { name: "lender_escalation_name", label: "Escalation Name" },
//   // { name: "lender_escalation_contact", label: "Escalation Contact" },
//   // { name: "lender_escalation_email", label: "Escalation Email" },
//   // { name: "status", label: "Status" }
//   { name: "lender_code", label: "Lender Code" },
//   { name: "lender_name", label: "Lender Name" },
//   { name: "status", label: "Status" },
//   { name: "lender_type", label: "Lender Type" },
//   { name: "lender_escalation_name", label: "Escalation Name" },
//   { name: "lender_escalation_contact", label: "Escalation Contact" },
//   { name: "lender_escalation_email", label: "Escalation Email" },


//   { name: "addr1_line1", label: "Address Line 1" },
//   { name: "addr1_line2", label: "Address Line 2" },
//   { name: "addr1_line3", label: "Address Line 3" },
//   { name: "addr1_contact1", label: "Contact 1" },
//   { name: "addr1_contact2", label: "Contact 2" },
//   { name: "addr1_contact3", label: "Contact 3" },
//   { name: "addr1_email_id_1", label: "Lender Email 1" },
//   { name: "addr1_email_id_2", label: "Lender Email 2" },
//   { name: "addr1_email_id_3", label: "Lender Email 3" },
//   { name: "addr1_spoc_name", label: "SPOC Name" },
//   { name: "addr1_spoc_contact", label: "SPOC Contact" },
//   { name: "addr1_spoc_email", label: "SPOC Email" },


//   { name: "addr2_line1", label: "Address Line 1" },
//   { name: "addr2_line2", label: "Address Line 2" },
//   { name: "addr2_line3", label: "Address Line 3" },
//   { name: "addr2r_contact1", label: "Contact 1" },
//   { name: "addr2_contact2", label: "Contact 2" },
//   { name: "addr2_contact3", label: "Contact 3" },
//   { name: "addr2_email_id_1", label: "Lender Email 1" },
//   { name: "addr2_email_id_2", label: "Lender Email 2" },
//   { name: "addr2_email_id_3", label: "Lender Email 3" },
//   { name: "addr2_spoc_name", label: "SPOC Name" },
//   { name: "addr2_spoc_contact", label: "SPOC Contact" },
//   { name: "addr2_spoc_email", label: "SPOC Email" },


//   { name: "addr3_line1", label: "Address Line 1" },
//   { name: "addr3_line2", label: "Address Line 2" },
//   { name: "addr3_line3", label: "Address Line 3" },
//   { name: "addr3_contact_1", label: "Contact 1" },
//   { name: "addr3_contact_2", label: "Contact 2" },
//   { name: "addr3_contact_3", label: "Contact 3" },
//   { name: "addr3_email_id_1", label: "Lender Email 1" },
//   { name: "addr3_email_id_2", label: "Lender Email 2" },
//   { name: "addr3_email_id_3", label: "Lender Email 3" },
//   { name: "addr3_spoc_name", label: "SPOC Name" },
//   { name: "addr3_spoc_contact", label: "SPOC Contact" },
//   { name: "addr3_spoc_email", label: "SPOC Email" },
// ];

// const LenderDetailsApprove = ({ isDropped }) => {
//   const API_URL = process.env.REACT_APP_API_URL;

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { lender_code, approval_status, lender_name, updatedat } = location.state || {};
//   const [lender, setLender] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [remarks, setRemarks] = useState("");
//   const [remarksError, setRemarksError] = useState(false);
//   const [dataSend, setDataSend] = useState("");

//   useEffect(() => {
//     // setAction("reject");
//     const fetchLenderDetails = async () => {
//       try {
//         // console.log("approval lender 3: ", lender_code, approval_status, lender_name, updatedat)
//         const response = await axios.get(
//           `${API_URL}/lender/details`,
//           {
//             params: {
//               lender_code,
//               approval_status,
//               lender_name,
//               updatedat
//             }
//           }
//         ); console.log("UseEfffect detail view approval :", response.data.lender)
//         if (response.status === 200) {
//           setLender(response.data.lender);
//           setDataSend(response.data.lender);
//         }
//       } catch (error) {
//         console.error("Error fetching lender details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLenderDetails();
//   }, [API_URL, lender_code, approval_status, lender_name, updatedat]);


//   const handleApprove = async () => {
//     try {
//       const response = await fetch(`${API_URL}/lender/Approve`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // body: JSON.stringify(`[ ${dataSend} ]`),
//         body: JSON.stringify([{ ...dataSend, remarks }]),
//       });

//       // const data = await response.json();
//       // console.log("Response Data sent: ", data);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Server responded with error:", errorData);

//         localStorage.setItem("submissionMessage", "Lender Approve failed!");
//         localStorage.setItem("messageType", "error");

//         throw new Error(`Server Error: ${response.status}`);
//       }

//       // setMessage("Lender added successfully ✅");

//       localStorage.setItem("submissionMessage", "Lender Approved successfully!");
//       localStorage.setItem("messageType", "success");

//       // console.log("Response Data sent to api: ", response);
//       navigate("/Approve/LenderMaster");

//     } catch (error) {
//       // setMessage("Error connecting to the server ⚠️");
//       // console.log("Error: connecting to the server ⚠️");
//     }

//     setRemarks("");
//   };
//   const handleBack = () => {
//     navigate("/Approve/LenderMaster");
//   };

//   const handleReject = async () => {
//     // setAction("reject");
//     if (!remarks.trim()) {
//       setRemarksError(true);
//       return;
//     }


//     // console.log("handle Approve: ", JSON.stringify(dataSend, null, 2));
//     try {
//       const response = await fetch(`${API_URL}/lender/reject`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // body: JSON.stringify(`[ ${dataSend} ]`),
//         body: JSON.stringify([{ ...dataSend, remarks }]),
//       });

//       // const data = await response.json();
//       // console.log("Response Data sent: ", data);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Server responded with error:", errorData);
//         localStorage.setItem("submissionMessage", "Lender Rejection failed!");
//         localStorage.setItem("messageType", "error");
//         throw new Error(`Server Error: ${response.status}`);
//       }

//       // setMessage("Lender added successfully ✅");
//       // console.log("Response Data sent to api: ", response);
//       localStorage.setItem("submissionMessage", "Lender Rejected successfully!");
//       localStorage.setItem("messageType", "success");
//       // Reset form data after successful submission
//       navigate("/Approve/LenderMaster"); // If you want to navigate, otherwise remove this line

//     } catch (error) {
//       // setMessage("Error connecting to the server ⚠️");
//       // console.log("Error: connecting to the server ⚠️");
//     }

//     // console.log("Rejected with remarks:", remarks);

//     // Reset state after rejection
//     setRemarks("");
//     setRemarksError(false);

//   };

//   return (
//     <Box sx={{
//       display: "flex",
//       flexDirection: "column",
//       gap: 2,
//       margin: "auto",
//       marginTop: "70px",
//       marginLeft: isDropped ? "100px" : "280px",
//       transition: "margin-left 0.3s ease-in-out",
//       width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//       padding: 3,
//       border: "1px solid #ccc",
//       borderRadius: 2,
//       boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
//     }}>
//       <Typography sx={{
//         color: "#0056b3",
//         fontWeight: "600",
//         fontSize: "20px",
//         marginBottom: "20px",
//         textAlign: "center",
//         textTransform: "uppercase",
//         letterSpacing: "1px",
//         borderBottom: "2px solid #0056b3",
//         paddingBottom: "10px"
//       }}>
//         Lender Details
//       </Typography>

//       {loading ? (
//         <CircularProgress sx={{ display: "block", margin: "auto" }} />
//       ) : lender ? (
//         <Paper elevation={0} sx={{ padding: 3 }}>
//           <Grid container spacing={2}>
//             {fieldConfig.map((field) => (
//               <Grid key={field.name} item xs={12} sm={6}>
//                 <TextField
//                   label={field.label}
//                   value={lender[field.name] || "N/A"}
//                   fullWidth
//                   InputProps={{ readOnly: true }}
//                   sx={{
//                     cursor: "default",
//                     backgroundColor: lender.updated_fields?.includes(field.name) ? "#fcec03" : "#ebeced",
//                     "& .MuiInputBase-root": {
//                       pointerEvents: "none"
//                     }
//                   }}
//                 />
//               </Grid>
//             ))}
//           </Grid>

//           <TextField
//             label="Remarks (Required for Rejection)"
//             value={remarks}
//             onChange={(e) => {
//               setRemarks(e.target.value);
//               if (e.target.value.trim()) setRemarksError(false);
//             }}
//             fullWidth
//             multiline
//             rows={3}
//             sx={{ marginTop: 2 }}
//             required
//             error={remarksError}
//             helperText={remarksError ? "Remarks are required when rejecting." : ""}
//           />

//           <Box sx={{ marginTop: 3, display: "flex", gap: 2, justifyContent: "center" }}>
//             <Button variant="contained" color="warning" onClick={handleBack}>
//               Back
//             </Button>
//             <Button variant="contained" color="success" onClick={handleApprove}>
//               Approve
//             </Button>
//             <Button variant="contained" color="error" onClick={handleReject} disabled={!remarks.trim()}>
//               Reject
//             </Button>
//           </Box>
//         </Paper>
//       ) : (
//         <Typography sx={{ textAlign: "center", marginTop: 2 }}>Lender details not found</Typography>
//       )}
//     </Box>
//   );
// };

// export default LenderDetailsApprove;



import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Paper,
  Button,
  Divider
} from "@mui/material";
import axios from "axios";

const generalFields = [
  { name: "lender_code", label: "Lender Code" },
  { name: "lender_name", label: "Lender Name" },
  { name: "status", label: "Status" },
  { name: "lender_type", label: "Lender Type" },
  { name: "lender_escalation_name", label: "Escalation Name" },
  { name: "lender_escalation_contact", label: "Escalation Contact" },
  { name: "lender_escalation_email", label: "Escalation Email" }
];

const addressBlocks = [
  {
    title: "Head Office Details",
    fields: [
      { name: "addr1_line1", label: "Address Line 1" },
      { name: "addr1_line2", label: "Address Line 2" },
      { name: "addr1_line3", label: "Address Line 3" },
      { name: "addr1_contact1", label: "Contact 1" },
      { name: "addr1_contact2", label: "Contact 2" },
      { name: "addr1_contact3", label: "Contact 3" },
      { name: "addr1_email1", label: "Lender Email 1" },
      { name: "addr1_email2", label: "Lender Email 2" },
      { name: "addr1_email3", label: "Lender Email 3" },
      { name: "addr1_spoc_name", label: "SPOC Name" },
      { name: "addr1_spoc_contact", label: "SPOC Contact" },
      { name: "addr1_spoc_email", label: "SPOC Email" }
    ]
  },
  {
    title: "Regional Office",
    fields: [
      { name: "addr2_line1", label: "Address Line 1" },
      { name: "addr2_line2", label: "Address Line 2" },
      { name: "addr2_line3", label: "Address Line 3" },
      { name: "addr2_contact1", label: "Contact 1" },
      { name: "addr2_contact2", label: "Contact 2" },
      { name: "addr2_contact3", label: "Contact 3" },
      { name: "addr2_email1", label: "Lender Email 1" },
      { name: "addr2_email2", label: "Lender Email 2" },
      { name: "addr2_email3", label: "Lender Email 3" },
      { name: "addr2_spoc_name", label: "SPOC Name" },
      { name: "addr2_spoc_contact", label: "SPOC Contact" },
      { name: "addr2_spoc_email", label: "SPOC Email" }
    ]
  },
  {
    title: "Branch",
    fields: [
      { name: "addr3_line1", label: "Address Line 1" },
      { name: "addr3_line2", label: "Address Line 2" },
      { name: "addr3_line3", label: "Address Line 3" },
      { name: "addr3_contact1", label: "Contact 1" },
      { name: "addr3_contact2", label: "Contact 2" },
      { name: "addr3_contact3", label: "Contact 3" },
      { name: "addr3_email1", label: "Lender Email 1" },
      { name: "addr3_email2", label: "Lender Email 2" },
      { name: "addr3_email3", label: "Lender Email 3" },
      { name: "addr3_spoc_name", label: "SPOC Name" },
      { name: "addr3_spoc_contact", label: "SPOC Contact" },
      { name: "addr3_spoc_email", label: "SPOC Email" }
    ]
  }
];

const LenderDetailsApprove = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { lender_code, approval_status, lender_name, updatedat } = location.state || {};

  const [lender, setLender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);
  const [dataSend, setDataSend] = useState("");

  useEffect(() => {
    const fetchLenderDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/lender/details`, {
          params: { lender_code, approval_status, lender_name, updatedat }
        });
        if (response.status === 200) {
          setLender(response.data.lender);
          setDataSend(response.data.lender);
        }
      } catch (error) {
        console.error("Error fetching lender details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLenderDetails();
  }, [API_URL, lender_code, approval_status, lender_name, updatedat]);

  const handleApprove = async () => {
    try {
      const response = await fetch(`${API_URL}/lender/Approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ ...dataSend, remarks }])
      });

      if (!response.ok) {
        // const errorData = await response.json();
        localStorage.setItem("submissionMessage", "Lender Approve failed!");
        localStorage.setItem("messageType", "error");
        throw new Error(`Server Error: ${response.status}`);
      }

      localStorage.setItem("submissionMessage", "Lender Approved successfully!");
      localStorage.setItem("messageType", "success");
      navigate("/Approve/LenderMaster");
    } catch (error) { }
    setRemarks("");
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      setRemarksError(true);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/lender/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ ...dataSend, remarks }])
      });

      if (!response.ok) {
        // const errorData = await response.json();
        localStorage.setItem("submissionMessage", "Lender Rejection failed!");
        localStorage.setItem("messageType", "error");
        throw new Error(`Server Error: ${response.status}`);
      }

      localStorage.setItem("submissionMessage", "Lender Rejected successfully!");
      localStorage.setItem("messageType", "success");
      navigate("/Approve/LenderMaster");
    } catch (error) { }
    setRemarks("");
    setRemarksError(false);
  };

  const handleBack = () => {
    navigate("/Approve/LenderMaster");
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      margin: "auto",
      marginTop: "70px",
      marginLeft: isDropped ? "100px" : "280px",
      transition: "margin-left 0.3s ease-in-out",
      width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
      padding: 3,
      border: "3px solid #ccc",
      borderRadius: 2,
      // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
    }}>
      <Typography sx={{
        color: "#0056b3",
        fontWeight: "600",
        fontSize: "20px",
        marginBottom: "20px",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "1px",
        borderBottom: "2px solid #0056b3",
        paddingBottom: "10px"
      }}>
        Lender Details
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : lender ? (
        <Paper elevation={0} sx={{ padding: 3 }}>
          <Grid container spacing={2}>
            {generalFields.map((field) => (
              <Grid key={field.name} item xs={6} sm={4}>
                <TextField
                  label={field.label}
                  value={lender[field.name] || "N/A"}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={{
                    cursor: "default",
                    backgroundColor: lender.updated_fields?.includes(field.name) ? "#fcec03" : "#ebeced",
                    "& .MuiInputBase-root": { pointerEvents: "none" }
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {addressBlocks.map((block, index) => (
            <Box key={index} sx={{ marginTop: 4 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>{block.title}</Typography>
              <Grid container spacing={2}>
                {block.fields.map((field) => (
                  <Grid key={field.name} item xs={12} sm={6}>
                    <TextField
                      label={field.label}
                      value={lender[field.name] || "N/A"}
                      fullWidth
                      InputProps={{ readOnly: true }}
                      sx={{
                        cursor: "default",
                        backgroundColor: lender.updated_fields?.includes(field.name) ? "#fcec03" : "#ebeced",
                        "& .MuiInputBase-root": { pointerEvents: "none" }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <TextField
            label="Remarks (Required for Rejection)"
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              if (e.target.value.trim()) setRemarksError(false);
            }}
            fullWidth
            multiline
            rows={2}
            sx={{ marginTop: 3 }}
            required
            error={remarksError}
            helperText={remarksError ? "Remarks are required when rejecting." : ""}
          />

          <Box sx={{ marginTop: 3, display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="contained" color="warning" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="success" onClick={handleApprove}>
              Approve
            </Button>
            <Button variant="contained" color="error" onClick={handleReject} disabled={!remarks.trim()}>
              Reject
            </Button>
          </Box>
        </Paper>
      ) : (
        <Typography sx={{ textAlign: "center", marginTop: 2 }}>Lender details not found</Typography>
      )}
    </Box>
  );
};

export default LenderDetailsApprove;
