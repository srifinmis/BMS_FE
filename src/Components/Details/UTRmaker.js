// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Papa from "papaparse";
// import * as XLSX from "xlsx";
// import {
//     Paper,
//     Box, Grid, Typography, TextField, Button, MenuItem,
//     FormControlLabel, CircularProgress,
//     Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell,
//     FormControl, InputLabel, Select
// } from "@mui/material";
// import axios from "axios";

// const fieldConfig = [
//     { name: "lender_code", label: "Lender Code", type: "select", readOnly: true },
//     { name: "sanction_id", label: "Sanction Id", type: "select", readOnly: true },
//     { name: "tranche_id", label: "Tranche ID", type: "select", readOnly: true },
//     { name: "due_date", label: "Actual Due-Date", type: "date", required: true, },
//     { name: "payment_date", label: "Payment Date", type: "date", required: true },
//     { name: "payment_amount", label: "Payment Amount", type: "number", required: true },
//     // , step: "any"
//     { name: "utr_no", label: "UTR NO", type: "text", required: false, },
//     { name: "pricipal_coll", label: "Principal Amount", type: "number", required: true },
//     { name: "interest_coll", label: "Interest Amount", type: "number", required: true },
// ];

// const UTRmaker = ({ isDropped }) => {
//     const API_URL = process.env.REACT_APP_API_URL;

//     const location = useLocation();
//     const { sanction_id, lender_code, tranche_id, approval_status, createdat } = location.state;
//     const navigate = useNavigate();
//     const [sanction, setSanction] = useState(null);
//     const [sanctionIds, setSanctionIds] = useState([]);
//     const [trancheIds, setTrancheIds] = useState([]);
//     const [bulkUploadMode, setBulkUploadMode] = useState(false);
//     const [openPreview, setOpenPreview] = useState(false);
//     const [showFileUpload, setShowFileUpload] = useState(false);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [file, setFile] = useState(null);
//     const [fileData, setFileData] = useState([]);
//     const [errors, setErrors] = useState({});
//     const [formData, setFormData] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [originalLender, setOriginalLender] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [UTRType, setUTRType] = useState("UTR NO"); // Default UTR Type

//     useEffect(() => {
//         const fetchSanctionIds = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/roc/sanctionid`);
//                 if (response.data?.data) {
//                     setSanctionIds(response.data.data.map((item) => item.sanction_id));
//                 }
//             } catch (error) {
//                 console.error("Error fetching sanction IDs:", error);
//             }
//         };
//         fetchSanctionIds();
//     }, [API_URL]);

//     useEffect(() => {
//         const fetchTrancheIds = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/tranche/findTwo`);
//                 if (response.data?.data) {
//                     setTrancheIds(response.data.data.map((item) => item.tranche_id));
//                 }
//             } catch (error) {
//                 console.error("Error fetching tranche IDs:", error);
//             }
//         };
//         fetchTrancheIds();
//     }, [API_URL]);

//     useEffect(() => {
//         const fetchLenderDetails = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/UTR/details`, {
//                     params: { sanction_id, lender_code, tranche_id, approval_status, createdat },
//                 });
//                 if (response.status === 200) {
//                     setSanction(response.data.interest);
//                     setOriginalLender(response.data.interest);
//                     setFormData(response.data.interest); // Initialize formData with fetched data
//                     setUTRType(response.data.interest?.utr_no === "Notch" ? "Notch" : "UTR NO");
//                 }
//             } catch (error) {
//                 console.error("Error fetching interest rate details:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLenderDetails();
//     }, [API_URL, sanction_id, approval_status, createdat, lender_code, tranche_id]);

//     const handleEdit = () => setIsEditing(true);

//     const handleCheckboxChange = (event) => {
//         setShowFileUpload(event.target.checked);
//     };

//     const handleFileChange = (e) => {
//         const selectedFile = e.target.files[0];
//         if (!selectedFile) return;

//         setSelectedFile(selectedFile);
//         setFile(selectedFile);

