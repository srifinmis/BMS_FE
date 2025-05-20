// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Grid,
//   Box,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import dayjs from "dayjs";
// import { useNavigate } from "react-router-dom";

// const trancheDaysOptions = [
//   { label: "T-30", value: 30 },
//   { label: "T-15", value: 15 },
//   { label: "T-7", value: 7 },
//   { label: "T-6", value: 6 },
//   { label: "T-5", value: 5 },
//   { label: "T-4", value: 4 },
//   { label: "T-3", value: 3 },
//   { label: "T-2", value: 2 },
//   { label: "T-1", value: 1 },
// ];
// const frequencyOptions = ["Daily", "Weekly"];

// const AddAlert = ({ isDropped }) => {
//   const API_URL = process.env.REACT_APP_API_URL;

//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     sanction_id: "",
//     tranche_id: "",
//     tranche_days: "",
//     alert_start_date: "",
//     alert_time: null,
//     alert_end_date: null,
//     alert_frequency: "",
//     to_addr: "",
//     cc_addr: ""
//   });

//   const [message, setMessage] = useState("");
//   const [repaymentData, setRepaymentData] = useState([]); 
//   const [tranches, setTranches] = useState([]);

//   useEffect(() => {
//     // Fetch repayment data from API
//     const fetchRepaymentData = async () => {
//       try {
//         const response = await fetch(`${API_URL}/alert/findall`);
//         console.log("resposen: ", response)
//         const result = await response.json();
//         if (result.success) {
//           setRepaymentData(result.data);
//         } else {
//           setMessage("Failed to fetch repayment data.");
//         }
//       } catch (error) {
//         setMessage("Error fetching repayment data.");
//       }
//     };
//     fetchRepaymentData();
//   }, [API_URL]);


//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//       alert_start_date: prevData.alert_end_date
//         ? dayjs(prevData.alert_end_date).subtract(value, "day").format("YYYY-MM-DD")
//         : "",
//     }));
//   };

//   const handleTimeChange = (newTime) => {
//     setFormData({ ...formData, alert_time: newTime });
//   };

//   const handleSanctionChange = (e) => {
//     const sanctionId = e.target.value;
//     setFormData((prev) => ({ ...prev, sanction_id: sanctionId, tranche_id: "", alert_end_date: null }));

//     // Filter tranches for selected sanction ID
//     const filteredTranches = repaymentData.filter((item) => item.sanction_id === sanctionId);
//     setTranches(filteredTranches);
//   };

//   const handleTrancheChange = (e) => {
//     const trancheId = e.target.value;
//     const selectedTranche = tranches.find((item) => item.tranche_id === trancheId);

