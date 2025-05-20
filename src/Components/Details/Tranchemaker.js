// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Box, Grid, Typography, TextField, Button, MenuItem, Divider, FormControlLabel, Checkbox, Dialog, CircularProgress, Paper, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

// import axios from "axios";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";
// const loanTypes = ["EMI", "NON-EMI", "BROKERN-EMI", "QUARTERLY-REPORT", "PRINCIPLE-MONTHLY", "BULLET"];
// const fileTypes = [".csv", ".xlsx"];

// const Tranchemaker = ({ isDropped }) => {
//   const API_URL = process.env.REACT_APP_API_URL;

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { lender_code, sanction_id, id, tranche_id, approval_status, updatedat } = location.state || {};
//   const [sanction, setSanction] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({});
//   const [sanctionamount, setSanctionamount] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [originalLender, setOriginalLender] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [sanctionIds, setSanctionIds] = useState([]);
//   const [sanctionData, setSanctionData] = useState([]);
//   const [newErrors, setNewErrors] = useState({});
//   const [showFileUpload, setShowFileUpload] = useState(false);
//   const [openPreview, setOpenPreview] = useState(false);
//   const [fileData, setFileData] = useState([]);
//   const [file, setFile] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isScheduleGenerated, setIsScheduleGenerated] = useState(false);
//   const [revised_tranche_date, setrevised_tranche_date] = useState(null);
//   const [revised_tranche_amount, setrevised_tranche_amount] = useState(null);
//   const [revised_intrest_rate, setrevised_intrest_rate] = useState(null);
//   const [revised_tenure_months, setrevised_tenure_months] = useState(null);
//   const [paid_months, setpaid_months] = useState(null);
//   let trancheData = null;

//   useEffect(() => {
//     const fetchSanctionIds = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/roc/sanctionid`);
//         // console.log("sanction api: ", response)
//         if (response.data?.data) {
//           setSanctionIds(response.data.data.map((item) => item.sanction_id));
//           const sanctionMap = {};
//           response.data.data.forEach((item) => {
//             sanctionMap[item.sanction_id] = item.sanction_amount;
//           });
//           setSanctionamount(sanctionMap);

//         }
//       } catch (error) {
//         console.error("Error fetching sanction IDs:", error);
//       }
//     };
//     fetchSanctionIds();
//   }, [API_URL]);

//   useEffect(() => {
//     const fetchSanctionDetails = async () => {
//       try {
//         console.log("tranche params: ", lender_code, id, sanction_id, tranche_id, approval_status, updatedat)
//         const response = await axios.get(`${API_URL}/tranche/details`, {
//           params: { lender_code, id, sanction_id, tranche_id, approval_status, updatedat },
//         });
//         console.log("Previous response details trhache maker: ", response)
//         console.log("tranche lendercode: ", response.data.tranche.lender_code)
//         if (response.status === 200) {
//           const fetchedTranche = {
//             ...response.data.tranche,
//             loan_type: response.data.repayment_type || "", // Map repayment_type to loan_type
//           };
//           setSanction(fetchedTranche);
//           setOriginalLender(fetchedTranche);
//         }
//       } catch (error) {
//         console.error("Error fetching tranche details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSanctionDetails();
//   }, [API_URL, tranche_id, approval_status, lender_code, sanction_id, updatedat]);

//   const loanType = sanction?.loan_type || "";
//   // console.log("loan type: ", loanType)


//   const fieldConfig = useMemo(() => {
//     const baseFields = [
//       { name: "lender_code", label: "Lender Code", type: "text", readOnly: true },
//       { name: "sanction_id", label: "Sanction ID", required: true, type: "select", options: [] },
//       { name: "tranche_id", label: "Tranche Id", type: "text", required: true, readOnly: true },
//       { name: "tranche_date", label: "Tranche Date", type: "date", required: true },
//       { name: "tranche_number", label: "Tranche Number", type: "number", required: true },
//       { name: "tranche_amount", label: "Tranche Amount", type: "number", readOnly: true },
//       { name: "interest_type", label: "Interest Type", type: "select", required: true, options: ["Fixed", "Floating"] },
//       { name: "interest_rate", label: "Interest Rate", type: "number", required: true },
//       { name: "tenure_months", label: "Tenure Months", type: "number", required: true },
//       { name: "principal_start_date", label: "Principle Start Date", type: "date", required: true },
//       { name: "interest_start_date", label: "Interest Start Date", type: "date", required: true },
//       { name: "principal_payment_frequency", label: "Principal Payment Frequency", required: true, type: "select", options: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"] },
//       { name: "interest_payment_frequency", label: "Interest Payment Frequency", required: true, type: "select", options: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"] },
//       { name: "applicable_of_leap_year", label: "Applicable for Leap Year", required: true, type: "select", options: ["Yes", "No"] },
//       { name: "interest_calculation_days", label: "Interest Calculation Days", required: true, type: "select", options: ["360", "365", "366"] },
//       {
//         name: "input_file_format",
//         label: "Input File Format",
//         required: true,
//         type: "select",
//         options: fileTypes
//       },
//       { name: "loan_type", label: "Loan Type", required: true, type: "select", options: ["EMI", "NON-EMI", "QUARTERLY-REPORT", "PRINCIPLE-MONTHLY", "BULLET", "BROKERN-EMI"] },
//       { name: "current_ac_no", label: "Current A/C No", required: true, type: "number" },
//       { name: "conf_acc_no", label: "Confirm A/C No", required: true, type: "number" },
//       { name: "bank_name", label: "Name of the Bank", required: true, type: "text" },
//       { name: "bank_branch", label: "Bank Branch", required: true, type: "text" },
//       { name: "location", label: "Location", required: true, type: "text" },
//       { name: "ifsc_code", label: "IFSC Code", required: true, type: "text" },
//     ];

//     const brokerFields = loanType === "BROKERN-EMI"
//       ? [
//         { name: "moratorium_start_date", label: "Moratorium Start Date", required: true, type: "date" },
//         { name: "moratorium_end_date", label: "Moratorium End Date", required: true, type: "date" },
//       ]
//       : [];

//     return [...baseFields, ...brokerFields];
//   }, [loanType, fileTypes]);


//   const handleTrancheAmountChange = async (sanction_id, lender_code, tranche_id) => {
//     if (!sanction_id || !lender_code) return 0;
//     const flag = 1;
//     try {
//       const response = await fetch(`${API_URL}/excel/tranche_sum`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ sanction_id, lender_code, tranche_id, flag }),
//       });

//       const result = await response.json();
//       console.log("Tranche API success:", result);
//       return result; // ✅ return the parsed result
//     } catch (error) {
//       console.error("Tranche API error:", error);
//       return 0; // ✅ return fallback
//     }
//   };
//   useEffect(() => {
//     const fetchSanctions = async () => {
//       if (!sanction || !sanction.lender_code) return;

//       try {
//         const response = await axios.get(`${API_URL}/roc/sanctionid`, {
//           params: { lender_code: sanction.lender_code },
//         });
//         if (response.data?.data) {
//           setSanctionData(response.data.data);
//           console.log("inside sanction " + JSON.stringify(response.data.data));
//         }
//       } catch (error) {
//         console.error("Error fetching sanction IDs:", error);
//       }
//     };

//     fetchSanctions();
//   }, [sanction?.lender_code]);

//   useEffect(() => {
//     if (!sanction || !sanction.sanction_id || !sanction.lender_code || !sanction.tranche_id) return;

//     const fetchTenureAndTranche = async () => {
//       const body = {
//         sanction_id: sanction.sanction_id,
//         lender_code: sanction.lender_code,
//         tranche_id: sanction.tranche_id
//       };

//       try {
//         const tenure_response = await fetch(`${API_URL}/excel/getTenureMonths`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         });

//         let tenureData = null;
//         if (tenure_response.ok) {
//           tenureData = await tenure_response.json();
//         } else {
//           console.error(`Tenure API failed with status ${tenure_response.status}`);
//         }