//         const fileName = selectedFile.name.toLowerCase();

//         if (fileName.endsWith(".csv")) {
//             // CSV parsing using PapaParse
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 const csvText = event.target.result;
//                 Papa.parse(csvText, {
//                     header: true,
//                     skipEmptyLines: true,
//                     complete: (results) => {
//                         setFileData(results.data);
//                     },
//                     error: (err) => {
//                         console.error("CSV parsing error:", err);
//                     }
//                 });
//             };
//             reader.readAsText(selectedFile);
//         } else {
//             // Excel parsing using XLSX
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 const data = new Uint8Array(event.target.result);
//                 const workbook = XLSX.read(data, { type: "array" });
//                 const sheetName = workbook.SheetNames[0];
//                 const sheet = workbook.Sheets[sheetName];
//                 const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//                 setFileData(jsonData);
//             };
//             reader.readAsArrayBuffer(selectedFile);
//         }
//     };
//     const handleFileUploadToDB = async () => {
//         const createdby = localStorage.getItem("token");

//         // Validate required fields
//         if (!selectedFile) {
//             alert("Please select a file to upload.");
//             return;
//         }
//         if (!formData.lender_code) {
//             alert("Lender Code is required.");
//             return;
//         }
//         if (!formData.sanction_id) {
//             alert("Sanction ID is required.");
//             return;
//         }
//         if (!formData.tranche_id) {
//             alert("Tranche ID is required.");
//             return;
//         }

//         const formDataExcel = new FormData();
//         formDataExcel.append("file", selectedFile);
//         formDataExcel.append("lender_code", formData.lender_code);
//         formDataExcel.append("sanction_id", formData.sanction_id);
//         formDataExcel.append("tranche_id", formData.tranche_id);
//         formDataExcel.append("created_by", createdby);

//         console.log("FormData contents:");
//         for (let [key, value] of formDataExcel.entries()) {
//             console.log(`${key}:`, value);
//         }

//         try {
//             console.log(" FILE UPLOAD: ", formDataExcel)
//             const res = await fetch(`${API_URL}/excel/UTR/upload/file`, {
//                 method: "POST",
//                 body: formDataExcel
//             });

//             const data = await res.json();
//             alert(data.message);

//             if (!res.ok) {
//                 throw new Error(`Error UTR Upload Sent for Approval Failed!: ${res.status}`);
//             }
//             else {
//                 localStorage.setItem("submissionMessage", "UTR Upload Sent for Approval!");
//                 localStorage.setItem("messageType", "success");
//                 navigate("/DataCreation/UTRUpload");
//             }
//         } catch (err) {
//             console.error("File UTR Upload upload failed:", err);
//             alert("Upload failed.");
//         }
//     };
//     const validateForm = (dateToValidate) => {
//         const newErrors = {};

//         const validateField = (field) => {
//             const value = dateToValidate[field.name];
//             if (field.required && (!value || value.toString().trim() === "")) {
//                 newErrors[field.name] = `${field.label} is required`;
//                 return;
//             }
//             if (value && field.type === "number" && !/^\d+(\.\d+)?$/.test(value)) {
//                 newErrors[field.name] = `${field.label} must be 0 or positive number`;
//             }

//             if (value && field.minLength && value.length < field.minLength) {
//                 newErrors[field.name] = `${field.label} must be at least ${field.minLength} characters`;
//             }
//         };

//         fieldConfig.forEach(validateField);
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };


//     const handleUpdate = async (e) => {
//         // e.preventDefault();
//         if (!validateForm(sanction)) return;

