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
// import { LocalizationProvider, TimePicker, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
//   const [repaymentData, setRepaymentData] = useState([]); // Store API data
//   const [tranches, setTranches] = useState([]); // Tranches for selected sanction ID

//   useEffect(() => {
//     // Fetch repayment data from API
//     const fetchRepaymentData = async () => {
//       try {
//         const response = await fetch("http://localhost:5002/api/alert/findall");
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
//   }, []);


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
//       const response = await fetch("http://localhost:5002/api/cron/create", {
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
//         border: "1px solid #ccc",
//         borderRadius: 2,
//         boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
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
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <TimePicker label="Select Time" value={formData.alert_time} onChange={handleTimeChange} renderInput={(params) => <TextField {...params} fullWidth />} />
//             </LocalizationProvider>
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
//           </Grid >
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth>
//               <InputLabel>alert start Days</InputLabel>
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
//         </Grid>
        
//         <Grid item xs={12} sm={6}>
//             <TextField label="To" name="to_addr" value={formData.to_addr} onChange={handleChange} fullWidth required />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField label="CC" name="cc_addr" value={formData.cc_addr} onChange={handleChange} fullWidth />
//           </Grid>

//         <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
//           <Button variant="contained" color="warning" onClick={() => navigate("/DataCreation/SanctionDetails")}>Back</Button>
//           <Button variant="contained" color="primary" type="submit">Save</Button>
//         </Box>
//       </form>
//     </Box >
//   );
// };

// export default AddAlert;

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
  const [formData, setFormData] = useState({
    sanction_id: "",
    tranche_id: "",
    tranche_days: "",
    alert_start_date: "",
    alert_time: null,
    alert_end_date: null,
    alert_frequency: "",
    to_addr: "",
    cc_addr: ""
  });

  const [message, setMessage] = useState("");
  const [repaymentData, setRepaymentData] = useState([]); 
  const [tranches, setTranches] = useState([]);

  useEffect(() => {
    // Fetch repayment data from API
    const fetchRepaymentData = async () => {
      try {
        const response = await fetch(`${API_URL}/alert/findall`);
        console.log("resposen: ", response)
        const result = await response.json();
        if (result.success) {
          setRepaymentData(result.data);
        } else {
          setMessage("Failed to fetch repayment data.");
        }
      } catch (error) {
        setMessage("Error fetching repayment data.");
      }
    };
    fetchRepaymentData();
  }, [API_URL]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      alert_start_date: prevData.alert_end_date
        ? dayjs(prevData.alert_end_date).subtract(value, "day").format("YYYY-MM-DD")
        : "",
    }));
  };

  const handleTimeChange = (newTime) => {
    setFormData({ ...formData, alert_time: newTime });
  };

  const handleSanctionChange = (e) => {
    const sanctionId = e.target.value;
    setFormData((prev) => ({ ...prev, sanction_id: sanctionId, tranche_id: "", alert_end_date: null }));

    // Filter tranches for selected sanction ID
    const filteredTranches = repaymentData.filter((item) => item.sanction_id === sanctionId);
    setTranches(filteredTranches);
  };

  const handleTrancheChange = (e) => {
    const trancheId = e.target.value;
    const selectedTranche = tranches.find((item) => item.tranche_id === trancheId);

    setFormData((prev) => ({
      ...prev,
      tranche_id: trancheId,
      alert_end_date: selectedTranche ? dayjs(selectedTranche.alert_end_date) : null,
      alert_start_date: selectedTranche && prev.tranche_days
        ? dayjs(selectedTranche.alert_end_date).subtract(prev.tranche_days, "day").format("YYYY-MM-DD")
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
      alert_time: formData.alert_time ? dayjs(formData.alert_time).format("HH:mm") : null,
      alert_end_date: formData.alert_end_date ? dayjs(formData.alert_end_date).format("YYYY-MM-DD") : null,
    };

    console.log("Form Data Alert: ", formattedData);

    try {
      const response = await fetch(`${API_URL}/cron/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error("Server Error");

      setMessage("Alert saved successfully ✅");
      setFormData({
        sanction_id: "",
        tranche_id: "",
        tranche_days: "",
        alert_time: null,
        alert_end_date: null,
        alert_frequency: "",
        to_addr: "",
        cc_addr: ""
      });
      navigate("/DataCreation/SanctionDetails");
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
        margin: "auto",
        marginTop: "70px",
        marginLeft: isDropped ? "100px" : "280px",
        transition: "margin-left 0.3s ease",
        width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Typography sx={{ color: "#0056b3", fontWeight: "600", fontSize: "20px", marginBottom: "20px", textAlign: "center", borderBottom: "2px solid #0056b3", paddingBottom: "10px" }}>
        Add New Alert
      </Typography>

      {message && <Typography color="error" sx={{ textAlign: "center", fontWeight: "bold" }}>{message}</Typography>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sanction ID</InputLabel>
              <Select name="sanction_id" value={formData.sanction_id} onChange={handleSanctionChange}>
                {Array.from(new Set(repaymentData.map((item) => item.sanction_id))).map((id) => (
                  <MenuItem key={id} value={id}>{id}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tranche ID</InputLabel>
              <Select name="tranche_id" value={formData.tranche_id} onChange={handleTrancheChange}>
                {tranches.map((tranche) => (
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
              value={formData.alert_time ? dayjs(formData.alert_time).format("HH:mm") : ""}
              onChange={handleTimeChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select name="alert_frequency" value={formData.alert_frequency} onChange={handleChange}>
                {frequencyOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
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
              label="Alert Start's From (Due_Date - Tranche_Day)"
              value={formData.alert_start_date || ""}
              fullWidth
              disabled
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField label="To" name="to_addr" value={formData.to_addr} onChange={handleChange} fullWidth required />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField label="CC" name="cc_addr" value={formData.cc_addr} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
          <Button variant="contained" color="warning" onClick={() => navigate(-1)}>Back</Button>
          <Button variant="contained" color="primary" type="submit">Save</Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddAlert;