//         const tranche_response = await fetch(`${API_URL}/excel/get_tranche_payments`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         });

//         if (tranche_response.ok) {
//           trancheData = await tranche_response.json();
//           console.log("tranche resp api: ", trancheData)
//           setpaid_months(trancheData?.count);

//           setrevised_tranche_date(trancheData?.revised_tranche_date);
//           setrevised_tranche_amount(trancheData?.outstanding_amount);
//         } else {
//           console.error(`Tranche API failed with status ${tranche_response.status}`);
//         }

//         if (tenureData && trancheData) {
//           setrevised_tenure_months(tenureData.tenure_months - (trancheData.count || 0));
//         }

//         console.log("setting interest_rate: ", sanction.interest_rate);
//         setrevised_intrest_rate(sanction.interest_rate);

//       } catch (error) {
//         console.error("Error fetching tenure/tranche data:", error);
//       }
//     };

//     fetchTenureAndTranche();
//   }, [sanction]);

//   const hasChanges = (current, original) => {
//     if (!current || !original) return false;
//     return JSON.stringify(current) !== JSON.stringify(original);
//   };

//   const handleCheckboxChange = (event) => {
//     setShowFileUpload(event.target.checked);
//   };
//   const validateForm = () => {
//     const newErrors = {};

//     fieldConfig.forEach((field) => {
//       const value = formData[field.name];

//       // Required field check with 
//       if (field.required) {
//         if (
//           value === undefined ||
//           value === null ||
//           (typeof value === "string" && value.trim() === "") ||
//           (field.type === "dropdown" && value === "")
//         ) {
//           newErrors[field.name] = `${field.label} is required`;
//           return;
//         }
//       }

//       // Length checks
//       if (field.maxLength && value && value.length > field.maxLength) {
//         newErrors[field.name] = `${field.label} should not exceed ${field.maxLength} characters`;
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };



//   const handleEdit = () => {
//     setIsEditing(true);
//     // setSanction({ ...sanction }); // Ensure you preserve all keys
//   };

//   const handleFileUploadToDB = async () => {
//     const createdby = localStorage.getItem("token");
//     if (!validateForm()) return;

//     // Validate required fields
//     if (!selectedFile) {
//       alert("Please select a file to upload.");
//       return;
//     } else {

//     }
//     if (!sanction.lender_code) {
//       alert("Lender Code is required.");
//       return;
//     }
//     if (!sanction.sanction_id) {
//       alert("Sanction ID is required.");
//       return;
//     }
//     if (!sanction.tranche_id) {
//       alert("Tranche ID is required.");
//       return;
//     }
//     if (!sanction.tranche_date) {
//       alert("Tranche Date is required.");
//       return;
//     }
//     if (!sanction.tranche_number) {
//       alert("Tranche Number is required.");
//       return;
//     }
//     // if (!sanction.moratorium_start_date) {
//     //   alert("moratorium Start Date is required.");
//     //   return;
//     // }
//     // if (!sanction.moratorium_end_date) {
//     //   alert("moratorium End Date is required.");
//     //   return;
//     // }
//     if (!sanction.tranche_amount) {
//       alert("moratorium Start Date is required.");
//       return;
//     }
//     if (!sanction.interest_type) {
//       alert("Interest Type is required.");
//       return;
//     }
//     if (!sanction.interest_rate) {
//       alert("Interest Rate is required.");
//       return;
//     }
//     if (!sanction.tenure_months || sanction.tenure_months === "") {
//       alert("Tenure (in months) is required.");
//       return;
//     }

//     if (!sanction.principal_start_date || sanction.principal_start_date === "") {
//       alert("Principal Start Date is required.");
//       return;
//     }

//     if (!sanction.interest_start_date || sanction.interest_start_date === "") {
//       alert("Interest Start Date is required.");
//       return;
//     }

//     if (!sanction.principal_payment_frequency || sanction.principal_payment_frequency === "") {
//       alert("Principal Payment Frequency is required.");
//       return;
//     }

//     if (!sanction.interest_payment_frequency || sanction.interest_payment_frequency === "") {
//       alert("Interest Payment Frequency is required.");
//       return;
//     }

//     if (sanction.applicable_of_leap_year === undefined || sanction.applicable_of_leap_year === "") {
//       alert("Applicable of Leap Year selection is required.");
//       return;
//     }

//     if (!sanction.interest_calculation_days || sanction.interest_calculation_days === "") {
//       alert("Interest Calculation Days is required.");
//       return;
//     }

//     // if (!sanction.input_file_format || sanction.input_file_format === "") {
//     //   alert("Input File Format is required.");
//     //   return;
//     // }

//     if (!sanction.loan_type) {
//       alert("Loan Type is required.");
//       return;
//     }
//     // bank 
//     if (!sanction.current_ac_no || sanction.current_ac_no.trim() === "") {
//       alert("Current A/C No is required.");
//       return;
//     }
//     if (sanction.current_ac_no.length < 12) {
//       alert("Current A/C No must be at least 12 characters.");
//       return;
//     }

//     if (!sanction.conf_acc_no || sanction.conf_acc_no.trim() === "") {
//       alert("Confirm A/C No is required.");
//       return;
//     }
//     if (sanction.conf_acc_no.length < 12) {
//       alert("Confirm A/C No must be at least 12 characters.");
//       return;
//     }
//     if (sanction.current_ac_no !== sanction.conf_acc_no) {
//       alert("Current A/C No and Confirm A/C No must match.");
//       return;
//     }

//     if (!sanction.bank_name || sanction.bank_name.trim() === "") {
//       alert("Name of the Bank is required.");
//       return;
//     }
//     if (sanction.bank_name.length < 6) {
//       alert("Name of the Bank must be at least 6 characters.");
//       return;
//     }

//     if (!sanction.bank_branch || sanction.bank_branch.trim() === "") {
//       alert("Bank Branch is required.");
//       return;
//     }
//     if (sanction.bank_branch.length < 6) {
//       alert("Bank Branch must be at least 6 characters.");
//       return;
//     }

//     if (!sanction.location || sanction.location.trim() === "") {
//       alert("Location is required.");
//       return;
//     }
//     if (sanction.location.length < 6) {
//       alert("Location must be at least 6 characters.");
//       return;
//     }

//     if (!sanction.ifsc_code || sanction.ifsc_code.trim() === "") {
//       alert("IFSC Code is required.");
//       return;
//     }
//     const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//     if (!ifscRegex.test(sanction.ifsc_code.trim().toUpperCase())) {
//       alert("Invalid IFSC Code format.");
//       return;
//     }


//     const formDataExcel = new FormData();
//     formDataExcel.append("file", selectedFile);
//     formDataExcel.append("lender_code", sanction.lender_code);
//     formDataExcel.append("sanction_id", sanction.sanction_id);
//     formDataExcel.append("tranche_id", sanction.tranche_id);
//     formDataExcel.append("tranche_date", sanction.tranche_date);
//     formDataExcel.append("tranche_number", sanction.tranche_number);
//     formDataExcel.append("moratorium_start_date", sanction.moratorium_start_date);
//     formDataExcel.append("moratorium_end_date", sanction.moratorium_end_date);
//     formDataExcel.append("tranche_amount", sanction.tranche_amount);
//     formDataExcel.append("interest_type", sanction.interest_type);
//     formDataExcel.append("interest_rate", sanction.interest_rate);
//     formDataExcel.append("tenure_months", sanction.tenure_months);
//     formDataExcel.append("principal_start_date", sanction.principal_start_date);
//     formDataExcel.append("interest_start_date", sanction.interest_start_date);
//     formDataExcel.append("principal_payment_frequency", sanction.principal_payment_frequency);
//     formDataExcel.append("interest_payment_frequency", sanction.interest_payment_frequency);
//     formDataExcel.append("applicable_of_leap_year", sanction.applicable_of_leap_year);
//     formDataExcel.append("interest_calculation_days", sanction.interest_calculation_days);
//     formDataExcel.append("input_file_format", sanction.input_file_format);
//     formDataExcel.append("loan_type", sanction.loan_type);
//     // bank append
//     formDataExcel.append("current_ac_no", sanction.current_ac_no);
//     formDataExcel.append("conf_acc_no", sanction.conf_acc_no);
//     formDataExcel.append("bank_name", sanction.bank_name);
//     formDataExcel.append("bank_branch", sanction.bank_branch);
//     formDataExcel.append("location", sanction.location);
//     formDataExcel.append("ifsc_code", sanction.ifsc_code.trim().toUpperCase());
//     formDataExcel.append("created_by", createdby);