//     setFormData((prev) => ({
//       ...prev,
//       tranche_id: trancheId,
//       alert_end_date: selectedTranche ? dayjs(selectedTranche.alert_end_date) : null,
//       alert_start_date: selectedTranche && prev.tranche_days
//         ? dayjs(selectedTranche.alert_end_date).subtract(prev.tranche_days, "day").format("YYYY-MM-DD")
//         : "",
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.sanction_id.trim()) {
//       setMessage("Error: Sanction ID is required ⚠️");
//       return;
//     }

//     const formattedData = {
//       ...formData,
//       alert_time: formData.alert_time ? dayjs(formData.alert_time).format("HH:mm") : null,
//       alert_end_date: formData.alert_end_date ? dayjs(formData.alert_end_date).format("YYYY-MM-DD") : null,
//     };

//     console.log("Form Data Alert: ", formattedData);

//     try {
//       const response = await fetch(`${API_URL}/cron/create`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedData),
//       });

//       if (!response.ok) throw new Error("Server Error");

//       setMessage("Alert saved successfully ✅");
//       setFormData({
//         sanction_id: "",
//         tranche_id: "",
//         tranche_days: "",
//         alert_time: null,
//         alert_end_date: null,
//         alert_frequency: "",
//         to_addr: "",
//         cc_addr: ""
//       });
//       navigate("/DataCreation/SanctionDetails");
//     } catch (error) {
//       setMessage("Error connecting to the server ⚠️");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 2,
//         margin: "auto",
//         marginTop: "70px",
//         marginLeft: isDropped ? "100px" : "280px",
//         transition: "margin-left 0.3s ease",
//         width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//         padding: 3,
//         border: "3px solid #ccc",
//         borderRadius: 2,
//         // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
//       }}
//     >
//       <Typography sx={{ color: "#0056b3", fontWeight: "600", fontSize: "20px", marginBottom: "20px", textAlign: "center", borderBottom: "2px solid #0056b3", paddingBottom: "10px" }}>
//         Add New Alert
//       </Typography>

//       {message && <Typography color="error" sx={{ textAlign: "center", fontWeight: "bold" }}>{message}</Typography>}

//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Sanction ID</InputLabel>
//               <Select name="sanction_id" value={formData.sanction_id} onChange={handleSanctionChange}>
//                 {Array.from(new Set(repaymentData.map((item) => item.sanction_id))).map((id) => (
//                   <MenuItem key={id} value={id}>{id}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Tranche ID</InputLabel>
//               <Select name="tranche_id" value={formData.tranche_id} onChange={handleTrancheChange}>
//                 {tranches.map((tranche) => (
//                   <MenuItem key={tranche.tranche_id} value={tranche.tranche_id}>
//                     {tranche.tranche_id}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Alert Time"
//               type="time"
//               name="alert_time"
//               value={formData.alert_time ? dayjs(formData.alert_time).format("HH:mm") : ""}
//               onChange={handleTimeChange}
//               fullWidth
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Frequency</InputLabel>
//               <Select name="alert_frequency" value={formData.alert_frequency} onChange={handleChange}>
//                 {frequencyOptions.map((option) => (
//                   <MenuItem key={option} value={option}>{option}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Alert Start Days</InputLabel>
//               <Select
//                 name="tranche_days"
//                 value={formData.tranche_days}
//                 onChange={handleChange}
//               >
//                 {trancheDaysOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Alert Start's From (Due_Date - Tranche_Day)"
//               value={formData.alert_start_date || ""}
//               fullWidth
//               disabled
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField label="To" name="to_addr" value={formData.to_addr} onChange={handleChange} fullWidth required />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField label="CC" name="cc_addr" value={formData.cc_addr} onChange={handleChange} fullWidth />
//           </Grid>
//         </Grid>

//         <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
//           <Button variant="contained" color="warning" onClick={() => navigate(-1)}>Back</Button>
//           <Button variant="contained" color="primary" type="submit">Save</Button>
//         </Box>
//       </form>
//     </Box>
//   );
// };

// export default AddAlert;


// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button, Grid,
//   Box, Typography,
//   FormControl, InputLabel,
//   Select, MenuItem,
// } from "@mui/material";
// import dayjs from "dayjs";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const trancheDaysOptions = [
//   { label: "T-30", value: 30 },
//   { label: "T-15", value: 15 },
//   { label: "T-7", value: 7 },
//   { label: "T-6", value: 6 },
//   { label: "T-5", value: 5 },
//   { label: "T-4", value: 4 },
//   { label: "T-3", value: 3 },
//   { label: "T-2", value: 2 },
//   { label: "T-1", value: 1 },
// ];
// const frequencyOptions = ["Daily", "Weekly"];

// const AddAlert = ({ isDropped }) => {
//   const API_URL = process.env.REACT_APP_API_URL;

//   const navigate = useNavigate();
//   const [lenderCodes, setLenderCodes] = useState([]);
//   const [sanctionData, setSanctionData] = useState([]);
//   const [trancheData, setTrancheData] = useState([]);

//   const [formData, setFormData] = useState({
//     sanction_id: "",
//     tranche_id: "",
//     tranche_days: "",
//     alert_start_date: "",
//     alert_time: "",  // Store as HH:mm string
//     alert_end_date: null,
//     alert_frequency: "",
//     to_addr: "",
//     cc_addr: ""
//   });

//   const [message, setMessage] = useState("");
//   const [repaymentData, setRepaymentData] = useState([]);
//   const [tranches, setTranches] = useState([]);

//   useEffect(() => {
//     const fetchLenders = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/sanction/lendercodes`);
//         if (response.data?.data) {
//           setLenderCodes(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching lenders:", error);
//       }
//     };

//     const fetchSanctions = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/roc/sanctionid`);
//         if (response.data?.data && Array.isArray(response.data.data)) {
//           setSanctionData(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching sanction IDs:", error);
//       }
//     };

//     const fetchTranche = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/tranche/findTwo`);
//         if (response.data?.data && Array.isArray(response.data.data)) {
//           setTrancheData(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching tranche data:", error);
//       }
//     };

//     // Fetch repayment data from API
//     const fetchRepaymentData = async () => {
//       try {
//         const response = await fetch(`${API_URL}/alert/findall`);
//         const result = await response.json();
//         if (result.success) {
//           setRepaymentData(result.data);
//         } else {
//           setMessage("Failed to fetch repayment data.");
//         }
//       } catch (error) {
//         setMessage("Error fetching repayment data.");
//       }
//     };

//     fetchLenders();
//     fetchSanctions();
//     fetchTranche();
//     fetchRepaymentData();
//   }, [API_URL]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//       alert_start_date: prevData.alert_end_date
//         ? dayjs(prevData.alert_end_date).subtract(value, "day").format("YYYY-MM-DD")
//         : "",
//     }));
//   };

//   // Fixed time change handler - gets event and updates string value "HH:mm"
//   const handleTimeChange = (e) => {
//     const value = e.target.value;
//     setFormData((prev) => ({
//       ...prev,
//       alert_time: value,
//     }));
//   };

//   const handleSanctionChange = (e) => {
//     const sanctionId = e.target.value;
//     setFormData((prev) => ({ ...prev, sanction_id: sanctionId, tranche_id: "", alert_end_date: null }));

//     // Filter tranches for selected sanction ID
//     const filteredTranches = repaymentData.filter((item) => item.sanction_id === sanctionId);
//     console.log("filterd tranche: ", filteredTranches)
//     setTranches(filteredTranches);
//   };

//   const handleTrancheChange = (e) => {
//     const trancheId = e.target.value;
//     const selectedTranche = tranches.find((item) => item.tranche_id === trancheId);

//     setFormData((prev) => ({
//       ...prev,
//       tranche_id: trancheId,
//       alert_end_date: selectedTranche ? dayjs(selectedTranche.alert_end_date) : null,
//       alert_start_date: selectedTranche && prev.tranche_days
//         ? dayjs(selectedTranche.alert_end_date).subtract(prev.tranche_days, "day").format("YYYY-MM-DD")
//         : "",
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.sanction_id.trim()) {
//       setMessage("Error: Sanction ID is required ⚠️");
//       return;
//     }

//     const formattedData = {
//       ...formData,
//       alert_time: formData.alert_time || null,
//       alert_end_date: formData.alert_end_date ? dayjs(formData.alert_end_date).format("YYYY-MM-DD") : null,
//     };

//     console.log("Form Data Alert: ", formattedData);

//     try {
//       const response = await fetch(`${API_URL}/cron/create`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedData),
//       });

//       if (!response.ok) throw new Error("Server Error");

//       setMessage("Alert saved successfully ✅");
//       setFormData({
//         sanction_id: "",
//         tranche_id: "",
//         tranche_days: "",
//         alert_time: "",
//         alert_end_date: null,
//         alert_frequency: "",
//         to_addr: "",
//         cc_addr: ""
//       });
//       navigate("/DataCreation/SanctionDetails");
//     } catch (error) {
//       setMessage("Error connecting to the server ⚠️");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 2,
//         margin: "auto",
//         marginTop: "70px",
//         marginLeft: isDropped ? "100px" : "280px",
//         transition: "margin-left 0.3s ease",
//         width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//         padding: 3,
//         border: "3px solid #ccc",
//         borderRadius: 2,
//       }}
//     >
//       <Typography sx={{ color: "#0056b3", fontWeight: "600", fontSize: "20px", marginBottom: "20px", textAlign: "center", borderBottom: "2px solid #0056b3", paddingBottom: "10px" }}>
//         Add New Alert
//       </Typography>

//       {message && <Typography color="error" sx={{ textAlign: "center", fontWeight: "bold" }}>{message}</Typography>}

//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Lender Code</InputLabel>
//               <Select name="lender_code" value={formData.lender_code} onChange={handleSanctionChange}>
//                 {/* {Array.from(new Set(lenderCodes.map((item) => item.lender_code))).map((id) => (
//                   <MenuItem key={id} value={id}>{id}-{id.lender_name}</MenuItem>
//                 ))} */}
//                 {lenderCodes.map((lender) => (
//                   <MenuItem key={lender.lender_code} value={lender.lender_code}>
//                     {lender.lender_code} - {lender.lender_name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Sanction ID</InputLabel>
//               <Select name="sanction_id" value={formData.sanction_id} onChange={handleSanctionChange}>
//                 {sanctionData.map((sanction) => (
//                   <MenuItem key={sanction.sanction_id} value={sanction.sanction_id}>
//                     {sanction.sanction_id}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Tranche ID</InputLabel>
//               <Select name="tranche_id" value={formData.tranche_id} onChange={handleTrancheChange}>
//                 {trancheData.map((tranche) => (
//                   <MenuItem key={tranche.tranche_id} value={tranche.tranche_id}>
//                     {tranche.tranche_id} - {tranche.tranche_id}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Alert Time"
//               type="time"
//               name="alert_time"
//               value={formData.alert_time || ""}
//               onChange={handleTimeChange}
//               fullWidth
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Frequency</InputLabel>
//               <Select name="alert_frequency" value={formData.alert_frequency} onChange={handleChange}>
//                 {frequencyOptions.map((option) => (
//                   <MenuItem key={option} value={option}>{option}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>Alert Start Days</InputLabel>
//               <Select
//                 name="tranche_days"
//                 value={formData.tranche_days}
//                 onChange={handleChange}
//               >
//                 {trancheDaysOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Alert Start's From (Due_Date - Tranche_Day)"
//               value={formData.alert_start_date || ""}
//               fullWidth
//               disabled
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField label="To" name="to_addr" value={formData.to_addr} onChange={handleChange} fullWidth required />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField label="CC" name="cc_addr" value={formData.cc_addr} onChange={handleChange} fullWidth />
//           </Grid>
//         </Grid>

//         <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
//           <Button variant="contained" color="warning" onClick={() => navigate(-1)}>Back</Button>
//           <Button variant="contained" color="primary" type="submit">Save</Button>
//         </Box>
//       </form>
//     </Box>
//   );
// };

// export default AddAlert;

// code up

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const trancheDaysOptions = [
  { label: "T-30", value: 30 },
  { label: "T-15", value: 15 },
  { label: "T-7", value: 7 },
  { label: "T-6", value: 6 },
  { label: "T-5", value: 5 },
  { label: "T-4", value: 4 },
  { label: "T-3", value: 3 },
  { label: "T-2", value: 2 },
  { label: "T-1", value: 1 },
];

const frequencyOptions = ["Daily", "Weekly"];

const AddAlert = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [lenderCodes, setLenderCodes] = useState([]);
  const [sanctionData, setSanctionData] = useState([]);
  const [trancheData, setTrancheData] = useState([]);
  const [repaymentData, setRepaymentData] = useState([]);
  const [tranches, setTranches] = useState([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    lender_code: "",
    sanction_id: "",
    tranche_id: "",
    tranche_days: "",
    alert_start_date: "",
    alert_time: "",
    alert_end_date: null,
    alert_frequency: "",
    to_addr: "",
    cc_addr: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lenderRes, sanctionRes, trancheRes, alertRes] = await Promise.all([
          axios.get(`${API_URL}/sanction/lendercodes`),
          axios.get(`${API_URL}/roc/sanctionid`),
          axios.get(`${API_URL}/tranche/findTwo`),
          fetch(`${API_URL}/alert/findall`).then((res) => res.json()),
        ]);

        setLenderCodes(lenderRes.data.data || []);
        setSanctionData(sanctionRes.data.data || []);
        setTrancheData(trancheRes.data.data || []);
        if (alertRes.success) setRepaymentData(alertRes.data);
      } catch (error) {
        setMessage("Error fetching initial data.");
        console.error(error);
      }
    };

    fetchData();
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      if (name === "tranche_days" && prevData.alert_end_date) {
        newData.alert_start_date = dayjs(prevData.alert_end_date)
          .subtract(value, "day")
          .format("YYYY-MM-DD");
      }
      return newData;
    });
  };

  const handleTimeChange = (e) => {
    setFormData((prev) => ({ ...prev, alert_time: e.target.value }));
  };

  const handleLenderChange = (e) => {
    const lenderCode = e.target.value;
    setFormData((prev) => ({
      ...prev,
      lender_code: lenderCode,
      sanction_id: "",
      tranche_id: "",
    }));
    const filteredSanctions = sanctionData.filter(
      (item) => item.lender_code === lenderCode
    );
    setSanctionData(filteredSanctions);
  };

  const handleSanctionChange = (e) => {
    const sanctionId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      sanction_id: sanctionId,
      tranche_id: "",
      alert_end_date: null,
    }));
    const filteredTranches = trancheData.filter(
      (item) => item.sanction_id === sanctionId
    );
    setTrancheData(filteredTranches);
  };

  const handleTrancheChange = (e) => {
    const trancheId = e.target.value;
    const selectedTranche = trancheData.find(
      (item) => item.tranche_id === trancheId
    );
    setFormData((prev) => ({
      ...prev,
      tranche_id: trancheId,
      alert_end_date: selectedTranche
        ? dayjs(selectedTranche.alert_end_date)
        : null,
      alert_start_date:
        selectedTranche && prev.tranche_days
          ? dayjs(selectedTranche.alert_end_date)
            .subtract(prev.tranche_days, "day")
            .format("YYYY-MM-DD")
          : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sanction_id.trim()) {
      setMessage("Error: Sanction ID is required ⚠️");
      return;
    }

    const formattedData = {
      ...formData,
      alert_time: formData.alert_time || null,
      alert_end_date: formData.alert_end_date
        ? dayjs(formData.alert_end_date).format("YYYY-MM-DD")
        : null,
    };

    try {
      console.log("Add AlterPayload: ", formattedData)
      const response = await fetch(`${API_URL}/cron/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error("Server Error");

      setMessage("Alert saved successfully ✅");
      alert("Alert saved successfully ✅");
      setFormData({
        lender_code: "",
        sanction_id: "",
        tranche_id: "",
        tranche_days: "",
        alert_time: "",
        alert_end_date: null,
        alert_frequency: "",
        to_addr: "",
        cc_addr: "",
      });
      navigate("/Alerts/Alertmain");
    } catch (error) {
      setMessage("Error connecting to the server ⚠️");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
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
      <Typography
        sx={{
          color: "#0056b3",
          fontWeight: "600",
          fontSize: "20px",
          textAlign: "center",
          borderBottom: "2px solid #0056b3",
          paddingBottom: "10px",
        }}
      >
        Add New Alert
      </Typography>

      {message && (
        <Typography color="error" sx={{ textAlign: "center", fontWeight: "bold" }}>
          {message}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Lender Code</InputLabel>
              <Select
                name="lender_code"
                value={formData.lender_code}
                onChange={handleLenderChange}
              >
                {lenderCodes.map((lender) => (
                  <MenuItem key={lender.lender_code} value={lender.lender_code}>
                    {lender.lender_code} - {lender.lender_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sanction ID</InputLabel>
              <Select
                name="sanction_id"
                value={formData.sanction_id}
                onChange={handleSanctionChange}
              >
                {sanctionData.map((sanction) => (
                  <MenuItem key={sanction.sanction_id} value={sanction.sanction_id}>
                    {sanction.sanction_id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tranche ID</InputLabel>
              <Select
                name="tranche_id"
                value={formData.tranche_id}
                onChange={handleTrancheChange}
              >
                {trancheData.map((tranche) => (
                  <MenuItem key={tranche.tranche_id} value={tranche.tranche_id}>
                    {tranche.tranche_id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Alert Time"
              type="time"
              name="alert_time"
              value={formData.alert_time || ""}
              onChange={handleTimeChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                name="alert_frequency"
                value={formData.alert_frequency}
                onChange={handleChange}
              >
                {frequencyOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Alert Start Days</InputLabel>
              <Select
                name="tranche_days"
                value={formData.tranche_days}
                onChange={handleChange}
              >
                {trancheDaysOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="To Email"
              name="to_addr"
              value={formData.to_addr}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="CC Email"
              name="cc_addr"
              value={formData.cc_addr}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit Alert
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddAlert;
