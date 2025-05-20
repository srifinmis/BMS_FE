import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
    Box, Grid, Typography, TextField, Button, MenuItem, Divider, Select, FormControlLabel, FormControl, InputLabel,
    Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UTRForm = ({ isDropped }) => {
    const navigate = useNavigate();
    const [lenderCodes, setLenderCodes] = useState([]);
    const [sanctionData, setSanctionData] = useState([]);
    const [trancheData, setTrancheData] = useState([]);
    const [UTRType, setUTRType] = useState("");
    const [interestData, setInterestData] = useState([]);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [fileData, setFileData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [file, setFile] = useState(null);

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({});
    const [fileUrls, setFileUrls] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;
    const utrTypes = ["Term Loan", "Demand Loan"];

    const [bulkUploadMode, setBulkUploadMode] = useState(false);

    const fieldConfig = useMemo(() => [
        { name: "lender_code", label: "Lender Code/Lender Name", required: true, type: "dropdown" },
        { name: "sanction_id", label: "Sanction ID", required: true, type: "dropdown" },
        { name: "tranche_id", label: "Tranche ID", required: true, type: "dropdown" },
        { name: "due_date", label: "Actual Due-Date", required: true, type: "date" },
        { name: "payment_date", label: "Payment Date", required: true, type: "date" },
        { name: "payment_amount", label: "Payment Amount", required: true, type: "number" },
        { name: "pricipal_coll", label: "Principal Amount", type: "number", required: true },
        { name: "interest_coll", label: "Interest Amount", type: "number", required: true },
    ], []);

    useEffect(() => {
        const initialFormData = {};
        fieldConfig.forEach((field) => {
            initialFormData[field.name] = "";
        });
        setFormData(initialFormData);
    }, [fieldConfig]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lenders, sanctions, tranches, interests] = await Promise.all([
                    axios.get(`${API_URL}/sanction/lendercodes`),
                    axios.get(`${API_URL}/roc/sanctionid`),
                    axios.get(`${API_URL}/tranche/findTwo`),
                    axios.get(`${API_URL}/UTR/findthree`)
                ]);
                setLenderCodes(lenders.data.data || []);
                setSanctionData(sanctions.data.data || []);
                setTrancheData(tranches.data.data || []);
                setInterestData(interests.data.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
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

        setFormData(newFormData);
        setErrors(newErrors);
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setSelectedFile(selected);
        setFile(selected);

        const fileName = selected.name.toLowerCase();
        const reader = new FileReader();

        reader.onload = (event) => {
            if (fileName.endsWith(".csv")) {
                Papa.parse(event.target.result, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => setFileData(results.data),
                    error: (err) => console.error("CSV parsing error:", err)
                });
            } else {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
                setFileData(jsonData);
            }
        };

        fileName.endsWith(".csv") ? reader.readAsText(selected) : reader.readAsArrayBuffer(selected);
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
        };
        fieldConfig.forEach(validateField);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const finalFormData = {
            ...formData,
            createdby: localStorage.getItem("token"),
            payment_upload_url: fileUrls,
            utr_type: UTRType
        };

        try {
            const response = await fetch(`${API_URL}/UTR/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalFormData),
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);
            localStorage.setItem("submissionMessage", "UTR Upload Sent for Approval!");
            localStorage.setItem("messageType", "success");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error submitting UTR Upload:", error);
        }
    };

    const handleFileUploadToDB = async () => {
        const createdby = localStorage.getItem("token");

        // if (!selectedFile || !formData.lender_code || !formData.sanction_id || !formData.tranche_id) {
        //     alert("All required fields must be selected.");
        //     return;
        // }

        const formDataExcel = new FormData();
        formDataExcel.append("file", selectedFile);
        formDataExcel.append("lender_code", formData.lender_code);
        formDataExcel.append("sanction_id", formData.sanction_id);
        formDataExcel.append("tranche_id", formData.tranche_id);
        formDataExcel.append("created_by", createdby);

        try {
            const res = await fetch(`${API_URL}/excel/UTR/upload/file`, {
                method: "POST",
                body: formDataExcel
            });

            const data = await res.json();
            alert(data.message);

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            localStorage.setItem("submissionMessage", "UTR Upload Sent for Approval!");
            localStorage.setItem("messageType", "success");
            navigate("/DataCreation/UTRUpload");

        } catch (err) {
            console.error("File upload failed:", err);
            alert("Upload failed.");
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
                UTR Upload
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" color="warning" onClick={() => setBulkUploadMode(true)}>
                    Bulk Upload
                </Button>
            </Box>

            <form>
                {!bulkUploadMode && (
                    <Grid container spacing={2}>
                        {fieldConfig.map((field) => (
                            <React.Fragment key={field.name}>
                                <Grid item xs={12} sm={6}>
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
                                                lenderCodes.map((lender) => (
                                                    <MenuItem key={lender.lender_code} value={lender.lender_code}>
                                                        {`${lender.lender_code} - ${lender.lender_name || lender.lender_code}`}
                                                    </MenuItem>
                                                ))}
                                            {field.name === "sanction_id" &&
                                                sanctionData
                                                    .filter((s) => s.lender_code === formData.lender_code)
                                                    .map((s) => (
                                                        <MenuItem key={s.sanction_id} value={s.sanction_id}>
                                                            {s.sanction_id}
                                                        </MenuItem>
                                                    ))}
                                            {field.name === "tranche_id" &&
                                                trancheData
                                                    .filter((t) => t.sanction_id === formData.sanction_id)
                                                    .map((t) => (
                                                        <MenuItem key={t.tranche_id} value={t.tranche_id}>
                                                            {t.tranche_id}
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
                                            error={!!errors[field.name]}
                                            helperText={errors[field.name]}
                                            InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                                        />
                                    )}
                                </Grid>

                                {/* 👇 Insert Document Type dropdown right after due_date */}
                                {field.name === "due_date" && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl required fullWidth size="medium">
                                                <InputLabel>UTR Type</InputLabel>
                                                <Select
                                                    value={UTRType}
                                                    required
                                                    onChange={(e) => {
                                                        const selectedType = e.target.value;
                                                        setUTRType(selectedType);

                                                        // Automatically set or clear utr_no based on selection
                                                        setFormData((prev) => ({
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
                                                    value={formData.utr_no || ""}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    error={!!errors.utr_no}
                                                    helperText={errors.utr_no}
                                                />
                                            </Grid>
                                        )}
                                    </>
                                )}

                            </React.Fragment>
                        ))}

                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                            <Button variant="contained" color="error" onClick={() => window.location.reload()}>
                                Reset
                            </Button>
                        </Grid>
                    </Grid>
                )}
                {/* BULK UPLOAD SECTION */}
                {bulkUploadMode && (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 2 }}>
                        <Grid xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
                        </Grid>

                        {/* Side-by-side Preview and Download buttons */}
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setOpenPreview(true)}
                                disabled={fileData.length === 0}
                            >
                                Preview Data
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                component="a"
                                href="/UTR Formate.xlsx"
                                download
                            >
                                Download Format
                            </Button>
                        </Box>

                        {/* Save and Reset Buttons */}
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleFileUploadToDB}
                                disabled={!selectedFile}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setFileData([]);
                                    setBulkUploadMode(false);
                                }}
                            >
                                Reset
                            </Button>
                        </Box>
                    </Box>

                )}
            </form>
            <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
                <DialogTitle>Preview Uploaded Data</DialogTitle>
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

        </Box>
    );
};

export default UTRForm;



// above is working latest code

// new code 

// import React, { useState, useEffect, useMemo } from "react";
// import Papa from "papaparse";
// import * as XLSX from "xlsx";
// import {
//     Box, Grid, Typography, TextField, Button, MenuItem, Divider, Select, FormControlLabel, FormControl, InputLabel,
//     Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UTRForm = ({ isDropped }) => {
//     const navigate = useNavigate();
//     const [lenderCodes, setLenderCodes] = useState([]);
//     const [sanctionData, setSanctionData] = useState([]);
//     const [trancheData, setTrancheData] = useState([]);
//     const [UTRType, setUTRType] = useState("");
//     const [interestData, setInterestData] = useState([]);
//     const [showFileUpload, setShowFileUpload] = useState(false);
//     const [openPreview, setOpenPreview] = useState(false);
//     const [fileData, setFileData] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [file, setFile] = useState(null);

//     const [errors, setErrors] = useState({});
//     const [formData, setFormData] = useState({});
//     const [fileUrls, setFileUrls] = useState([]);
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [isUploading, setIsUploading] = useState(false);

//     const API_URL = process.env.REACT_APP_API_URL;
//     const utrTypes = ["Term Loan", "Demand Loan"];

//     // 💡 Bulk Upload State
//     const [bulkUploadMode, setBulkUploadMode] = useState(false);

//     const fieldConfig = useMemo(() => [
//         { name: "lender_code", label: "Lender Code/Lender Name", required: true, type: "dropdown" },
//         { name: "sanction_id", label: "Sanction ID", required: true, type: "dropdown" },
//         { name: "tranche_id", label: "Tranche ID", required: true, type: "dropdown" },
//         { name: "due_date", label: "Actual Due-Date", required: true, type: "date" },
//         { name: "payment_date", label: "Payment Date", required: true, type: "date" },
//         { name: "payment_amount", label: "Payment Amount", required: true, type: "number" },
//         // { name: "utr_type", label: "UTR Type", type: "dropdown", options: utrTypes },
//         { name: "pricipal_coll", label: "Principal Amount", type: "number", required: true },
//         { name: "interest_coll", label: "Interest Amount", type: "number", required: true },
//         // { name: "due_amt", label: "Due Amount", type: "number" },
//     ], []);

//     useEffect(() => {
//         const initialFormData = {};
//         fieldConfig.forEach((field) => {
//             initialFormData[field.name] = "";
//         });
//         setFormData(initialFormData);
//     }, [fieldConfig]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [lenders, sanctions, tranches, interests] = await Promise.all([
//                     axios.get(`${API_URL}/sanction/lendercodes`),
//                     axios.get(`${API_URL}/roc/sanctionid`),
//                     axios.get(`${API_URL}/tranche/findTwo`),
//                     axios.get(`${API_URL}/UTR/findthree`)
//                 ]);
//                 setLenderCodes(lenders.data.data || []);
//                 setSanctionData(sanctions.data.data || []);
//                 setTrancheData(tranches.data.data || []);
//                 setInterestData(interests.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };
//         fetchData();
//     }, [API_URL]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         let newFormData = { ...formData, [name]: value };
//         let newErrors = { ...errors };

//         if (name === "lender_code") {
//             newFormData.sanction_id = "";
//             newFormData.tranche_id = "";
//             newErrors.tranche_id = "";
//         }

//         if (name === "sanction_id") {
//             newFormData.tranche_id = "";
//             newErrors.tranche_id = "";
//         }

//         setFormData(newFormData);
//         setErrors(newErrors);
//     };

//     const handleCheckboxChange = (event) => setShowFileUpload(event.target.checked);

//     const handleFileChange = (e) => {
//         const selected = e.target.files[0];
//         if (!selected) return;
//         setSelectedFile(selected);
//         setFile(selected);

//         const fileName = selected.name.toLowerCase();

//         const reader = new FileReader();
//         reader.onload = (event) => {
//             if (fileName.endsWith(".csv")) {
//                 Papa.parse(event.target.result, {
//                     header: true,
//                     skipEmptyLines: true,
//                     complete: (results) => setFileData(results.data),
//                     error: (err) => console.error("CSV parsing error:", err)
//                 });
//             } else {
//                 const data = new Uint8Array(event.target.result);
//                 const workbook = XLSX.read(data, { type: "array" });
//                 const sheet = workbook.Sheets[workbook.SheetNames[0]];
//                 const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//                 setFileData(jsonData);
//             }
//         };

//         fileName.endsWith(".csv") ? reader.readAsText(selected) : reader.readAsArrayBuffer(selected);
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         const validateField = (field) => {
//             const value = formData[field.name];
//             if (field.required && (!value || value.toString().trim() === "")) {
//                 newErrors[field.name] = `${field.label} is required`;
//                 return;
//             }
//             if (value && field.type === "number" && !/^\d+(\.\d+)?$/.test(value)) {
//                 newErrors[field.name] = `${field.label} must be 0 or positive number`;
//             }
//         };
//         fieldConfig.forEach(validateField);
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) return;

//         const finalFormData = {
//             ...formData,
//             createdby: localStorage.getItem("token"),
//             payment_upload_url: fileUrls,
//         };

//         try {
//             const response = await fetch(`${API_URL}/UTR/create`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(finalFormData),
//             });

//             if (!response.ok) throw new Error(`Server Error: ${response.status}`);
//             localStorage.setItem("submissionMessage", "UTR Upload Sent for Approval!");
//             localStorage.setItem("messageType", "success");
//             navigate("/dashboard");
//         } catch (error) {
//             console.error("Error submitting UTR Upload:", error);
//         }
//     };

//     const handleFileUploadToDB = async () => {
//         const createdby = localStorage.getItem("token");

//         // if (!selectedFile || !formData.lender_code || !formData.sanction_id || !formData.tranche_id) {
//         //     alert("All required fields must be selected.");
//         //     return;
//         // }

//         const formDataExcel = new FormData();
//         formDataExcel.append("file", selectedFile);
//         formDataExcel.append("lender_code", formData.lender_code);
//         formDataExcel.append("sanction_id", formData.sanction_id);
//         formDataExcel.append("tranche_id", formData.tranche_id);
//         formDataExcel.append("created_by", createdby);

//         try {
//             const res = await fetch(`${API_URL}/excel/UTR/upload/file`, {
//                 method: "POST",
//                 body: formDataExcel
//             });

//             const data = await res.json();
//             alert(data.message);

//             if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
//             localStorage.setItem("submissionMessage", "UTR Upload Sent for Approval!");
//             localStorage.setItem("messageType", "success");
//             navigate("/DataCreation/UTRUpload");

//         } catch (err) {
//             console.error("File upload failed:", err);
//             alert("Upload failed.");
//         }
//     };

//     const handleResetFiles = () => {
//         setFormData({
//             lender_code: '',
//             sanction_id: '',
//             tranche_id: '',
//             due_date: '',
//             payment_date: '',
//             payment_amount: '',
//             utr_no: '',
//         });
//         setSelectedFiles([]);
//         setFileUrls([]);
//     };

//     return (
//         <Box
//             sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 flexDirection: "column",
//                 gap: 2,
//                 marginTop: "70px",
//                 marginLeft: isDropped ? "100px" : "280px",
//                 transition: "margin-left 0.3s ease",
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
//                     textAlign: "center",
//                     textTransform: "uppercase",
//                     borderBottom: "2px solid #0056b3",
//                     paddingBottom: "10px",
//                     mb: 3,
//                 }}
//             >
//                 UTR Upload
//             </Typography>
//             {/* Top Right Bulk Upload Button */}
//             <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                 <Button variant="contained" color="warning" onClick={() => setBulkUploadMode(true)}>
//                     Bulk Upload
//                 </Button>
//             </Box>
//             <form>
//                 {!bulkUploadMode && (
//                     <Grid container spacing={2}>
//                         {/* <Grid item xs={6}>
//                             <FormControl required fullWidth size="small">
//                                 <InputLabel>Document Type</InputLabel>
//                                 <Select value={UTRType} onChange={(e) => setUTRType(e.target.value)}>
//                                     <MenuItem value="UTR NO">UTR NO</MenuItem>
//                                     <MenuItem value="Notch">Notch</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </Grid> */}
//                         {fieldConfig.map((field) => (
//                             <Grid item xs={12} sm={6} key={field.name}>
//                                 {field.type === "dropdown" ? (
//                                     <TextField
//                                         select
//                                         label={field.label}
//                                         name={field.name}
//                                         value={formData[field.name] || ""}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         required={field.required}
//                                         error={!!errors[field.name]}
//                                         helperText={errors[field.name]}
//                                     >
//                                         {field.name === "lender_code" &&
//                                             lenderCodes.map((lender) => (
//                                                 <MenuItem key={lender.lender_code} value={lender.lender_code}>
//                                                     {`${lender.lender_code} - ${lender.lender_name || lender.lender_code}`}
//                                                 </MenuItem>
//                                             ))}
//                                         {field.name === "sanction_id" &&
//                                             sanctionData
//                                                 .filter((s) => s.lender_code === formData.lender_code)
//                                                 .map((s) => (
//                                                     <MenuItem key={s.sanction_id} value={s.sanction_id}>
//                                                         {s.sanction_id}
//                                                     </MenuItem>
//                                                 ))}
//                                         {field.name === "tranche_id" &&
//                                             trancheData
//                                                 .filter((t) => t.sanction_id === formData.sanction_id)
//                                                 .map((t) => (
//                                                     <MenuItem key={t.tranche_id} value={t.tranche_id}>
//                                                         {t.tranche_id}
//                                                     </MenuItem>
//                                                 ))}
//                                     </TextField>
//                                 ) : (
//                                     <TextField
//                                         type={field.type}
//                                         label={field.label}
//                                         name={field.name}
//                                         value={formData[field.name] || ""}
//                                         onChange={handleChange}
//                                         fullWidth
//                                         required={field.required}
//                                         error={!!errors[field.name]}
//                                         helperText={errors[field.name]}
//                                         InputLabelProps={field.type === "date" ? { shrink: true } : {}}
//                                     />
//                                 )}
//                             </Grid>
//                         ))}
//                         {/* </Grid> */}
//                         {/* <Grid> */}
//                         {/* <Box mt={3} sx={{ display: "flex", justifyContent: "center", gap: 2 }}> */}
//                         <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
//                             <Button
//                                 type="button"
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={() => {
//                                     if (showFileUpload) handleFileUploadToDB();
//                                     else handleSubmit();
//                                 }}
//                             >
//                                 Submit
//                             </Button>
//                             <Button variant="contained" color="error" onClick={handleResetFiles}>
//                                 Reset
//                             </Button>
//                         </Grid>
//                     </Grid>
//                 )}

//                 {/* BULK UPLOAD SECTION */}
//                 {bulkUploadMode && (
//                     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 2 }}>
//                         <Grid xs={12} sx={{ display: "flex", justifyContent: "center" }}>
//                             <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
//                         </Grid>

//                         {/* Side-by-side Preview and Download buttons */}
//                         <Box sx={{ display: "flex", gap: 2 }}>
//                             <Button
//                                 variant="contained"
//                                 color="secondary"
//                                 onClick={() => setOpenPreview(true)}
//                                 disabled={fileData.length === 0}
//                             >
//                                 Preview Data
//                             </Button>
//                             <Button
//                                 variant="contained"
//                                 color="secondary"
//                                 component="a"
//                                 href="/UTR Formate.xlsx"
//                                 download
//                             >
//                                 Download Format
//                             </Button>
//                         </Box>

//                         {/* Save and Reset Buttons */}
//                         <Box sx={{ display: "flex", gap: 2 }}>
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handleFileUploadToDB}
//                                 disabled={!selectedFile}
//                             >
//                                 Save
//                             </Button>
//                             <Button
//                                 variant="contained"
//                                 color="error"
//                                 onClick={() => {
//                                     setSelectedFile(null);
//                                     setFileData([]);
//                                     setBulkUploadMode(false);
//                                 }}
//                             >
//                                 Reset
//                             </Button>
//                         </Box>
//                     </Box>

//                 )}
//             </form>

//             <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
//                 <DialogTitle>Preview Uploaded Data</DialogTitle>
//                 <DialogContent>
//                     {fileData.length > 0 ? (
//                         <Table size="small">
//                             <TableHead>
//                                 <TableRow>
//                                     {Object.keys(fileData[0]).map((key) => (
//                                         <TableCell key={key}>{key}</TableCell>
//                                     ))}
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {fileData.map((row, index) => (
//                                     <TableRow key={index}>
//                                         {Object.values(row).map((cell, idx) => (
//                                             <TableCell key={idx}>{cell}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     ) : (
//                         <Typography>No data to display.</Typography>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenPreview(false)}>Close</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default UTRForm;