//     console.log("FormData contents:");
//     for (let [key, value] of formDataExcel.entries()) {
//       console.log(`${key}:`, value);
//     }

//     try {
//       console.log(" FILE UPLOAD: ", formDataExcel)

//       const finalFormData = {
//         ...sanction,
//         createdby: createdby
//       }
//       // tranche create

//       console.log("File Upload tranche Update: ", finalFormData)
//       const response = await fetch(`${API_URL}/tranche/update/${sanction.tranche_id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(finalFormData),
//       });

//       if (response.ok && response.status === 201) {
//         // alert("Tranche Details updated Sent to Approval!");
//         const res = await fetch(`${API_URL}/excel/upload/file`, {
//           method: "POST",
//           body: formDataExcel
//         });

//         const data = await res.json();
//         // alert(data.message);
//         if (res.ok) {
//           alert("Tranche Details updated Sent to Approval!");
//         } else {
//           console.log("excel upload failed: ", data.message)
//           alert(data.message);
//         }
//       } else if (response.ok) {
//         alert("Tranche Details updated Sent to Approval Failed!");
//       } else {
//         const errorResponse = await response.json();
//         alert(errorResponse.message);
//         return;
//       }


//     } catch (err) {
//       console.error("File upload failed:", err);
//       alert("Upload failed.");
//     }
//   };

//   const handleUpload = async (e) => {
//     // e.preventDefault(); // You may want to keep this if it's a form submission.
//     if (!validateForm()) return;
//     try {
//       const token = localStorage.getItem("token");

//       const finalFormData = {
//         ...sanction,
//         createdby: token,
//         updatedby: token,
//         flag: 1
//       };

//       if (finalFormData.current_ac_no !== finalFormData.conf_acc_no) {
//         alert("Current A/C No and Confirm A/C No must match.");
//         return;
//       }

//       const maxAmount = sanctionamount?.[finalFormData.sanction_id];
//       if (Number(finalFormData.tranche_amount) > Number(maxAmount)) {
//         alert("Tranche Amount should not exceed the Sanction Amount.");
//         return;
//       }

//       console.log("maker payload: ", finalFormData)


//       const response = await fetch(`${API_URL}/tranche/update/${sanction.tranche_id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(finalFormData),
//       });

//       if (response.ok && response.status === 201) {
//         // alert("Tranche Details updated Sent to Approval!");
//         try {
//           const uploadResponse = await fetch(`${API_URL}/excel/upload_schedule`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ finalFormData }),
//           });

//           const uploadResult = await uploadResponse.json();

//           if (!uploadResponse.ok) {
//             console.error("Upload failed:", uploadResult.message);
//             alert("Upload failed: " + uploadResult.message);
//             return;
//           } else {
//             alert("Tranche Details updated Sent to Approval!");
//           }
//         } catch (error) {
//           console.error("Error uploading:", error);
//           alert("An error occurred during upload.");
//           return;
//         }
//       } else if (response.ok) {
//         alert("Tranche Details updated Sent to Approval Failed!");
//       } else {
//         const errorResponse = await response.json();
//         alert(errorResponse.message);
//         return;
//       }

//       navigate("/DataCreation/TrancheDetails");
//       setIsEditing(false);
//       setIsScheduleGenerated(false);
//     } catch (error) {
//       console.error("Error updating tranche details:", error);
//       alert("Failed to update tranche details");
//     }
//   };


//   const handleUpdate = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const finalFormData = {
//         ...sanction,
//         createdby: token,
//         updatedby: token,
//         flag: 1
//       };

//       if (finalFormData.current_ac_no !== finalFormData.conf_acc_no) {
//         alert("Current A/C No and Confirm A/C No must match.");
//         return;
//       }

//       const maxAmount = sanctionamount?.[finalFormData.sanction_id];
//       if (Number(finalFormData.tranche_amount) > Number(maxAmount)) {
//         alert("Tranche Amount should not exceed the Sanction Amount.");
//         return;
//       }

//       console.log("maker payload: ", finalFormData)

//       try {
//         const uploadResponse = await fetch(`${API_URL}/excel/upload_schedule`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ finalFormData }),
//         });

//         const uploadResult = await uploadResponse.json();

//         if (!uploadResponse.ok) {
//           console.error("Upload failed:", uploadResult.message);
//           alert("Upload failed: " + uploadResult.message);
//           return;
//         } else {
//           alert("Upload successful!");
//         }
//       } catch (error) {
//         console.error("Error uploading:", error);
//         alert("An error occurred during upload.");
//         return;
//       }

//       const response = await fetch(`${API_URL}/tranche/update/${sanction.tranche_id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(finalFormData),
//       });

//       if (response.ok && response.status === 201) {
//         alert("Tranche Details updated Sent to Approval!");
//       } else if (response.ok) {
//         alert("Tranche Details updated Sent to Approval Failed!");
//       } else {
//         const errorResponse = await response.json();
//         alert(errorResponse.message);
//         return;
//       }

//       navigate("/DataCreation/TrancheDetails");
//       setIsEditing(false);
//       setIsScheduleGenerated(false);
//     } catch (error) {
//       console.error("Error updating tranche details:", error);
//       alert("Failed to update tranche details");
//     }
//   };
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     setSelectedFile(selectedFile);
//     setFile(selectedFile);

//     const fileName = selectedFile.name.toLowerCase();

//     if (fileName.endsWith(".csv")) {
//       // CSV parsing using PapaParse
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const csvText = event.target.result;
//         Papa.parse(csvText, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (results) => {
//             setFileData(results.data);
//           },
//           error: (err) => {
//             console.error("CSV parsing error:", err);
//           }
//         });
//       };
//       reader.readAsText(selectedFile);
//     } else {
//       // Excel parsing using XLSX
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const data = new Uint8Array(event.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//         setFileData(jsonData);
//       };
//       reader.readAsArrayBuffer(selectedFile);
//     }
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     const date = new Date(dateStr);
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = date.toLocaleString("en-US", { month: "short" });
//     const year = date.getFullYear().toString().slice(-2);
//     return `${day}-${month}-${year}`;
//   };
//   const handleBack = () => navigate("/DataCreation/TrancheDetails");
//   const handleGenerate = async (e) => {
//     try {
//       let url = "";
//       switch (sanction.loan_type) {
//         case "NON-EMI":
//           url = `${API_URL}/excel/generate-nonemi-schedule`;
//           break;
//         case "EMI":
//           url = `${API_URL}/excel/generate-emi-schedule`;
//           break;
//         case "QUARTERLY-REPORT":
//           url = `${API_URL}/excel/generate-quarterly-report`;
//           break;
//         case "PRINCIPLE-MONTHLY":
//           url = `${API_URL}/excel/generate-princ_monthly-report`;
//           break;
//         case "BULLET":
//           url = `${API_URL}/excel/loan-schedule/bullet`;
//           break;
//         case "BROKERN-EMI":
//           url = `${API_URL}/excel/generate-broken-emi`;
//           break;
//         default:
//           throw new Error("Invalid loan type");
//       }
//       const createdby = localStorage.getItem("token");
//       // console.log("generate data call: ", sanction)
//       // sanction.interest_rate = revised_intrest_rate;
//       const temp_tranche_date = sanction.tranche_date;
//       const temp_tenure_months = sanction.tenure_months;
//       sanction.tranche_date = revised_tranche_date ? formatDate(revised_tranche_date) : sanction.tranche_date;
//       console.log("date. revised date: ", sanction.tranche_date, " : ", trancheData)
//       sanction.tenure_months = revised_tenure_months;
//       sanction.tranche_amount = revised_tranche_amount;

//       const body = {
//         ...sanction,
//         original_tranche_date: formatDate(temp_tranche_date),
//         // original_interest_rate:sanction.interest_rate,
//         paid_months: paid_months,
//         principal_start_date: formatDate(sanction.principal_start_date),
//         interest_start_date: formatDate(sanction.interest_start_date),
//         created_by: createdby,
//         flag: 1
//       };

//       // Add moratorium dates if loan type is BROKERN-EMI
//       if (sanction.loan_type === "BROKERN-EMI") {
//         body.moratorium_start_date = formatDate(sanction.moratorium_start_date);
//         body.moratorium_end_date = formatDate(sanction.moratorium_end_date);
//         if (!sanction.moratorium_start_date) {
//           alert("moratorium Start Date is required.");
//           return;
//         }
//         if (!sanction.moratorium_end_date) {
//           alert("moratorium End Date is required.");
//           return;
//         }
//         if (sanction.moratorium_start_date && sanction.moratorium_end_date) {
//           if (new Date(sanction.moratorium_end_date) <= new Date(sanction.moratorium_start_date)) {
//             alert("Moratorium End Date must be greater than Start Date.");
//             newErrors.moratorium = "Moratorium End Date must be greater than Start Date";
//             return;
//           } else {
//             delete newErrors.moratorium;
//             // return;
//           }
//         } else {
//           delete newErrors.moratorium; // Don't show error if one is missing
//         }
//       }
//       console.log("bodyy " + JSON.stringify(body));
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });

