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
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const approvedByOptions = ["Board", "Finance Committee"];

// const fieldConfig = [
//   { name: "lender_code", label: "Lender Code / Name", required: true, type: "dropdown", options: [] },
//   { name: "sanction_id", label: "Sanction ID", required: true, type: "dropdown", options: [] },
//   { name: "approved_by", label: "Approved By", required: true, type: "select" },
//   { name: "date_of_approval", label: "Date of Approval", required: true, type: "date" },
//   { name: "document_executed_date", label: "Document Executed Date", required: true, type: "date" },
//   { name: "due_date_charge_creation", label: "Due Date - Charge Creation", required: true, type: "date" },
//   { name: "date_of_form_filed_creation", label: "Date of Form Filed (Creation)", required: false, type: "date" },
//   { name: "due_date_satisfaction", label: "Due Date - Satisfaction", required: false, type: "date" },
//   { name: "date_of_filing_satisfaction", label: "Date of Filing (Satisfaction)", required: false, type: "date" },
// ];

// const Rocform = ({ isDropped }) => {
//   const [formData, setFormData] = useState(
//     fieldConfig.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {
//       createdby: localStorage.getItem("token") || "",
//       updatedby: localStorage.getItem("token") || "",
//     })
//   );
//   const [message, setMessage] = useState("");
//   const [sanctionIds, setSanctionIds] = useState([]);
//   const navigate = useNavigate();
//   const [lenderCodes, setLenderCodes] = useState([]);
//   const API_URL = process.env.REACT_APP_API_URL;


//   useEffect(() => {
//     const fetchSanctionIds = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/roc/sanctionid`);
//         console.log("roc lenderIds: ", response)
//         if (response.data?.data) {
//           setSanctionIds(response.data.data.map((item) => item.sanction_id));
//         } else {
//           setSanctionIds([]);
//         }
//       } catch (error) {
//         console.error("Error fetching sanction IDs:", error);
//       }
//     };
//     fetchSanctionIds();
//   }, []);
//   // console.log('Codes',lenderIds)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/sanction/lendercodes`);
//         console.log("Response lender id,name:", response.data);
//         if (response.data?.data && Array.isArray(response.data.data)) {
//           setLenderCodes(response.data.data.map((item) => ({
//             code: item.lender_code,
//             name: item.lender_name
//           })));
//         } else {
//           console.error("Invalid lender code format");
//         }
//       } catch (error) {
//         console.error("Error fetching lenders:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSelectChange = (name) => (event) => {
//     setFormData({ ...formData, [name]: event.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation: Ensure all required fields are filled
//     for (let field of fieldConfig) {
//       if (field.required && !formData[field.name]?.trim()) {
//         setMessage(`Error: ${field.label} is required ⚠️`);
//         return;
//       }
//     }

//     console.log("Form Data: ", formData);

//     try {
//       const response = await axios.post(`${API_URL}/roc/create`, formData);

//       if (response.status === 200 || response.status === 201) {
//         setMessage("ROC Form Sent to Approval ✅");
//         localStorage.setItem("submissionMessage", "ROC Form Sent to Approval!");
//         localStorage.setItem("messageType", "success");

//         // Navigate back to the previous page
//         navigate(-1);
//       } else {
//         localStorage.setItem("submissionMessage", "ROC Form Sent to Approval failed!");
//         localStorage.setItem("messageType", "success");
//         setMessage("ROC Form Sent to Approval failed! ⚠️");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setMessage("Error connecting to the server ⚠️");
//     }
//   };
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         flexDirection: "column",
//         gap: 2,
//         // width: "auto",
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
//         ROC Form
//       </Typography>
//       {message && (
//         <Typography color="error" sx={{ textAlign: "center", fontWeight: "bold" }}>
//           {message}
//         </Typography>
//       )}