//         if (validateForm(sanction)) {
//             try {
//                 const createdby = localStorage.getItem("token");
//                 const rocData = { ...sanction, createdby };
//                 console.log("data to update: ", rocData)
//                 const response = await fetch(`${API_URL}/UTR/update/${sanction.sanction_id}`, {
//                     method: "PATCH",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(rocData),
//                 });
//                 console.log("response data utr: ", response)
//                 if (response.ok) {
//                     if (response.status === 200) {
//                         alert("UTR Upload updated and sent for approval!");
//                     } else {
//                         alert("UTR Upload update failed!");
//                     }
//                 } else {
//                     const errorResponse = await response.json();
//                     alert(errorResponse.message || "Failed to update UTR Upload.");
//                 }
//                 navigate("/DataCreation/UTRUpload");
//                 setIsEditing(false);
//             } catch (error) {
//                 console.error("Error updating UTR Upload:", error);
//                 alert("Failed to update UTR Upload");
//             }
//         }
//     };

//     const handleBack = () => navigate("/DataCreation/UTRUpload");
//     const hasChanges = (current, original) => {
//         if (!current || !original) return false;
//         const currentFiltered = Object.fromEntries(
//             Object.entries(current).filter(([key]) => fieldConfig.some(field => field.name === key))
//         );
//         const originalFiltered = Object.fromEntries(
//             Object.entries(original).filter(([key]) => fieldConfig.some(field => field.name === key))
//         );
//         return JSON.stringify(currentFiltered) !== JSON.stringify(originalFiltered);
//     };

//     const handleChange = (e) => {
//         setSanction({ ...sanction, [e.target.name]: e.target.value });
//     };

//     return (
//         <Box
//             sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 flexDirection: "column",
//                 gap: 2,
//                 margin: "auto",
//                 marginTop: "70px",
//                 marginLeft: isDropped ? "100px" : "280px",
//                 transition: "margin-left 0.3s ease-in-out",
//                 width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//                 padding: 3,
//                 border: "3px solid #ccc",
//                 borderRadius: 2,
//             }}
//         >
//             <Typography
//                 sx={{
//                     color: "#0056b3",
//                     fontWeight: "600",
//                     fontSize: "20px",
//                     marginBottom: "20px",
//                     textAlign: "center",
//                     textTransform: "uppercase",
//                     letterSpacing: "1px",
//                     borderBottom: "2px solid #0056b3",
//                     paddingBottom: "10px",
//                 }}
//             >
//                 UTR Upload Update
//             </Typography>