//       if (!response.ok) {
//         throw new Error(`Server Error: ${response.status}`);
//       }
//       sanction.tranche_date = temp_tranche_date;
//       sanction.tenure_months = temp_tenure_months;
//       const blob = await response.blob();
//       const contentDisposition = response.headers.get("Content-Disposition");
//       const contentType = response.headers.get("Content-Type");

//       let extension = ".xlsx";
//       if (contentType === "text/csv") extension = ".csv";
//       else if (contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") extension = ".xlsx";

//       let filename = "Loan_Schedule" + extension;
//       if (contentDisposition && contentDisposition.includes("filename=")) {
//         const match = contentDisposition.match(/filename="?(.+?)"?$/);
//         if (match && match[1]) {
//           filename = match[1];
//         }
//       }

//       const downloadUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(downloadUrl);
//       setIsScheduleGenerated(true);
//     } catch (error) {
//       console.error("Error downloading file:", error);
//       alert("Failed to download file.");
//     }
//   }



//   async function handleChange(e) {
//     const { name, value } = e.target;
//     // console.log("updated tranche " + JSON.stringify(sanction));
//     let newFormData = { ...sanction, [name]: value };

//     let tenureData, trancheData;
//     try {


//       if (name === "tranche_amount") {
//         // const result =   handleTrancheAmountChange(newFormData.sanction_id,newFormData.lender_code);
//         const amount = parseFloat(value || 0);
//         const selectedSanction = sanctionData.find(
//           (s) => s.sanction_id === sanction.sanction_id
//         );
//         const allowedAmount = selectedSanction ? parseFloat(selectedSanction.sanction_amount) : 0;
//         // 🛑 Await the result from API
//         const result = await handleTrancheAmountChange(
//           sanction.sanction_id,
//           sanction.lender_code,
//           sanction.tranche_id
//         );

//         const existingAmount = parseFloat(result?.total_tranche_amount || 0);
//         const totalPlanned = amount + existingAmount;
//         const overage = totalPlanned - allowedAmount;
//         newErrors.tranche_amount =
//           totalPlanned > allowedAmount
//             ? `Tranche amount exceeds by ₹${overage.toLocaleString()}, already used: ₹${existingAmount.toLocaleString()}, Allowed Total limit: ₹${allowedAmount.toLocaleString()}`
//             : "";
//       }
//     } catch (error) {
//       console.error("handleChange error:", error);
//     }
//     // setSanction({ ...sanction, [name]: value });
//     setSanction((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//     setNewErrors((prev) => ({ ...prev, tranche_amount: newErrors.tranche_amount }));

//   }


//   return (

//     <Box sx={{ margin: "auto", marginTop: "70px", marginLeft: isDropped ? "100px" : "280px", transition: "margin-left 0.3s", padding: 3, border: "1px solid #ccc", borderRadius: 2, boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)" }}>
//       <Typography sx={{ color: "#0056b3", fontWeight: "600", fontSize: "20px", marginBottom: "20px", textAlign: "center", borderBottom: "2px solid #0056b3", paddingBottom: "10px" }}>Tranche Details</Typography>

//       {loading ? <CircularProgress sx={{ display: "block", margin: "auto" }} /> : sanction ? (
//         <Paper elevation={0} sx={{ padding: 3 }}>
//           <Grid container spacing={2}>
//             {fieldConfig
//               .filter((field) => {
//                 if (
//                   (field.name === "moratorium_start_date" || field.name === "moratorium_end_date") &&
//                   sanction.loan_type !== "BROKERN-EMI"
//                 ) {
//                   return false; // exclude these fields unless loan_type is 'BROKERN-EMI'
//                 }
//                 return true;
//               })
//               .map((field) => (
//                 <Grid key={field.name} item xs={12} sm={6}>
//                   {field.name === "sanction_id" ? (
//                     <TextField
//                       select
//                       type={field.type}
//                       label={field.label}
//                       name={field.name}
//                       value={sanction[field.name] || ""}
//                       fullWidth
//                       disabled
//                       sx={{ backgroundColor: "#ebeced" }}
//                     >
//                       {sanctionIds.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   ) : (
//                     <TextField
//                       type={field.type}
//                       label={field.label}
//                       name={field.name}
//                       value={sanction[field.name] || ""}
//                       fullWidth
//                       onChange={handleChange}
//                       select={isEditing && field.type === "select"}
//                       InputLabelProps={field.type === "date" ? { shrink: true } : {}}

//                       InputProps={{ readOnly: field.readOnly || !isEditing }}
//                       error={!!newErrors[field.name]}
//                       helperText={newErrors[field.name] || ""}
//                       sx={{
//                         cursor: "default",
//                         backgroundColor: sanction.updated_fields?.includes(field.name)
//                           ? "#fcec03"
//                           : "#ebeced",
//                       }}
//                     >
//                       {isEditing &&
//                         field.type === "select" &&
//                         field.options.map((option) => (
//                           <MenuItem key={option} value={option}>
//                             {option}
//                           </MenuItem>
//                         ))}
//                     </TextField>
//                   )}
//                 </Grid>
//               ))}

//           </Grid>
//           {!showFileUpload && (
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
//               <Button variant="contained" color="primary" onClick={handleGenerate} disabled={!hasChanges(sanction, originalLender)}
//               >
//                 Generate Schedule
//               </Button>
//             </Box>
//           )}

//           {/* File Upload Section - only visible if checkbox checked */}
//           {showFileUpload && (
//             <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
//               <input
//                 type="file"
//                 accept=".xlsx, .xls, .csv"
//                 onChange={handleFileChange}
//                 style={{ marginTop: 10 }}
//               />
//             </Box>
//           )}

//           {/* Checkbox to toggle file upload */}
//           <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>

//             <FormControlLabel
//               control={
//                 <Checkbox checked={showFileUpload} onChange={handleCheckboxChange} disabled={!hasChanges(sanction, originalLender)} />
//               }
//               label="Ignore generated schedule and Upload Excel/CSV file"
//             />
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={() => setOpenPreview(true)}
//               disabled={fileData.length === 0} // Disable if fileData is empty
//             >
//               Preview Data
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               component="a"
//               href="/Format.csv"
//               download
//             >
//               Download Format
//             </Button>
//           </Box>