//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           {fieldConfig.map((field) => (
//             <Grid item xs={12} sm={6} key={field.name}>
//               {field.type === "dropdown" ? (
//                 <FormControl fullWidth required={field.required}>
//                   <InputLabel>{field.label}</InputLabel>
//                   <Select
//                     name={field.name}
//                     value={formData[field.name] || ""}
//                     onChange={handleChange}
//                   >
//                     {field.name === "sanction_id"
//                       ? sanctionIds.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))
//                       : field.name === "lender_code"
//                         ? lenderCodes.map((option) => (
//                           <MenuItem key={option.code} value={option.code}>
//                             {option.code} - {option.name}
//                           </MenuItem>
//                         ))
//                         : field.options.map((option) => (
//                           <MenuItem key={option} value={option}>
//                             {option}
//                           </MenuItem>
//                         ))}
//                   </Select>
//                 </FormControl>
//               ) : field.type === "select" ? (
//                 <FormControl fullWidth required={field.required}>
//                   <InputLabel>{field.label}</InputLabel>
//                   <Select
//                     name={field.name}
//                     value={formData[field.name] || ""}
//                     onChange={handleSelectChange(field.name)}
//                   >
//                     {field.name === "approved_by"
//                       ? approvedByOptions.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))
//                       : <MenuItem disabled>No options available</MenuItem>}
//                   </Select>
//                 </FormControl>
//               ) : (
//                 <TextField
//                   label={field.label}
//                   name={field.name}
//                   value={formData[field.name] || ""}
//                   onChange={handleChange}
//                   fullWidth
//                   required={field.required}
//                   type={field.type}
//                   inputProps={{ maxLength: field.maxLength }}
//                   InputLabelProps={field.type === "date" ? { shrink: true } : {}}
//                 />
//               )}
//             </Grid>
//           ))}
//         </Grid>

//         {/* Buttons */}
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
//           <Button
//             variant="contained"
//             color="warning"
//             onClick={() => navigate("/DataCreation/ROCForm")} // Replace with the back route
//           >
//             Back
//           </Button>
//           <Button variant="contained" color="primary" type="submit">
//             Save
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             type="button"
//             onClick={() => setFormData(fieldConfig.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}))}
//           >
//             Reset
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   );
// };

// export default Rocform;




