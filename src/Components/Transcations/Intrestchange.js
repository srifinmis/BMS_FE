import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo } from 'react';

const InterestRateChangeForm = ({ isDropped }) => {
  const navigate = useNavigate();
  const [lenderCodes, setLenderCodes] = useState([]);
  const [sanctionData, setSanctionData] = useState([]);
  const [trancheData, setTrancheData] = useState([]);
  const [date, setDate] = useState([]);
  const [interestData, setInerestData] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const API_URL = process.env.REACT_APP_API_URL;


  const fieldConfig = useMemo(() => [
    { name: "lender_code", label: "Lender Code/Lender Name", required: true, type: "dropdown", options: lenderCodes },
    {
      name: "sanction_id", label: "Sanction ID", required: true, type: "dropdown",
      options: sanctionData.filter(s => s.lender_code === formData.lender_code)
    },
    {
      name: "tranche_id", label: "Tranche ID", required: true, type: "dropdown",
      options: trancheData.filter(t => t.lender_code === formData.lender_code && t.sanction_id === formData.sanction_id)
    },
    { name: "new_interest_rate", label: "New Interest Rate(%)", required: true, type: "number" },
    { name: "effective_date", label: "Effective Date", required: true, type: "date" },
    { name: "updatedby", label: "Updated By", required: true, type: "text", minLength: 6, maxLength: 100 },
    { name: "updatedat", label: "Updated Date", required: true, type: "date" },
  ], [lenderCodes, sanctionData, trancheData, formData.lender_code, formData.sanction_id]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const initialFormData = {};
    fieldConfig.forEach((field) => {
      initialFormData[field.name] = "";
    });
    setFormData(initialFormData);
  }, []);

  useEffect(() => {
    const fetchLenders = async () => {
      try {
        const response = await axios.get(`${API_URL}/sanction/lendercodes`);
        if (response.data?.data) {
          setLenderCodes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching lenders:", error);
      }
    };

    const fetchSanctions = async () => {
      try {
        const response = await axios.get(`${API_URL}/roc/sanctionid`);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setSanctionData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching sanction IDs:", error);
      }
    };

    const fetchTranche = async () => {
      try {
        const response = await axios.get(`${API_URL}/tranche/findTwo`);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setTrancheData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tranche data:", error);
      }
    };
    const fetchinterest = async () => {
      try {
        const response = await axios.get(`${API_URL}/interest/findthree`);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setInerestData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tranche data:", error);
      }
    };

    fetchLenders();
    fetchSanctions();
    fetchTranche();
    fetchinterest();
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    let newErrors = { ...errors };

    if (name === "lender_code") {
      newFormData.sanction_id = "";
      newFormData.tranche_id = "";
      newErrors.tranche_id = "";
    }

    if (name === "sanction_id") {
      newFormData.tranche_id = "";
      newErrors.tranche_id = "";
    }

    if (name === "tranche_id") {
      const exists = interestData.some(
        (item) =>
          item.lender_code === newFormData.lender_code &&
          item.sanction_id === newFormData.sanction_id &&
          item.tranche_id === value
      );
      newErrors.tranche_id = exists ? "Tranche ID already exists for this Lender Code & Sanction ID!" : "";

      const tranche = trancheData.find(
        (t) => t.tranche_id === newFormData.tranche_id
      );
      console.log("interest start date data: ", tranche.interest_start_date)
      setDate(tranche.interest_start_date)

    }

    if (name === "effective_date") {
      // const interestStartDate = new Date(date);
      // console.log("interest start date: ", interestStartDate)
      // const effectiveDate = new Date(value);
      // if (effectiveDate <= interestStartDate) {
      //   newErrors.effective_date = `Effective Date should be after Interest Start Date (${date})!`;
      // } else {
      //   newErrors.effective_date = "";
      // }
    }

    setFormData(newFormData);
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    const validateField = (field) => {
      const value = formData[field.name];

      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }

      if (value && field.type === "number" && !/^\d+(\.\d+)?$/.test(value)) {
        newErrors[field.name] = `${field.label} must be 0 or positive number`;
      }

      if (value && field.minLength && value.length < field.minLength) {
        newErrors[field.name] = `${field.label} must be at least ${field.minLength} characters`;
      }

      if (value && field.maxLength && value.length > field.maxLength) {
        newErrors[field.name] = `${field.label} must be less than ${field.maxLength} characters`;
      }

      if (value && field.length && value.length !== field.length) {
        newErrors[field.name] = `${field.label} must be exactly ${field.length} digits`;
      }
    };
    
    fieldConfig.forEach(validateField);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (!validateForm()) return;

    const createdby = localStorage.getItem("token");

    const finalFormData = {
      ...formData,
      createdby,
    };

    const interestStartDate = new Date(date);
    // console.log("interest start date: ", interestStartDate)
    const effectiveDate = new Date(finalFormData.effective_date);
    if (effectiveDate <= interestStartDate) {
      setErrors.effective_date = `Effective Date should be after Interest Start Date (${date})!`;
      alert(`Effective Date should be after Interest Start Date (${date})!`);
      return
    } else {
      setErrors.effective_date = "";
    } 

    if (validateForm()) {
      try {
        // console.log("final frontend sending save: ", finalFormData)
        const response = await fetch(`${API_URL}/interest/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalFormData),
        });

        if (!response.ok) throw new Error(`Server Error: ${response.status}`);

        localStorage.setItem("submissionMessage", "Interest Rate Change Sent for Approval!");
        localStorage.setItem("messageType", "success");
        navigate("/DataCreation/InterestRate");
      } catch (error) {
        console.error("Error submitting interest rate change:", error);
      }
    }
  };

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
        // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Typography
        sx={{
          color: "#0056b3",
          fontWeight: "600",
          fontSize: "20px",
          textAlign: "center",
          textTransform: "uppercase",
          borderBottom: "2px solid #0056b3",
          paddingBottom: "10px",
          mb: 3,
        }}
      >
        Interest Rate Change
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {fieldConfig.map((field) => {
            const dynamicOptions = (() => {
              if (field.name === "lender_code") return lenderCodes;
              if (field.name === "sanction_id")
                return sanctionData.filter(
                  (sanction) => sanction.lender_code === formData.lender_code
                );
              if (field.name === "tranche_id")
                return trancheData.filter(
                  (tranche) => tranche.sanction_id === formData.sanction_id
                );
              return field.options || [];
            })();

            return (
              <Grid item xs={12} sm={6} key={field.name}>
                {field.type === "dropdown" ? (
                  <TextField
                    select
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    fullWidth
                    required={field.required}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                  >
                    {field.name === "lender_code" &&
                      dynamicOptions.map((lender) => (
                        <MenuItem key={lender.lender_code} value={lender.lender_code}>
                          {`${lender.lender_code} - ${lender.lender_name || lender.lender_code}`}
                        </MenuItem>
                      ))}

                    {field.name === "sanction_id" &&
                      dynamicOptions.map((sanction) => (
                        <MenuItem key={sanction.sanction_id} value={sanction.sanction_id}>
                          {sanction.sanction_id}
                        </MenuItem>
                      ))}

                    {field.name === "tranche_id" &&
                      dynamicOptions.map((tranche) => (
                        <MenuItem key={tranche.tranche_id} value={tranche.tranche_id}>
                          {tranche.tranche_id}
                        </MenuItem>
                      ))}

                    {field.name !== "lender_code" &&
                      field.name !== "sanction_id" &&
                      field.name !== "tranche_id" &&
                      dynamicOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                  </TextField>
                ) : (
                  <TextField
                    type={field.type}
                    label={field.label}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    fullWidth
                    required={field.required}
                    inputProps={field.maxLength ? { maxLength: field.maxLength } : {}}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                    InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default InterestRateChangeForm;

///1:05 before
// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Grid,
//   Box,
//   MenuItem,
//   Typography,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const InterestRateChangeForm = ({ isDropped }) => {
//   const navigate = useNavigate();
//   const [lenderCodes, setLenderCodes] = useState([]);
//   const [sanctionData, setSanctionData] = useState([]);
//   const [trancheData, setTrancheData] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({});

//   const fieldConfig = [
//     { name: "lender_code", label: "Lender Code/Lender Name", required: true, type: "dropdown", options: lenderCodes },
//     {
//       name: "sanction_id", label: "Sanction ID", required: true, type: "dropdown",
//       options: sanctionData.filter(s => s.lender_code === formData.lender_code)
//     },
//     {
//       name: "tranche_id", label: "Tranche ID", required: true, type: "dropdown",
//       options: trancheData.filter(t => t.sanction_id === formData.sanction_id)
//     },
//     { name: "new_interest_rate", label: "New Interest Rate", required: true, type: "number" },
//     { name: "effective_date", label: "Effective Date", required: true, type: "date" },
//     { name: "updatedby", label: "Updated By", required: true, type: "text" },
//     { name: "updatedat", label: "Updated Date", required: true, type: "date" },

//   ];

//   useEffect(() => {
//     const initialFormData = {};
//     fieldConfig.forEach((field) => {
//       initialFormData[field.name] = "";
//     });
//     setFormData(initialFormData);
//   }, []);

//   useEffect(() => {
//     const fetchLenders = async () => {
//       try {
//         const response = await axios.get("http://localhost:5002/api/sanction/lendercodes");
//         if (response.data?.data) {
//           setLenderCodes(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching lenders:", error);
//       }
//     };

//     const fetchSanctions = async () => {
//       try {
//         const response = await axios.get("http://localhost:5002/api/roc/sanctionid");
//         if (response.data?.data && Array.isArray(response.data.data)) {
//           setSanctionData(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching sanction IDs:", error);
//       }
//     };

//     const fetchTranche = async () => {
//       try {
//         const response = await axios.get("http://localhost:5002/api/tranche/findTwo");
//         console.log("Tranche findtwo: ", response)
//         if (response.data?.data && Array.isArray(response.data.data)) {
//           setTrancheData(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching sanction IDs:", error);
//       }
//     };

//     fetchLenders();
//     fetchSanctions();
//     fetchTranche();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let newFormData = { ...formData, [name]: value };
//     let newErrors = { ...errors };

//     if (name === "lender_code") {
//       newFormData.sanction_id = "";
//       newFormData.tranche_amount = "";
//       newErrors.tranche_amount = "";
//     }

//     if (name === "sanction_id") {
//       newFormData.tranche_amount = "";
//       newErrors.tranche_amount = "";
//     }

//     if (name === "tranche_id") {
//       const exists = trancheData.some(
//         (item) =>
//           item.sanction_id === newFormData.sanction_id &&
//           item.tranche_id === value
//       );
//       newErrors.tranche_id = exists ? "Tranche ID already exists for this Sanction ID!" : "";
//     }

//     setFormData(newFormData);
//     setErrors(newErrors);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const createdby = localStorage.getItem("token");  // Assuming token is the user ID
//     // const updatedby = localStorage.getItem("token");

//     const finalFormData = {
//       ...formData,
//       createdby,
//       // updatedby,
//     };

//     try {
//       console.log("Form data Interest: ", finalFormData)
//       const response = await fetch("http://localhost:5002/api/interest/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(finalFormData),
//       });

//       if (!response.ok) throw new Error(`Server Error: ${response.status}`);

//       localStorage.setItem("submissionMessage", "Interest Rate Change Sent for Approval!");
//       localStorage.setItem("messageType", "success");
//       navigate("/DataCreation/InterestRate");
//     } catch (error) {
//       console.error("Error submitting tranche:", error);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         flexDirection: "column",
//         gap: 2,
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
//       <Typography
//         sx={{
//           color: "#0056b3",
//           fontWeight: "600",
//           fontSize: "20px",
//           textAlign: "center",
//           textTransform: "uppercase",
//           borderBottom: "2px solid #0056b3",
//           paddingBottom: "10px",
//           mb: 3,
//         }}
//       >
//         Interest Rate Change
//       </Typography>

//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           {fieldConfig.map((field) => {
//             const dynamicOptions = (() => {
//               if (field.name === "lender_code") return lenderCodes;
//               if (field.name === "sanction_id")
//                 return sanctionData.filter(
//                   (sanction) => sanction.lender_code === formData.lender_code
//                 );
//               return field.options || [];
//             })();

//             return (
//               <Grid item xs={12} sm={6} key={field.name}>
//                 {field.type === "dropdown" ? (
//                   <TextField
//                     select
//                     label={field.label}
//                     name={field.name}
//                     value={formData[field.name] || ""}
//                     onChange={handleChange}
//                     fullWidth
//                     required={field.required}
//                     error={!!errors[field.name]}
//                     helperText={errors[field.name]}
//                   >
//                     {field.name === "lender_code" &&
//                       dynamicOptions.map((lender) => (
//                         <MenuItem key={lender.lender_code} value={lender.lender_code}>
//                           {`${lender.lender_code} - ${lender.lender_name || lender.lender_code}`}
//                         </MenuItem>
//                       ))}

//                     {field.name === "sanction_id" &&
//                       dynamicOptions.map((sanction) => (
//                         <MenuItem key={sanction.sanction_id} value={sanction.sanction_id}>
//                           {sanction.sanction_id}
//                         </MenuItem>
//                       ))}

//                     {field.name !== "lender_code" &&
//                       field.name !== "sanction_id" &&
//                       dynamicOptions.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                   </TextField>
//                 ) : (
//                   <TextField
//                     type={field.type}
//                     label={field.label}
//                     name={field.name}
//                     value={formData[field.name] || ""}
//                     onChange={handleChange}
//                     fullWidth
//                     required={field.required}
//                     inputProps={field.maxLength ? { maxLength: field.maxLength } : {}}
//                     error={!!errors[field.name]}
//                     helperText={errors[field.name]}
//                     InputLabelProps={field.type === "date" ? { shrink: true } : {}}
//                   />
//                 )}
//               </Grid>
//             );
//           })}
//         </Grid>
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//           <Button variant="contained" color="primary" type="submit">
//             Save
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   );
// };

// export default InterestRateChangeForm;


// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Grid,
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
// } from "@mui/material";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";

// const InterestRateChangeForm = ({ isDropped }) => {
//   const navigate = useNavigate();
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();
//   const [sanctionIds, setSanctionIds] = useState([]);  // List of sanction IDs
//   const [trancheIds, setTrancheIds] = useState([]);    // List of tranche IDs based on the selected sanction ID
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [selectedSanctionId, setSelectedSanctionId] = useState("");  // Track selected sanction ID

//   // Fetching the sanction tranche list when the component mounts
//   useEffect(() => {
//     const fetchSanctionIds = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5002/api/roc/sanctionid`);
//         console.log("roc sanctionids: ", response);
//         if (response.data?.data) {
//           setSanctionIds(response.data.data);  // Set the response data directly
//         } else {
//           setSanctionIds([]); // Clear sanction ids if no data returned
//         }
//       } catch (error) {
//         console.error("Error fetching sanction IDs:", error);
//       }
//     };
//     fetchSanctionIds();
//   }, []);

//   // Fetching the tranche IDs whenever a sanction ID is selected
//   useEffect(() => {
//     if (selectedSanctionId) {
//       const fetchTrancheIds = async () => {
//         try {
//           const response = await axios.get(`http://localhost:5002/api/tranche/findTwo`);
//           if (response.data?.data) {
//             const filteredTranches = response.data.data.filter(item => item.sanction_id === selectedSanctionId);
//             setTrancheIds(filteredTranches);  // Set filtered tranche IDs
//           } else {
//             setTrancheIds([]);  // Clear tranche IDs if no data returned
//           }
//         } catch (error) {
//           console.error("Error fetching tranche IDs:", error);
//         }
//       };
//       fetchTrancheIds();
//     }
//   }, [selectedSanctionId]);

//   // Handle the form submission
//   const onSubmit = async (data) => {
//     setLoading(true);
//     setMessage("");
//     console.log("intrest sending: ", data)
//     try {
//       const response = await axios.post("http://localhost:5002/api/interest/create", data);
//       if (response.status === 201) {
//         setMessage("Interest rate Sent to Approval ✅");
//         localStorage.setItem("submissionMessage", "Interest Rate Sent to Approval!");
//         localStorage.setItem("messageType", "success");
//       } else {
//         localStorage.setItem("submissionMessage", "Interest Rate Sent to Approval Failed!");
//         localStorage.setItem("messageType", "error");
//       }
//       navigate("/DataCreation/Interestrate");
//       reset(); // Reset the form
//     } catch (error) {
//       setMessage("Error updating interest rate ⚠️");
//       console.error("Error saving interest rate change", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
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
//       <Typography
//         sx={{
//           color: "#0056b3",
//           fontWeight: "600",
//           fontSize: "20px",
//           marginBottom: "20px",
//           textAlign: "center",
//           textTransform: "uppercase",
//           letterSpacing: "1px",
//           borderBottom: "2px solid #0056b3",
//           paddingBottom: "10px",
//         }}
//       >
//         Interest Rate Change
//       </Typography>

//       {message && (
//         <Typography color="error" sx={{ textAlign: "center", fontWeight: "bold" }}>
//           {message}
//         </Typography>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth required>
//               <InputLabel>Sanction ID</InputLabel>
//               <Select
//                 {...register("sanctionId", { required: "Sanction ID is required" })}
//                 value={selectedSanctionId}
//                 onChange={(e) => setSelectedSanctionId(e.target.value)}
//               >
//                 {sanctionIds.length > 0 ? (
//                   sanctionIds.map((item) => (
//                     <MenuItem key={item.sanction_id} value={item.sanction_id}>
//                       {item.sanction_id}
//                     </MenuItem>
//                   ))
//                 ) : (
//                   <MenuItem disabled>No Sanction IDs Available</MenuItem>
//                 )}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth required disabled={!selectedSanctionId}>
//               <InputLabel>Tranche ID</InputLabel>
//               <Select
//                 {...register("trancheId", { required: "Tranche ID is required" })}
//                 defaultValue=""
//               >
//                 {trancheIds.length > 0 ? (
//                   trancheIds.map((item) => (
//                     <MenuItem key={item.tranche_id} value={item.tranche_id}>
//                       {item.tranche_id}
//                     </MenuItem>
//                   ))
//                 ) : (
//                   <MenuItem disabled>No Tranche IDs Available</MenuItem>
//                 )}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               type="number"
//               fullWidth
//               label="New Interest Rate (%)"
//               {...register("newInterestRate", { required: "Required", min: { value: 0, message: "Must be positive" } })}
//               error={!!errors.newInterestRate}
//               helperText={errors.newInterestRate?.message}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               type="date"
//               fullWidth
//               label="Effective Date"
//               {...register("effectiveDate", { required: "Required" })}
//               error={!!errors.effectiveDate}
//               helperText={errors.effectiveDate?.message}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               type="date"
//               fullWidth
//               label="Updated Date"
//               {...register("updatedDate", { required: "Required" })}
//               error={!!errors.updatedDate}
//               helperText={errors.updatedDate?.message}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Updated By"
//               {...register("updatedBy", { required: "Required" })}
//               error={!!errors.updatedBy}
//               helperText={errors.updatedBy?.message}
//             />
//           </Grid>
//         </Grid>

//         <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
//           <Button variant="contained" color="warning" onClick={() => navigate(-1)}>
//             Back
//           </Button>
//           <Button type="submit" variant="contained" color="primary" disabled={loading}>
//             {loading ? "Submitting..." : "Save"}
//           </Button>
//           <Button variant="contained" color="error" onClick={() => reset()}>
//             Reset
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   );
// };

// export default InterestRateChangeForm;