//           <Box mt={3} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//             <Button variant="contained" color="warning" onClick={handleBack}>Back</Button>
//             {isEditing ? <Button variant="contained" color="primary"
//               onClick={() => {
//                 if (showFileUpload) {
//                   handleFileUploadToDB();
//                 } else {
//                   handleUpload();
//                 }
//               }} disabled={showFileUpload
//                 ? fileData.length === 0 : !isScheduleGenerated || !hasChanges(sanction, originalLender)}
//             >Update</Button>
//               :
//               <Button variant="contained" color="error" onClick={handleEdit}>Edit</Button>}
//           </Box>
//           {isEditing && !hasChanges(sanction, originalLender) && (
//             <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
//               Make changes to enable the Update button.
//             </Typography>
//           )}
//         </Paper>
//       ) : <Typography sx={{ textAlign: "center", marginTop: 2 }}>Tranche details not found</Typography>}

//       {/* Preview Dialog (Place just before </Box>) */}
//       <Dialog sx={{ display: "flex", justifyContent: "center", marginLeft: "200px" }} open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
//         <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>Preview Uploaded Data</DialogTitle>
//         <DialogContent>
//           {fileData.length > 0 ? (
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   {Object.keys(fileData[0]).map((key) => (
//                     <TableCell key={key}>{key}</TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {fileData.map((row, index) => (
//                   <TableRow key={index}>
//                     {Object.values(row).map((cell, idx) => (
//                       <TableCell key={idx}>{cell}</TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <Typography>No data to display.</Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenPreview(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Tranchemaker;




import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Typography, TextField, Button, MenuItem, FormControlLabel, Checkbox, Dialog, CircularProgress, Paper, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

import axios from "axios";
import * as XLSX from "xlsx";
import Papa from "papaparse";
// const loanTypes = ["EMI", "NON-EMI", "BROKERN-EMI", "QUARTERLY-REPORT", "PRINCIPLE-MONTHLY", "BULLET"];
const fileTypes = [".csv", ".xlsx"];

const Tranchemaker = ({ isDropped }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const { lender_code, sanction_id, id, tranche_id, approval_status, updatedat } = location.state || {};
  const [sanction, setSanction] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [sanctionamount, setSanctionamount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalLender, setOriginalLender] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sanctionIds, setSanctionIds] = useState([]);
  const [sanctionData, setSanctionData] = useState([]);
  const [newErrors, setNewErrors] = useState({});
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [fileData, setFileData] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScheduleGenerated, setIsScheduleGenerated] = useState(false);
  const [revised_tranche_date, setrevised_tranche_date] = useState(null);
  const [revised_tranche_amount, setrevised_tranche_amount] = useState(null);
  const [revised_intrest_rate, setrevised_intrest_rate] = useState(null);
  const [revised_tenure_months, setrevised_tenure_months] = useState(null);
  const [paid_months, setpaid_months] = useState(null);
  let trancheData = null;

  useEffect(() => {
    const fetchSanctionIds = async () => {
      try {
        const response = await axios.get(`${API_URL}/roc/sanctionid`);
        // console.log("sanction api: ", response)
        if (response.data?.data) {
          setSanctionIds(response.data.data.map((item) => item.sanction_id));
          const sanctionMap = {};
          response.data.data.forEach((item) => {
            sanctionMap[item.sanction_id] = item.sanction_amount;
          });
          setSanctionamount(sanctionMap);

        }
      } catch (error) {
        console.error("Error fetching sanction IDs:", error);
      }
    };
    fetchSanctionIds();
  }, [API_URL]);

  useEffect(() => {
    const fetchSanctionDetails = async () => {
      try {
        console.log("tranche params: ", lender_code, id, sanction_id, tranche_id, approval_status, updatedat)
        const response = await axios.get(`${API_URL}/tranche/details`, {
          params: { lender_code, id, sanction_id, tranche_id, approval_status, updatedat },
        });
        console.log("Previous response details trhache maker: ", response)
        console.log("tranche lendercode: ", response.data.tranche.lender_code)
        if (response.status === 200) {
          const fetchedTranche = {
            ...response.data.tranche,
            loan_type: response.data.repayment_type || "", // Map repayment_type to loan_type
          };
          setSanction(fetchedTranche);
          setOriginalLender(fetchedTranche);
        }
      } catch (error) {
        console.error("Error fetching tranche details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSanctionDetails();
  }, [API_URL, tranche_id, approval_status, lender_code, sanction_id, updatedat]);

  const loanType = sanction?.loan_type || "";
  // console.log("loan type: ", loanType)


  const fieldConfig = useMemo(() => {
    const baseFields = [
      { name: "lender_code", label: "Lender Code", type: "text", readOnly: true },
      { name: "sanction_id", label: "Sanction ID", required: true, type: "select", options: [] },
      { name: "tranche_id", label: "Tranche Id", type: "text", readOnly: true },
      { name: "tranche_date", label: "Tranche Date", type: "date" },
      { name: "tranche_number", label: "Tranche Number", type: "number" },
      { name: "tranche_amount", label: "Tranche Amount", type: "number", readOnly: true },
      { name: "interest_type", label: "Interest Type", type: "select", options: ["Fixed", "Floating"] },
      { name: "interest_rate", label: "Interest Rate", type: "number" },
      { name: "tenure_months", label: "Tenure Months", type: "number" },
      { name: "principal_start_date", label: "Principle Start Date", type: "date" },
      { name: "interest_start_date", label: "Interest Start Date", type: "date" },
      { name: "principal_payment_frequency", label: "Principal Payment Frequency", type: "select", options: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"] },
      { name: "interest_payment_frequency", label: "Interest Payment Frequency", type: "select", options: ["Monthly", "Quarterly", "Half-Yearly", "Yearly"] },
      { name: "applicable_of_leap_year", label: "Applicable for Leap Year", type: "select", options: ["Yes", "No"] },
      { name: "interest_calculation_days", label: "Interest Calculation Days", type: "select", options: ["360", "365", "366"] },
      {
        name: "input_file_format",
        label: "Input File Format",
        required: true,
        type: "select",
        options: fileTypes
      },
      { name: "loan_type", label: "Loan Type", required: true, type: "select", options: ["EMI", "NON-EMI", "QUARTERLY-REPORT", "PRINCIPLE-MONTHLY", "BULLET", "BROKERN-EMI"] },
      { name: "current_ac_no", label: "Current A/C No", required: true, type: "number" },
      { name: "conf_acc_no", label: "Confirm A/C No", required: true, type: "number" },
      { name: "bank_name", label: "Name of the Bank", required: true, type: "text" },
      { name: "bank_branch", label: "Bank Branch", required: true, type: "text" },
      { name: "location", label: "Location", required: true, type: "text" },
      { name: "ifsc_code", label: "IFSC Code", required: true, type: "text" },
    ];

    const brokerFields = loanType === "BROKERN-EMI"
      ? [
        { name: "moratorium_start_date", label: "Moratorium Start Date", required: true, type: "date" },
        { name: "moratorium_end_date", label: "Moratorium End Date", required: true, type: "date" },
      ]
      : [];

    return [...baseFields, ...brokerFields];
  }, [loanType, fileTypes]);


  const handleTrancheAmountChange = async (sanction_id, lender_code, tranche_id) => {
    if (!sanction_id || !lender_code) return 0;
    const flag = 1;
    try {
      const response = await fetch(`${API_URL}/excel/tranche_sum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sanction_id, lender_code, tranche_id, flag }),
      });

      const result = await response.json();
      console.log("Tranche API success:", result);
      return result; // ✅ return the parsed result
    } catch (error) {
      console.error("Tranche API error:", error);
      return 0; // ✅ return fallback
    }
  };
  useEffect(() => {
    const fetchSanctions = async () => {
      if (!sanction || !sanction.lender_code) return;

      try {
        const response = await axios.get(`${API_URL}/roc/sanctionid`, {
          params: { lender_code: sanction.lender_code },
        });
        if (response.data?.data) {
          setSanctionData(response.data.data);
          console.log("inside sanction " + JSON.stringify(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching sanction IDs:", error);
      }
    };

    fetchSanctions();
  }, [sanction?.lender_code]);

  useEffect(() => {
    if (!sanction || !sanction.sanction_id || !sanction.lender_code || !sanction.tranche_id) return;

    const fetchTenureAndTranche = async () => {
      const body = {
        sanction_id: sanction.sanction_id,
        lender_code: sanction.lender_code,
        tranche_id: sanction.tranche_id
      };

      try {
        const tenure_response = await fetch(`${API_URL}/excel/getTenureMonths`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        let tenureData = null;
        if (tenure_response.ok) {
          tenureData = await tenure_response.json();
        } else {
          console.error(`Tenure API failed with status ${tenure_response.status}`);
        }

        const tranche_response = await fetch(`${API_URL}/excel/get_tranche_payments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (tranche_response.ok) {
          trancheData = await tranche_response.json();
          console.log("tranche resp api: ", trancheData)
          setpaid_months(trancheData?.count);

          setrevised_tranche_date(trancheData?.revised_tranche_date);
          setrevised_tranche_amount(trancheData?.outstanding_amount);
        } else {
          console.error(`Tranche API failed with status ${tranche_response.status}`);
        }

        if (tenureData && trancheData) {
          setrevised_tenure_months(tenureData.tenure_months - (trancheData.count || 0));
        }

        console.log("setting interest_rate: ", sanction.interest_rate);
        setrevised_intrest_rate(sanction.interest_rate);

      } catch (error) {
        console.error("Error fetching tenure/tranche data:", error);
      }
    };

    fetchTenureAndTranche();
  }, [sanction]);

  const hasChanges = (current, original) => {
    if (!current || !original) return false;
    return JSON.stringify(current) !== JSON.stringify(original);
  };

  const handleCheckboxChange = (event) => {
    setShowFileUpload(event.target.checked);
  };
  const validateForm = () => {
    const newErrors = {};

    fieldConfig.forEach((field) => {
      const value = formData[field.name];

      // Required field check with 
      if (field.required) {
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (field.type === "dropdown" && value === "")
        ) {
          newErrors[field.name] = `${field.label} is required`;
          return;
        }
      }

      // Length checks
      if (field.maxLength && value && value.length > field.maxLength) {
        newErrors[field.name] = `${field.label} should not exceed ${field.maxLength} characters`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleEdit = () => {
    setIsEditing(true);
    // setSanction({ ...sanction }); // Ensure you preserve all keys
  };

  const handleFileUploadToDB = async () => {
    const createdby = localStorage.getItem("token");

    // Validate required fields
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    if (!sanction.lender_code) {
      alert("Lender Code is required.");
      return;
    }
    if (!sanction.sanction_id) {
      alert("Sanction ID is required.");
      return;
    }
    if (!sanction.tranche_id) {
      alert("Tranche ID is required.");
      return;
    }
    if (!sanction.tranche_date) {
      alert("Tranche Date is required.");
      return;
    }
    if (!sanction.tranche_number) {
      alert("Tranche Number is required.");
      return;
    }
    // if (!sanction.moratorium_start_date) {
    //   alert("moratorium Start Date is required.");
    //   return;
    // }
    // if (!sanction.moratorium_end_date) {
    //   alert("moratorium End Date is required.");
    //   return;
    // }
    if (!sanction.tranche_amount) {
      alert("moratorium Start Date is required.");
      return;
    }
    if (!sanction.interest_type) {
      alert("Interest Type is required.");
      return;
    }
    if (!sanction.interest_rate) {
      alert("Interest Rate is required.");
      return;
    }
    if (!sanction.tenure_months || sanction.tenure_months === "") {
      alert("Tenure (in months) is required.");
      return;
    }

    if (!sanction.principal_start_date || sanction.principal_start_date === "") {
      alert("Principal Start Date is required.");
      return;
    }

    if (!sanction.interest_start_date || sanction.interest_start_date === "") {
      alert("Interest Start Date is required.");
      return;
    }

    if (!sanction.principal_payment_frequency || sanction.principal_payment_frequency === "") {
      alert("Principal Payment Frequency is required.");
      return;
    }

    if (!sanction.interest_payment_frequency || sanction.interest_payment_frequency === "") {
      alert("Interest Payment Frequency is required.");
      return;
    }

    if (sanction.applicable_of_leap_year === undefined || sanction.applicable_of_leap_year === "") {
      alert("Applicable of Leap Year selection is required.");
      return;
    }

    if (!sanction.interest_calculation_days || sanction.interest_calculation_days === "") {
      alert("Interest Calculation Days is required.");
      return;
    }

    // if (!sanction.input_file_format || sanction.input_file_format === "") {
    //   alert("Input File Format is required.");
    //   return;
    // }

    if (!sanction.loan_type) {
      alert("Loan Type is required.");
      return;
    }
    // bank 
    if (!sanction.current_ac_no || sanction.current_ac_no.trim() === "") {
      alert("Current A/C No is required.");
      return;
    }
    if (sanction.current_ac_no.length < 6) {
      alert("Current A/C No must be at least 6 characters.");
      return;
    }

    if (!sanction.conf_acc_no || sanction.conf_acc_no.trim() === "") {
      alert("Confirm A/C No is required.");
      return;
    }
    if (sanction.conf_acc_no.length < 6) {
      alert("Confirm A/C No must be at least 6 characters.");
      return;
    }
    if (sanction.current_ac_no !== sanction.conf_acc_no) {
      alert("Current A/C No and Confirm A/C No must match.");
      return;
    }

    if (!sanction.bank_name || sanction.bank_name.trim() === "") {
      alert("Name of the Bank is required.");
      return;
    }
    if (sanction.bank_name.length < 6) {
      alert("Name of the Bank must be at least 6 characters.");
      return;
    }

    if (!sanction.bank_branch || sanction.bank_branch.trim() === "") {
      alert("Bank Branch is required.");
      return;
    }
    if (sanction.bank_branch.length < 6) {
      alert("Bank Branch must be at least 6 characters.");
      return;
    }

    if (!sanction.location || sanction.location.trim() === "") {
      alert("Location is required.");
      return;
    }
    if (sanction.location.length < 6) {
      alert("Location must be at least 6 characters.");
      return;
    }

    if (!sanction.ifsc_code || sanction.ifsc_code.trim() === "") {
      alert("IFSC Code is required.");
      return;
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(sanction.ifsc_code.trim().toUpperCase())) {
      alert("Invalid IFSC Code format.");
      return;
    }


    const formDataExcel = new FormData();
    formDataExcel.append("file", selectedFile);
    formDataExcel.append("lender_code", sanction.lender_code);
    formDataExcel.append("sanction_id", sanction.sanction_id);
    formDataExcel.append("tranche_id", sanction.tranche_id);
    formDataExcel.append("tranche_date", sanction.tranche_date);
    formDataExcel.append("tranche_number", sanction.tranche_number);
    formDataExcel.append("moratorium_start_date", sanction.moratorium_start_date);
    formDataExcel.append("moratorium_end_date", sanction.moratorium_end_date);
    formDataExcel.append("tranche_amount", sanction.tranche_amount);
    formDataExcel.append("interest_type", sanction.interest_type);
    formDataExcel.append("interest_rate", sanction.interest_rate);
    formDataExcel.append("tenure_months", sanction.tenure_months);
    formDataExcel.append("principal_start_date", sanction.principal_start_date);
    formDataExcel.append("interest_start_date", sanction.interest_start_date);
    formDataExcel.append("principal_payment_frequency", sanction.principal_payment_frequency);
    formDataExcel.append("interest_payment_frequency", sanction.interest_payment_frequency);
    formDataExcel.append("applicable_of_leap_year", sanction.applicable_of_leap_year);
    formDataExcel.append("interest_calculation_days", sanction.interest_calculation_days);
    formDataExcel.append("input_file_format", sanction.input_file_format);
    formDataExcel.append("loan_type", sanction.loan_type);
    // bank append
    formDataExcel.append("current_ac_no", sanction.current_ac_no);
    formDataExcel.append("conf_acc_no", sanction.conf_acc_no);
    formDataExcel.append("bank_name", sanction.bank_name);
    formDataExcel.append("bank_branch", sanction.bank_branch);
    formDataExcel.append("location", sanction.location);
    formDataExcel.append("ifsc_code", sanction.ifsc_code.trim().toUpperCase());
    formDataExcel.append("created_by", createdby);

    console.log("FormData contents:");
    for (let [key, value] of formDataExcel.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      console.log(" FILE UPLOAD: ", formDataExcel)

      const finalFormData = {
        ...sanction,
        createdby: createdby
      }
      // tranche create

      console.log("File Upload tranche Update: ", finalFormData)
      const response = await fetch(`${API_URL}/tranche/update/${sanction.tranche_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData),
      });

      if (response.ok && response.status === 201) {
        // alert("Tranche Details updated Sent to Approval!");
        const res = await fetch(`${API_URL}/excel/upload/file`, {
          method: "POST",
          body: formDataExcel
        });

        const data = await res.json();
        // alert(data.message);
        if (res.ok) {
          alert("Tranche Details updated Sent to Approval!");
        } else {
          alert(data.message);
        }
      } else if (response.ok) {
        alert("Tranche Details updated Sent to Approval Failed!");
      } else {
        const errorResponse = await response.json();
        alert(errorResponse.message);
        return;
      }


    } catch (err) {
      console.error("File upload failed:", err);
      alert("Upload failed.");
    }
  };

  const handleUpload = async (e) => {
    // e.preventDefault(); // You may want to keep this if it's a form submission.
    try {
      const token = localStorage.getItem("token");

      const finalFormData = {
        ...sanction,
        createdby: token,
        updatedby: token,
        flag: 1
      };

      if (finalFormData.current_ac_no !== finalFormData.conf_acc_no) {
        alert("Current A/C No and Confirm A/C No must match.");
        return;
      }

      const maxAmount = sanctionamount?.[finalFormData.sanction_id];
      if (Number(finalFormData.tranche_amount) > Number(maxAmount)) {
        alert("Tranche Amount should not exceed the Sanction Amount.");
        return;
      }

      console.log("maker payload: ", finalFormData)


      const response = await fetch(`${API_URL}/tranche/update/${sanction.tranche_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData),
      });

      if (response.ok && response.status === 201) {
        // alert("Tranche Details updated Sent to Approval!");
        try {
          const uploadResponse = await fetch(`${API_URL}/excel/upload_schedule`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ finalFormData }),
          });

          const uploadResult = await uploadResponse.json();

          if (!uploadResponse.ok) {
            console.error("Upload failed:", uploadResult.message);
            alert("Upload failed: " + uploadResult.message);
            return;
          } else {
            alert("Tranche Details updated Sent to Approval!");
          }
        } catch (error) {
          console.error("Error uploading:", error);
          alert("An error occurred during upload.");
          return;
        }
      } else if (response.ok) {
        alert("Tranche Details updated Sent to Approval Failed!");
      } else {
        const errorResponse = await response.json();
        alert(errorResponse.message);
        return;
      }

      navigate("/DataCreation/TrancheDetails");
      setIsEditing(false);
      setIsScheduleGenerated(false);
    } catch (error) {
      console.error("Error updating tranche details:", error);
      alert("Failed to update tranche details");
    }
  };
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };
  const handleBack = () => navigate("/DataCreation/TrancheDetails");
  const handleGenerate = async (e) => {
    // required Fields filling
    if (!sanction.lender_code) {
      alert("Lender Code is required.");
      return;
    }
    if (!sanction.sanction_id) {
      alert("Sanction ID is required.");
      return;
    }
    if (!sanction.tranche_id) {
      alert("Tranche ID is required.");
      return;
    }
    if (!sanction.tranche_date) {
      alert("Tranche Date is required.");
      return;
    }
    if (!sanction.tranche_number) {
      alert("Tranche Number is required.");
      return;
    }
    if (!sanction.tranche_amount) {
      alert("moratorium Start Date is required.");
      return;
    }
    if (!sanction.interest_type) {
      alert("Interest Type is required.");
      return;
    }
    if (!sanction.interest_rate) {
      alert("Interest Rate is required.");
      return;
    }
    if (!sanction.tenure_months || sanction.tenure_months === "") {
      alert("Tenure (in months) is required.");
      return;
    }

    if (!sanction.principal_start_date || sanction.principal_start_date === "") {
      alert("Principal Start Date is required.");
      return;
    }

    if (!sanction.interest_start_date || sanction.interest_start_date === "") {
      alert("Interest Start Date is required.");
      return;
    }

    if (!sanction.principal_payment_frequency || sanction.principal_payment_frequency === "") {
      alert("Principal Payment Frequency is required.");
      return;
    }

    if (!sanction.interest_payment_frequency || sanction.interest_payment_frequency === "") {
      alert("Interest Payment Frequency is required.");
      return;
    }

    if (sanction.applicable_of_leap_year === undefined || sanction.applicable_of_leap_year === "") {
      alert("Applicable of Leap Year selection is required.");
      return;
    }

    if (!sanction.interest_calculation_days || sanction.interest_calculation_days === "") {
      alert("Interest Calculation Days is required.");
      return;
    }
    if (!sanction.loan_type) {
      alert("Loan Type is required.");
      return;
    }
    // bank 
    if (!sanction.current_ac_no || sanction.current_ac_no.trim() === "") {
      alert("Current A/C No is required.");
      return;
    }
    if (sanction.current_ac_no.length < 6) {
      alert("Current A/C No must be at least 6 characters.");
      return;
    }

    if (!sanction.conf_acc_no || sanction.conf_acc_no.trim() === "") {
      alert("Confirm A/C No is required.");
      return;
    }
    if (sanction.conf_acc_no.length < 6) {
      alert("Confirm A/C No must be at least 6 characters.");
      return;
    }
    if (sanction.current_ac_no !== sanction.conf_acc_no) {
      alert("Current A/C No and Confirm A/C No must match.");
      return;
    }

    if (!sanction.bank_name || sanction.bank_name.trim() === "") {
      alert("Name of the Bank is required.");
      return;
    }
    if (sanction.bank_name.length < 6) {
      alert("Name of the Bank must be at least 6 characters.");
      return;
    }

    if (!sanction.bank_branch || sanction.bank_branch.trim() === "") {
      alert("Bank Branch is required.");
      return;
    }
    if (sanction.bank_branch.length < 6) {
      alert("Bank Branch must be at least 6 characters.");
      return;
    }

    if (!sanction.location || sanction.location.trim() === "") {
      alert("Location is required.");
      return;
    }
    if (sanction.location.length < 6) {
      alert("Location must be at least 6 characters.");
      return;
    }

    if (!sanction.ifsc_code || sanction.ifsc_code.trim() === "") {
      alert("IFSC Code is required.");
      return;
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(sanction.ifsc_code.trim().toUpperCase())) {
      alert("Invalid IFSC Code format.");
      return;
    }

    try {
      let url = "";
      switch (sanction.loan_type) {
        case "NON-EMI":
          url = `${API_URL}/excel/generate-nonemi-schedule`;
          break;
        case "EMI":
          url = `${API_URL}/excel/generate-emi-schedule`;
          break;
        case "QUARTERLY-REPORT":
          url = `${API_URL}/excel/generate-quarterly-report`;
          break;
        case "PRINCIPLE-MONTHLY":
          url = `${API_URL}/excel/generate-princ_monthly-report`;
          break;
        case "BULLET":
          url = `${API_URL}/excel/loan-schedule/bullet`;
          break;
        case "BROKERN-EMI":
          url = `${API_URL}/excel/generate-broken-emi`;
          break;
        default:
          throw new Error("Invalid loan type");
      }
      const createdby = localStorage.getItem("token");
      // console.log("generate data call: ", sanction)
      // sanction.interest_rate = revised_intrest_rate;
      const temp_tranche_date = sanction.tranche_date;
      const temp_tenure_months = sanction.tenure_months;
      sanction.tranche_date = revised_tranche_date ? formatDate(revised_tranche_date) : sanction.tranche_date;
      console.log("date. revised date: ", sanction.tranche_date, " : ", trancheData)
      sanction.tenure_months = revised_tenure_months;
      sanction.tranche_amount = revised_tranche_amount;

      const body = {
        ...sanction,
        original_tranche_date: formatDate(temp_tranche_date),
        // original_interest_rate:sanction.interest_rate,
        paid_months: paid_months,
        principal_start_date: formatDate(sanction.principal_start_date),
        interest_start_date: formatDate(sanction.interest_start_date),
        created_by: createdby,
        flag: 1
      };

      // Add moratorium dates if loan type is BROKERN-EMI
      if (sanction.loan_type === "BROKERN-EMI") {
        body.moratorium_start_date = formatDate(sanction.moratorium_start_date);
        body.moratorium_end_date = formatDate(sanction.moratorium_end_date);
        if (!sanction.moratorium_start_date) {
          alert("moratorium Start Date is required.");
          return;
        }
        if (!sanction.moratorium_end_date) {
          alert("moratorium End Date is required.");
          return;
        }
        if (sanction.moratorium_start_date && sanction.moratorium_end_date) {
          if (new Date(sanction.moratorium_end_date) <= new Date(sanction.moratorium_start_date)) {
            alert("Moratorium End Date must be greater than Start Date.");
            newErrors.moratorium = "Moratorium End Date must be greater than Start Date";
            return;
          } else {
            delete newErrors.moratorium;
            // return;
          }
        } else {
          delete newErrors.moratorium; // Don't show error if one is missing
        }
      }
      console.log("bodyy " + JSON.stringify(body));
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
      sanction.tranche_date = temp_tranche_date;
      sanction.tenure_months = temp_tenure_months;
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const contentType = response.headers.get("Content-Type");

      let extension = ".xlsx";
      if (contentType === "text/csv") extension = ".csv";
      else if (contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") extension = ".xlsx";

      let filename = "Loan_Schedule" + extension;
      if (contentDisposition && contentDisposition.includes("filename=")) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setIsScheduleGenerated(true);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file.");
    }
  }



  async function handleChange(e) {
    const { name, value } = e.target;
    // console.log("updated tranche " + JSON.stringify(sanction));
    let newFormData = { ...sanction, [name]: value };

    let tenureData, trancheData;
    try {


      if (name === "tranche_amount") {
        // const result =   handleTrancheAmountChange(newFormData.sanction_id,newFormData.lender_code);
        const amount = parseFloat(value || 0);
        const selectedSanction = sanctionData.find(
          (s) => s.sanction_id === sanction.sanction_id
        );
        const allowedAmount = selectedSanction ? parseFloat(selectedSanction.sanction_amount) : 0;
        // 🛑 Await the result from API
        const result = await handleTrancheAmountChange(
          sanction.sanction_id,
          sanction.lender_code,
          sanction.tranche_id
        );

        const existingAmount = parseFloat(result?.total_tranche_amount || 0);
        const totalPlanned = amount + existingAmount;
        const overage = totalPlanned - allowedAmount;
        newErrors.tranche_amount =
          totalPlanned > allowedAmount
            ? `Tranche amount exceeds by ₹${overage.toLocaleString()}, already used: ₹${existingAmount.toLocaleString()}, Allowed Total limit: ₹${allowedAmount.toLocaleString()}`
            : "";
      }
    } catch (error) {
      console.error("handleChange error:", error);
    }
    // setSanction({ ...sanction, [name]: value });
    setSanction((prev) => ({
      ...prev,
      [name]: value
    }));
    setNewErrors((prev) => ({ ...prev, tranche_amount: newErrors.tranche_amount }));

  }


  return (

    <Box sx={{
      margin: "auto", marginTop: "70px", marginLeft: isDropped ? "100px" : "280px", transition: "margin-left 0.3s", padding: 3, border: "3px solid #ccc", borderRadius: 2,
      // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)" 
    }}>
      <Typography sx={{ color: "#0056b3", fontWeight: "600", fontSize: "20px", marginBottom: "20px", textAlign: "center", borderBottom: "2px solid #0056b3", paddingBottom: "10px" }}>Tranche Details</Typography>

      {loading ? <CircularProgress sx={{ display: "block", margin: "auto" }} /> : sanction ? (
        <Paper elevation={0} sx={{ padding: 3 }}>
          <Grid container spacing={2}>
            {fieldConfig
              .filter((field) => {
                if (
                  (field.name === "moratorium_start_date" || field.name === "moratorium_end_date") &&
                  sanction.loan_type !== "BROKERN-EMI"
                ) {
                  return false; // exclude these fields unless loan_type is 'BROKERN-EMI'
                }
                return true;
              })
              .map((field) => (
                <Grid key={field.name} item xs={12} sm={6}>
                  {field.name === "sanction_id" ? (
                    <TextField
                      select
                      type={field.type}
                      label={field.label}
                      name={field.name}
                      value={sanction[field.name] || ""}
                      fullWidth
                      disabled
                      sx={{ backgroundColor: "#ebeced" }}
                    >
                      {sanctionIds.map((option) => (
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
                      value={sanction[field.name] || ""}
                      fullWidth
                      onChange={handleChange}
                      select={isEditing && field.type === "select"}
                      InputLabelProps={field.type === "date" ? { shrink: true } : {}}

                      InputProps={{ readOnly: field.readOnly || !isEditing }}
                      error={!!newErrors[field.name]}
                      helperText={newErrors[field.name] || ""}
                      sx={{
                        cursor: "default",
                        backgroundColor: sanction.updated_fields?.includes(field.name)
                          ? "#fcec03"
                          : "#ebeced",
                      }}
                    >
                      {isEditing &&
                        field.type === "select" &&
                        field.options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                    </TextField>
                  )}
                </Grid>
              ))}

          </Grid>
          {!showFileUpload && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleGenerate} disabled={!hasChanges(sanction, originalLender)}
              >
                Generate Schedule
              </Button>
            </Box>
          )}

          {/* File Upload Section - only visible if checkbox checked */}
          {showFileUpload && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                style={{ marginTop: 10 }}
              />
            </Box>
          )}

          {/* Checkbox to toggle file upload */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>

            <FormControlLabel
              control={
                <Checkbox checked={showFileUpload} onChange={handleCheckboxChange} disabled={!hasChanges(sanction, originalLender)} />
              }
              label="Ignore generated schedule and Upload Excel/CSV file"
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenPreview(true)}
              disabled={fileData.length === 0} // Disable if fileData is empty
            >
              Preview Data
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component="a"
              href="/Format.csv"
              download
            >
              Download Format
            </Button>
          </Box>


          <Box mt={3} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" color="warning" onClick={handleBack}>Back</Button>
            {isEditing ? <Button variant="contained" color="primary"
              onClick={() => {
                if (showFileUpload) {
                  handleFileUploadToDB();
                } else {
                  handleUpload();
                }
              }} disabled={showFileUpload
                ? fileData.length === 0 : !isScheduleGenerated || !hasChanges(sanction, originalLender)}
            >Update</Button>
              :
              <Button variant="contained" color="error" onClick={handleEdit}>Edit</Button>}
          </Box>
          {isEditing && !hasChanges(sanction, originalLender) && (
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
              Make changes to enable the Update button.
            </Typography>
          )}
        </Paper>
      ) : <Typography sx={{ textAlign: "center", marginTop: 2 }}>Tranche details not found</Typography>}

      {/* Preview Dialog (Place just before </Box>) */}
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
    </Box>
  );
};

export default Tranchemaker;