// new 
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Rocform = ({ isDropped }) => {
  const navigate = useNavigate();
  const [lenderCodes, setLenderCodes] = useState([]);
  const [allSanctionIds, setAllSanctionIds] = useState([]);
  const [filteredSanctionIds, setFilteredSanctionIds] = useState([]);
  const [formData, setFormData] = useState({
    lender_code: "",
    sanction_id: "",
    approved_by: "",
    date_of_approval: "",
    document_executed_date: "",
    due_date_charge_creation: "",
    date_of_form_filed_creation: "",
    due_date_satisfaction: "",
    date_of_filing_satisfaction: "",
  });
  const [combinationExists, setCombinationExists] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const approvalTypes = ["Board", "Finance Committee"];

  const fieldConfig = [
    { name: "approved_by", label: "Approved By", required: true, type: "dropdown", options: approvalTypes },
    { name: "date_of_approval", label: "Date of Approval", required: true, type: "date" },
    { name: "document_executed_date", label: "Document Executed Date", required: true, type: "date" },
    { name: "due_date_charge_creation", label: "Due Date - Charge Creation", required: true, type: "date" },
    { name: "date_of_form_filed_creation", label: "Date of Form Filed (Creation)", required: false, type: "date" },
    { name: "due_date_satisfaction", label: "Due Date - Satisfaction", required: false, type: "date" },
    { name: "date_of_filing_satisfaction", label: "Date of Filing (Satisfaction)", required: false, type: "date" },
  ];

  useEffect(() => {
    const fetchLenderCodes = async () => {
      try {
        const response = await axios.get(`${API_URL}/sanction/lendercodes`);
        setLenderCodes(
          response.data?.data.map((item) => ({
            code: item.lender_code,
            name: item.lender_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching lender codes:", error);
      }
    };

    const fetchSanctionIds = async () => {
      try {
        const response = await axios.get(`${API_URL}/roc/sanctionid`);
        setAllSanctionIds(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching sanction IDs:", error);
      }
    };

    fetchLenderCodes();
    fetchSanctionIds();
  }, [API_URL]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLenderChange = (code) => {
    setFormData((prev) => ({
      ...prev,
      lender_code: code,
      sanction_id: "",
    }));
    setErrorMessage("");
    setCombinationExists(false);

    const filtered = allSanctionIds.filter((item) => item.lender_code === code);
    setFilteredSanctionIds(filtered);
  };

  const handleSanctionChange = async (sid) => {
    setFormData((prev) => ({
      ...prev,
      sanction_id: sid,
    }));
    await checkExistingCombination(formData.lender_code, sid);
  };

  const checkExistingCombination = async (lender, sanction) => {
    try {
      const res = await axios.get(`${API_URL}/roc/validate`, {
        params: { lender_code: lender, sanction_id: sanction },
      });
      console.log("roc Validation: ", res)
      setCombinationExists(res.data.data);
      setErrorMessage(
        res.data.data
          ? "This lender_code and sanction_id combination already exists."
          : ""
      );
    } catch (err) {
      console.error("Error validating combination:", err);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (combinationExists) {
      alert("This lender_code and sanction_id combination already exists.");
      return;
    }

    const createdby = localStorage.getItem("token");
    const updatedby = localStorage.getItem("token");

    const payload = {
      ...formData,
      createdby,
      updatedby,
    };

    try {
      const res = await axios.post(`${API_URL}/roc/create`, payload);
      if (res.status === 201) {
        localStorage.setItem("submissionMessage", "ROC Data Sent to Approval!");
        localStorage.setItem("messageType", "success");
        navigate("/DataCreation/ROCForm");
      } else {
        localStorage.setItem("submissionMessage", "Submission Failed!");
        localStorage.setItem("messageType", "error");
        navigate("/DataCreation/ROCForm");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to save ROC data.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        marginTop: "70px",
        marginLeft: isDropped ? "100px" : "280px",
        transition: "margin-left 0.3s ease-in-out",
        width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
        padding: 4,
        border: "3px solid #ccc",
        borderRadius: 2,
        // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
        backgroundColor: "#fff",
      }}
    >
      <Typography sx={{
        color: "#0056b3",
        fontWeight: "600",
        fontSize: "20px",
        marginBottom: "20px",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "1px",
        borderBottom: "2px solid #0056b3",
        paddingBottom: "10px",
      }}>
        ROC Form Submission
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth size="small" required>
            <InputLabel>Lender Code / Name</InputLabel>
            <Select
              value={formData.lender_code}
              onChange={(e) => handleLenderChange(e.target.value)}
              required
            >
              {lenderCodes.map((item) => (
                <MenuItem key={item.code} value={item.code}>
                  {item.code} - {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth size="small" required error={!!errorMessage}>
            <InputLabel>Sanction ID</InputLabel>
            <Select
              value={formData.sanction_id}
              onChange={(e) => handleSanctionChange(e.target.value)}
              required
            >
              {filteredSanctionIds.map((item) => (
                <MenuItem key={item.sanction_id} value={item.sanction_id}>
                  {item.sanction_id}
                </MenuItem>
              ))}
            </Select>
            {errorMessage && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errorMessage}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {fieldConfig.map((field) => (
          <Grid item xs={6} key={field.name}>
            {field.type === "dropdown" ? (
              <FormControl fullWidth size="small" required={field.required}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  label={field.label}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                size="small"
                label={field.label}
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                required={field.required}
              />
            )}
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        <Grid item xs={2}>
          <Button variant="contained" color="warning" fullWidth onClick={() => navigate(-1)}>
            Back
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button type="submit" variant="contained" color="success" fullWidth>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Rocform;