//             {loading ? (
//                 <CircularProgress sx={{ display: "block", margin: "auto" }} />
//             ) : sanction ? (
//                 <Paper elevation={0} sx={{ padding: 3 }}>
//                     <Grid container spacing={2}>
//                         {fieldConfig.map((field) => (
//                             <Grid key={field.name} item xs={12} sm={6}>
//                                 {field.type === "select" ? (
//                                     <TextField
//                                         select
//                                         label={field.label}
//                                         name={field.name}
//                                         type={field.type}
//                                         value={sanction[field.name] || ""}
//                                         fullWidth
//                                         required={field.required}
//                                         disabled={field.readOnly}
//                                         InputLabelProps={field.type === "date" ? { shrink: true } : {}}
//                                         sx={{ backgroundColor: "#ebeced" }}
//                                     >
//                                         {(field.name === "sanction_id"
//                                             ? sanctionIds
//                                             : field.name === "tranche_id"
//                                                 ? trancheIds
//                                                 : [sanction[field.name]]).map((option) => (
//                                                     <MenuItem key={option} value={option}>
//                                                         {option}
//                                                     </MenuItem>
//                                                 ))}
//                                     </TextField>
//                                 ) : (
//                                     <TextField
//                                         label={field.label}
//                                         name={field.name}
//                                         type={field.type}
//                                         value={sanction[field.name] || ""}
//                                         fullWidth
//                                         error={!!errors[field.name]}
//                                         helperText={errors[field.name]}
//                                         required={field.required}
//                                         onChange={handleChange}
//                                         InputLabelProps={field.type === "date" ? { shrink: true } : {}}
//                                         InputProps={{ readOnly: !isEditing || field.readOnly }}
//                                         sx={{
//                                             cursor: "default",
//                                             backgroundColor: sanction.updated_fields?.includes(field.name) ? "#fcec03" : "#ebeced",
//                                             "& .MuiInputBase-root": {}
//                                         }}
//                                     />
//                                 )}
//                             </Grid>
//                         ))}
//                         <Grid item xs={12} sm={6}>
//                             <FormControl required fullWidth size="medium">
//                                 <InputLabel>UTR Type</InputLabel>
//                                 <Select
//                                     value={UTRType}
//                                     required
//                                     onChange={(e) => {
//                                         const selectedType = e.target.value;
//                                         setUTRType(selectedType);
//                                         setSanction((prev) => ({
//                                             ...prev,
//                                             utr_no: selectedType === "Notch" ? "Notch" : ""
//                                         }));
//                                     }}
//                                     label="UTR Type"
//                                 >
//                                     <MenuItem value="UTR NO">UTR NO</MenuItem>
//                                     <MenuItem value="Notch">Notch</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                         {UTRType === "UTR NO" && (
//                             <Grid item xs={12} sm={6}>
//                                 <TextField
//                                     label="UTR NO"
//                                     name="utr_no"
//                                     type="text"
//                                     value={sanction.utr_no || ""}
//                                     onChange={handleChange}
//                                     fullWidth
//                                     error={!!errors.utr_no}
//                                     helperText={errors.utr_no}
//                                 />
//                             </Grid>
//                         )}
//                     </Grid>
//                     {/* Preview Dialog */}
//                     <Dialog sx={{ display: "flex", justifyContent: "center", marginLeft: "200px" }} open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
//                         <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>Preview Uploaded Data</DialogTitle>
//                         <DialogContent>
//                             {fileData.length > 0 ? (
//                                 <Table size="small">
//                                     <TableHead>
//                                         <TableRow>
//                                             {Object.keys(fileData[0]).map((key) => (
//                                                 <TableCell key={key}>{key}</TableCell>
//                                             ))}
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {fileData.map((row, index) => (
//                                             <TableRow key={index}>
//                                                 {Object.values(row).map((cell, idx) => (
//                                                     <TableCell key={idx}>{cell}</TableCell>
//                                                 ))}
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             ) : (
//                                 <Typography>No data to display.</Typography>
//                             )}
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={() => setOpenPreview(false)}>Close</Button>
//                         </DialogActions>
//                     </Dialog>
//                     {/* File Upload Section - only visible if checkbox checked */}
//                     {showFileUpload && (
//                         <Grid xs={12}
//                             sx={{
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 // mt: 3
//                             }}
//                         >
//                             <input
//                                 type="file"
//                                 accept=".xlsx, .xls, .csv"
//                                 onChange={handleFileChange}
//                                 style={{
//                                     // marginTop: 10
//                                 }}
//                             />
//                         </Grid>
//                     )}

//                     {/* Checkbox to toggle file upload */}
//                     <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
//                         <FormControlLabel
//                             control={
//                                 <Checkbox checked={showFileUpload} onChange={handleCheckboxChange} />
//                             }
//                             label="Ignore generated schedule and Upload Excel/CSV file"
//                         />
//                         <Button
//                             variant="contained"
//                             color="secondary"
//                             onClick={() => setOpenPreview(true)}
//                             disabled={fileData.length === 0} // Disable if fileData is empty
//                         >
//                             Preview Data
//                         </Button>
//                         <Button
//                             variant="contained"
//                             color="secondary"
//                             component="a"
//                             href="/UTR Formate.xlsx"
//                             download
//                         >
//                             Download Format
//                         </Button>
//                     </Box>

//                     <Box mt={3} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//                         <Button variant="contained" color="warning" onClick={handleBack}>
//                             Back
//                         </Button>
//                         {isEditing ? (
//                             <Button variant="contained" color="primary"
//                                 //  onClick={handleUpdate} 
//                                 onClick={() => {
//                                     if (showFileUpload) {
//                                         handleFileUploadToDB();
//                                     } else {
//                                         handleUpdate();
//                                     }
//                                 }}
//                                 disabled={!hasChanges(sanction, originalLender)}>
//                                 Update
//                             </Button>
//                         ) : (
//                             <Button variant="contained" color="error" onClick={handleEdit}>
//                                 Edit
//                             </Button>
//                         )}
//                     </Box>
//                     {isEditing && !hasChanges(sanction, originalLender) && (
//                         <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
//                             Make changes to enable the Update button.
//                         </Typography>
//                     )}
//                 </Paper>
//             ) : (
//                 <Typography sx={{ textAlign: "center", marginTop: 2 }}>
//                     UTR Upload details not found
//                 </Typography>
//             )}
//         </Box>
//     );
// };

// export default UTRmaker;




import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
    Paper,
    Box, Grid, Typography, TextField, Button, MenuItem,
    FormControlLabel, CircularProgress,
    Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell,
    FormControl, InputLabel, Select
} from "@mui/material";
import axios from "axios";

const fieldConfig = [
    { name: "lender_code", label: "Lender Code", type: "select", readOnly: true },
    { name: "sanction_id", label: "Sanction Id", type: "select", readOnly: true },
    { name: "tranche_id", label: "Tranche ID", type: "select", readOnly: true },
    { name: "due_date", label: "Actual Due-Date", type: "date", required: true, },
    { name: "payment_date", label: "Payment Date", type: "date", required: true },
    { name: "payment_amount", label: "Payment Amount", type: "number", required: true },
    // , step: "any"
    // { name: "utr_no", label: "UTR NO", type: "text", required: false, },
    { name: "pricipal_coll", label: "Principal Amount", type: "number", required: true },
    { name: "interest_coll", label: "Interest Amount", type: "number", required: true },
];

const UTRmaker = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const location = useLocation();
    const { sanction_id, lender_code, tranche_id, approval_status, createdat } = location.state;
    const navigate = useNavigate();
    const [sanction, setSanction] = useState(null);
    const [sanctionIds, setSanctionIds] = useState([]);
    const [trancheIds, setTrancheIds] = useState([]);
    const [bulkUploadMode, setBulkUploadMode] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [originalLender, setOriginalLender] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [UTRType, setUTRType] = useState("UTR NO"); // Default UTR Type

    useEffect(() => {
        const fetchSanctionIds = async () => {
            try {
                const response = await axios.get(`${API_URL}/roc/sanctionid`);
                if (response.data?.data) {
                    setSanctionIds(response.data.data.map((item) => item.sanction_id));
                }
            } catch (error) {
                console.error("Error fetching sanction IDs:", error);
            }
        };
        fetchSanctionIds();
    }, [API_URL]);

    useEffect(() => {
        const fetchTrancheIds = async () => {
            try {
                const response = await axios.get(`${API_URL}/tranche/findTwo`);
                if (response.data?.data) {
                    setTrancheIds(response.data.data.map((item) => item.tranche_id));
                }
            } catch (error) {
                console.error("Error fetching tranche IDs:", error);
            }
        };
        fetchTrancheIds();
    }, [API_URL]);

    useEffect(() => {
        const fetchLenderDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/UTR/details`, {
                    params: { sanction_id, lender_code, tranche_id, approval_status, createdat },
                });
                if (response.status === 200) {
                    setSanction(response.data.interest);
                    setOriginalLender(response.data.interest);
                    setFormData(response.data.interest); // Initialize formData with fetched data
                    setUTRType(response.data.interest?.utr_no === "Notch" ? "Notch" : "UTR NO");
                }
            } catch (error) {
                console.error("Error fetching interest rate details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLenderDetails();
    }, [API_URL, sanction_id, approval_status, createdat, lender_code, tranche_id]);

    const handleEdit = () => setIsEditing(true);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setSelectedFile(selectedFile);
        setFile(selectedFile);

        const fileName = selectedFile.name.toLowerCase();

        if (fileName.endsWith(".csv")) {
            // CSV parsing using PapaParse
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvText = event.target.result;
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setFileData(results.data);
                    },
                    error: (err) => {
                        console.error("CSV parsing error:", err);
                    }
                });
            };
            reader.readAsText(selectedFile);
        } else {
            // Excel parsing using XLSX
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
                setFileData(jsonData);
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    };
    const handleFileUploadToDB = async () => {
        const createdby = localStorage.getItem("token");

        // Validate required fields
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }
        if (!formData.lender_code) {
            alert("Lender Code is required.");
            return;
        }
        if (!formData.sanction_id) {
            alert("Sanction ID is required.");
            return;
        }
        if (!formData.tranche_id) {
            alert("Tranche ID is required.");
            return;
        }

        const formDataExcel = new FormData();
        formDataExcel.append("file", selectedFile);
        formDataExcel.append("lender_code", formData.lender_code);
        formDataExcel.append("sanction_id", formData.sanction_id);
        formDataExcel.append("tranche_id", formData.tranche_id);
        formDataExcel.append("created_by", createdby);

        console.log("FormData contents:");
        for (let [key, value] of formDataExcel.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            console.log(" FILE UPLOAD: ", formDataExcel)
            const res = await fetch(`${API_URL}/excel/UTR/upload/file`, {
                method: "POST",
                body: formDataExcel
            });

            const data = await res.json();
            alert(data.message);

            if (!res.ok) {
                throw new Error(`Error UTR Upload Sent for Approval Failed!: ${res.status}`);
            }
            else {
                localStorage.setItem("submissionMessage", "UTR Upload Sent for Approval!");
                localStorage.setItem("messageType", "success");
                navigate("/DataCreation/UTRUpload");
            }
        } catch (err) {
            console.error("File UTR Upload upload failed:", err);
            alert("Upload failed.");
        }
    };
    const validateForm = (dateToValidate) => {
        const newErrors = {};

        const validateField = (field) => {
            const value = dateToValidate[field.name];
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
        };

        fieldConfig.forEach(validateField);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleUpdate = async (e) => {
        // e.preventDefault();
        if (!validateForm(sanction)) return;

        // if (validateForm(sanction)) {
        try {
            const createdby = localStorage.getItem("token");
            const rocData = { ...sanction, createdby };
            console.log("data to update: ", rocData)
            const response = await fetch(`${API_URL}/UTR/update/${sanction.sanction_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rocData),
            });
            console.log("response data utr: ", response)
            if (response.ok) {
                if (response.status === 201) {
                    alert("UTR Upload updated and sent for approval!");
                } else {
                    alert("UTR Upload update failed!");
                }
            } else {
                const errorResponse = await response.json();
                alert(errorResponse.message || "Failed to update UTR Upload.");
            }
            navigate("/DataCreation/UTRUpload");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating UTR Upload:", error);
            alert("Failed to update UTR Upload");
        }
        // }
    };

    const handleBack = () => navigate("/DataCreation/UTRUpload");
    const hasChanges = (current, original) => {
        if (!current || !original) return false;
        const currentFiltered = Object.fromEntries(
            Object.entries(current).filter(([key]) => fieldConfig.some(field => field.name === key))
        );
        const originalFiltered = Object.fromEntries(
            Object.entries(original).filter(([key]) => fieldConfig.some(field => field.name === key))
        );
        return JSON.stringify(currentFiltered) !== JSON.stringify(originalFiltered);
    };

    const handleChange = (e) => {
        setSanction({ ...sanction, [e.target.name]: e.target.value });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
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
            }}
        >
            <Typography
                sx={{
                    color: "#0056b3",
                    fontWeight: "600",
                    fontSize: "20px",
                    marginBottom: "20px",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    borderBottom: "2px solid #0056b3",
                    paddingBottom: "10px",
                }}
            >
                UTR Upload Update
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : sanction ? (
                <Paper elevation={0} sx={{ padding: 3 }}>
                    <Grid container spacing={2}>
                        {fieldConfig.map((field) => (
                            <Grid key={field.name} item xs={12} sm={6}>
                                {field.type === "select" ? (
                                    <TextField
                                        select
                                        label={field.label}
                                        name={field.name}
                                        type={field.type}
                                        value={sanction[field.name] || ""}
                                        fullWidth
                                        required={field.required}
                                        disabled={field.readOnly}
                                        InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                                        sx={{ backgroundColor: "#ebeced" }}
                                    >
                                        {(field.name === "sanction_id"
                                            ? sanctionIds
                                            : field.name === "tranche_id"
                                                ? trancheIds
                                                : [sanction[field.name]]).map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                    </TextField>
                                ) : (
                                    <TextField
                                        label={field.label}
                                        name={field.name}
                                        type={field.type}
                                        value={sanction[field.name] || ""}
                                        fullWidth
                                        error={!!errors[field.name]}
                                        helperText={errors[field.name]}
                                        required={field.required}
                                        onChange={handleChange}
                                        InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                                        InputProps={{ readOnly: !isEditing || field.readOnly }}
                                        sx={{
                                            cursor: "default",
                                            backgroundColor: sanction.updated_fields?.includes(field.name) ? "#fcec03" : "#ebeced",
                                            "& .MuiInputBase-root": {}
                                        }}
                                    />
                                )}
                            </Grid>
                        ))}
                        <Grid item xs={12} sm={6}>
                            <FormControl required fullWidth size="medium">
                                <InputLabel>UTR Type</InputLabel>
                                <Select
                                    value={UTRType}
                                    sx={{ backgroundColor: "#ebeced" }}
                                    required
                                    onChange={(e) => {
                                        const selectedType = e.target.value;
                                        setUTRType(selectedType);
                                        setSanction((prev) => ({
                                            ...prev,
                                            utr_no: selectedType === "Notch" ? "Notch" : ""
                                        }));
                                    }}
                                    label="UTR Type"
                                >
                                    <MenuItem value="UTR NO">UTR NO</MenuItem>
                                    <MenuItem value="Notch">Notch</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {UTRType === "UTR NO" && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="UTR NO"
                                    name="utr_no"
                                    type="text"
                                    value={sanction.utr_no || ""}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ backgroundColor: "#ebeced" }}
                                    error={!!errors.utr_no}
                                    helperText={errors.utr_no}
                                />
                            </Grid>
                        )}
                    </Grid>
                    {/* Preview Dialog */}
                    <Dialog sx={{ display: "flex", justifyContent: "center", marginLeft: "200px" }} open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
                        <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>Preview Uploaded Data</DialogTitle>
                        <DialogContent>
                            {fileData.length > 0 ? (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            {Object.keys(fileData[0]).map((key) => (
                                                <TableCell key={key}>{key}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fileData.map((row, index) => (
                                            <TableRow key={index}>
                                                {Object.values(row).map((cell, idx) => (
                                                    <TableCell key={idx}>{cell}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Typography>No data to display.</Typography>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenPreview(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                    {/* File Upload Section - only visible if checkbox checked */}
                    {showFileUpload && (
                        <Grid xs={12}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                // mt: 3
                            }}
                        >
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileChange}
                                style={{
                                    // marginTop: 10
                                }}
                            />
                        </Grid>
                    )}

                    <Box mt={3} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                        <Button variant="contained" color="warning" onClick={handleBack}>
                            Back
                        </Button>
                        {isEditing ? (
                            <Button variant="contained" color="primary"
                                //  onClick={handleUpdate} 
                                onClick={() => {
                                    if (showFileUpload) {
                                        handleFileUploadToDB();
                                    } else {
                                        handleUpdate();
                                    }
                                }}
                                disabled={!hasChanges(sanction, originalLender)}>
                                Update
                            </Button>
                        ) : (
                            <Button variant="contained" color="error" onClick={handleEdit}>
                                Edit
                            </Button>
                        )}
                    </Box>
                    {isEditing && !hasChanges(sanction, originalLender) && (
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
                            Make changes to enable the Update button.
                        </Typography>
                    )}
                </Paper>
            ) : (
                <Typography sx={{ textAlign: "center", marginTop: 2 }}>
                    UTR Upload details not found
                </Typography>
            )}
        </Box>
    );
};

export default UTRmaker;