import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";

// import { Checkbox, FormControlLabel } from "@mui/material";
import * as XLSX from "xlsx";
// import { TextField, Button, Grid, Box, MenuItem, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const leapYear = ["Yes", "No"];
const interestTypes = ["Fixed", "Floating"];
const repaymentTerms = ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "Bullet"];
const loanTypes = ["EMI", "NON-EMI", "BROKERN-EMI", "QUARTERLY-REPORT", "PRINCIPLE-MONTHLY", "BULLET"];
const interestDays = ["360", "365", "366"];
const fileTypes = [".csv", ".xlsx"];

const TrancheDetails = ({ isDropped }) => {

  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);

  const [lenderCodes, setLenderCodes] = useState([]);
  const [sanctionData, setSanctionData] = useState([]);
  const [trancheData, setTrancheData] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  // eslint-disable-next-line
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  // eslint-disable-next-line
  // const [fileData, setFileData] = useState(null);

  const handleCheckboxChange = (event) => {
    setShowFileUpload(event.target.checked);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  const filteredSanctionOptions = useMemo(() => {
    if (!formData.lender_code || !sanctionData.length) return [];
    return sanctionData
      .filter(s => s.lender_code?.toString().trim() === formData.lender_code?.toString().trim())
      .map(s => s.sanction_id);
  }, [formData.lender_code, sanctionData]);

  const [trancheAmount, setTrancheAmount] = useState('');


  const handleTrancheAmountChange = async (sanction_id, lender_code) => {
    if (!sanction_id || !lender_code) return 0;

    try {
      const response = await fetch(`${API_URL}/excel/tranche_sum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sanction_id, lender_code }),
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
    console.log("formData.lender_code:", formData.lender_code);
    console.log("sanctionData:", sanctionData);
    console.log("filteredSanctionOptions:", filteredSanctionOptions);
  }, [formData.lender_code, sanctionData, filteredSanctionOptions]);

  const fieldConfig = useMemo(() => [
    { name: "lender_code", label: "Lender Code/Lender Name", required: true, type: "dropdown", options: lenderCodes },
    { name: "sanction_id", label: "Sanction ID", required: true, type: "dropdown", options: filteredSanctionOptions },
    { name: "tranche_id", label: "Tranche ID", required: true, type: "text", minLength: 6, maxLength: 10 },
    { name: "tranche_date", label: "Tranche Date", required: true, type: "date" },
    { name: "tranche_number", label: "Tranche Number", required: true, type: "number" },
    { name: "moratorium_start_date", label: "Moratorium Start Date", required: formData.loan_type === "BROKERN-EMI", type: "date" },
    { name: "moratorium_end_date", label: "Moratorium End Date", required: formData.loan_type === "BROKERN-EMI", type: "date" },
    { name: "tranche_amount", label: "Tranche Amount", required: true, type: "number" },
    { name: "interest_type", label: "Interest Type", required: true, type: "dropdown", options: interestTypes },
    { name: "interest_rate", label: "Interest Rate", required: true, type: "number" },
    { name: "tenure_months", label: "Tenure (Months)", required: true, type: "number" },
    { name: "principal_start_date", label: "Principal Start Date", required: true, type: "date" },
    { name: "interest_start_date", label: "Interest Start Date", required: true, type: "date" },
    { name: "principal_payment_frequency", label: "Principal Payment Frequency", required: true, type: "dropdown", options: repaymentTerms },
    { name: "interest_payment_frequency", label: "Interest Payment Frequency", required: true, type: "dropdown", options: repaymentTerms },
    { name: "applicable_of_leap_year", label: "Applicable Of Leap Year", required: true, type: "dropdown", options: leapYear },
    { name: "interest_calculation_days", label: "Interest Calculation Days", required: true, type: "dropdown", options: interestDays },
    {
      name: "input_file_format",
      label: "Input File Format",
      required: true,
      type: "dropdown",
      options:
        fileTypes

    },
    { name: "loan_type", label: "Loan Type", required: true, type: "dropdown", options: loanTypes },

  ], [formData.loan_type, formData.lender_code, lenderCodes, sanctionData, filteredSanctionOptions]);

  const bankFields = [
    { name: "current_ac_no", label: "Current A/C No", required: true, type: "number", minLength: 6, maxLength: 225 },
    { name: "conf_acc_no", label: "Confirm A/C No", required: true, type: "number", minLength: 6, maxLength: 225 },
    { name: "bank_name", label: "Name of the Bank", required: true, type: "text", minLength: 6, maxLength: 225 },
    { name: "bank_branch", label: "Bank Branch", required: true, type: "text", minLength: 6, maxLength: 225 },
    { name: "location", label: "Location", required: true, type: "text", minLength: 6, maxLength: 225 },
    { name: "ifsc_code", label: "IFSC Code", required: true, type: "text" },
  ];

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const fetchLenders = async () => {
      try {
        const response = await axios.get(`${API_URL}/sanction/lendercodes`);
        if (response.data?.data) setLenderCodes(response.data.data);
      } catch (error) {
        console.error("Error fetching lenders:", error);
      }
    };

    const fetchTranche = async () => {
      try {
        // const response = await axios.get(`${API_URL}/tranche/findTwo`);
        const response = await axios.get(`${API_URL}/tranche/checkValidity`);
        if (response.data?.data) setTrancheData(response.data.data);
      } catch (error) {
        console.error("Error fetching tranche IDs:", error);
      }
    };

    fetchLenders();
    fetchTranche();
  }, [API_URL]);

  useEffect(() => {
    const fetchSanctions = async () => {
      if (!formData.lender_code) return;
      try {
        const response = await axios.get(`${API_URL}/roc/sanctionid`, {
          params: { lender_code: formData.lender_code },
        });
        if (response.data?.data) setSanctionData(response.data.data);
      } catch (error) {
        console.error("Error fetching sanction IDs:", error);
      }
    };

    fetchSanctions();
  }, [formData.lender_code, API_URL]);


  const handleChange = async (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    let newErrors = { ...errors };

    if (name === "lender_code") {
      const selectedLender = sanctionData.find((s) => s.lender_code === value);
      newFormData.sanction_id = selectedLender?.sanction_id || "";

      newFormData.tranche_amount = "";
      newErrors.tranche_amount = "";
    }

    if (name === "sanction_id") {
      newFormData.tranche_amount = "";
      newErrors.tranche_amount = "";
    }
    // Moratorium Date Validation
    const startDate = newFormData.moratorium_start_date;
    const endDate = newFormData.moratorium_end_date;

    if (name === "moratorium_start_date" || name === "moratorium_end_date") {
      if (startDate && endDate) {
        if (new Date(endDate) <= new Date(startDate)) {
          newErrors.moratorium_end_date = "Moratorium End Date must be greater than Start Date";
        } else {
          delete newErrors.moratorium_end_date;
        }
      } else {
        delete newErrors.moratorium; // Don't show error if one is missing
      }
    }


    if (name === "tranche_date") {
      const sanction = sanctionData.find(
        (s) => s.sanction_id === newFormData.sanction_id
      );

      const sanctionDate = new Date(sanction?.sanction_date);
      const trancheDate = new Date(value);
      if (trancheDate <= sanctionDate) {
        newErrors.tranche_date = `Tranche Date should be after Sanction Date (${sanction?.sanction_date})!`;
      } else {
        newErrors.tranche_date = "";
      }
    }

    if (name === "tranche_id") {
      const exists = trancheData.some(
        (item) =>
          item.sanction_id === newFormData.sanction_id &&
          item.lender_code === newFormData.lender_code &&
          item.tranche_id === value
      );
      newErrors.tranche_id = exists ? "Tranche ID already exists for this Sanction ID!" : "";
    }

    if (name === "tranche_amount") {
      // const result =   handleTrancheAmountChange(newFormData.sanction_id,newFormData.lender_code);
      const amount = parseFloat(value || 0);
      const selectedSanction = sanctionData.find(
        (s) => s.sanction_id === newFormData.sanction_id
      );
      const allowedAmount = selectedSanction ? parseFloat(selectedSanction.sanction_amount) : 0;
      // 🛑 Await the result from API
      const result = await handleTrancheAmountChange(
        newFormData.sanction_id,
        newFormData.lender_code
      );

      const existingAmount = parseFloat(result?.total_tranche_amount || 0);
      const totalPlanned = amount + existingAmount;
      const overage = totalPlanned - allowedAmount;
      newErrors.tranche_amount =
        totalPlanned > allowedAmount
          ? `Tranche amount exceeds by ₹${overage.toLocaleString()}, already used: ₹${existingAmount.toLocaleString()}, Allowed Total limit: ₹${allowedAmount.toLocaleString()}`
          : "";
    }
    bankFields.forEach((field) => {
      if (name === field.name) {
        // Type validation
        if (field.type === "number" && isNaN(value)) {
          newErrors[name] = `${field.label} must be a number`;
          return;
        }

        if (field.type === "text" && !isNaN(value)) {
          newErrors[name] = `${field.label} must be text`;
          return;
        }

        // Length validation
        if (field.minLength && value.length < field.minLength) {
          newErrors[name] = `${field.label} should be at least ${field.minLength} characters long`;
        } else if (field.maxLength && value.length > field.maxLength) {
          newErrors[name] = `${field.label} should not exceed ${field.maxLength} characters`;
        } else {
          newErrors[name] = '';
        }
      }
    });


    setFormData(newFormData);
    setErrors(newErrors);
  };

  // const uploadToStaging = async () => {

  //   console.log("formmm " + formData);

  // };

  const getExcel = async (e) => {
    e.preventDefault();
    if (buttonDisabled) return;
    setButtonDisabled(true);

    console.log("formm " + JSON.stringify(formData));
    const trancheDate = new Date(formatDate(formData.tranche_date));
    const principalDate = new Date(formatDate(formData.principal_start_date));
    const interestDate = new Date(formatDate(formData.interest_start_date));
    const moratoriumStartDate = new Date(formatDate(formData.moratorium_start_date));
    const moratoriumEndDate = new Date(formatDate(formData.moratorium_end_date));

    if (principalDate < trancheDate || interestDate < trancheDate) {
      alert("Principal Start Date and Interest Start Date must be same as or after Tranche Date");
      setButtonDisabled(false); // Re-enable the button if validation fails
      return;
    }

    if (moratoriumStartDate < trancheDate || moratoriumEndDate < trancheDate) {
      alert("Moratorium Start Date and Moratorium End Date must be same as or after Tranche Date");
      setButtonDisabled(false);
      return;
    }

    // if(formData.current_ac_no!=)
    if (formData.current_ac_no !== formData.conf_acc_no) {
      alert("Current A/C No and Confirm A/C No must match");
      setButtonDisabled(false);
      return;
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const ifsc = formData.ifsc_code.trim().toUpperCase();
    if (!ifscRegex.test(ifsc)) {
      alert("Invalid IFSC Code format");
      setButtonDisabled(false); // <- Add this here too
      return;
    }

    try {
      let url = "";
      switch (formData.loan_type) {
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
      const body = {
        ...formData,
        tranche_date: formatDate(formData.tranche_date),
        principal_start_date: formatDate(formData.principal_start_date),
        interest_start_date: formatDate(formData.interest_start_date),
        created_by: createdby
      };

      // Add moratorium dates if loan type is BROKERN-EMI
      if (formData.loan_type === "BROKERN-EMI") {
        body.moratorium_start_date = formatDate(formData.moratorium_start_date);
        body.moratorium_end_date = formatDate(formData.moratorium_end_date);
      }

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

      setShowUploadButton(true); // Show "Upload" button after successful generation
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file.");
    } finally {
      setButtonDisabled(false); // Always re-enable the button
    }
  };
  // const [selectedFile, setSelectedFile] = useState(null);

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
    if (!formData.tranche_date) {
      alert("Tranche Date is required.");
      return;
    }
    if (!formData.tranche_number) {
      alert("Tranche Number is required.");
      return;
    }
    if (!formData.moratorium_start_date) {
      alert("moratorium Start Date is required.");
      return;
    }
    if (!formData.moratorium_end_date) {
      alert("moratorium End Date is required.");
      return;
    }
    if (!formData.tranche_amount) {
      alert("Tranche Amount is required.");
      return;
    }
    if (!formData.interest_type) {
      alert("Interest Type is required.");
      return;
    }
    if (!formData.interest_rate) {
      alert("Interest Rate is required.");
      return;
    }
    if (!formData.tenure_months || formData.tenure_months === "") {
      alert("Tenure (in months) is required.");
      return;
    }

    if (!formData.principal_start_date || formData.principal_start_date === "") {
      alert("Principal Start Date is required.");
      return;
    }

    if (!formData.interest_start_date || formData.interest_start_date === "") {
      alert("Interest Start Date is required.");
      return;
    }

    if (!formData.principal_payment_frequency || formData.principal_payment_frequency === "") {
      alert("Principal Payment Frequency is required.");
      return;
    }

    if (!formData.interest_payment_frequency || formData.interest_payment_frequency === "") {
      alert("Interest Payment Frequency is required.");
      return;
    }

    if (formData.applicable_of_leap_year === undefined || formData.applicable_of_leap_year === "") {
      alert("Applicable of Leap Year selection is required.");
      return;
    }

    if (!formData.interest_calculation_days || formData.interest_calculation_days === "") {
      alert("Interest Calculation Days is required.");
      return;
    }

    if (!formData.input_file_format || formData.input_file_format === "") {
      alert("Input File Format is required.");
      return;
    }

    if (!formData.loan_type) {
      alert("Loan Type is required.");
      return;
    }
    // bank 
    if (!formData.current_ac_no || formData.current_ac_no.trim() === "") {
      alert("Current A/C No is required.");
      return;
    }
    if (formData.current_ac_no.length < 6) {
      alert("Current A/C No must be at least 6 characters.");
      return;
    }

    if (!formData.conf_acc_no || formData.conf_acc_no.trim() === "") {
      alert("Confirm A/C No is required.");
      return;
    }
    if (formData.conf_acc_no.length < 6) {
      alert("Confirm A/C No must be at least 6 characters.");
      return;
    }
    if (formData.current_ac_no !== formData.conf_acc_no) {
      alert("Current A/C No and Confirm A/C No must match.");
      return;
    }

    if (!formData.bank_name || formData.bank_name.trim() === "") {
      alert("Name of the Bank is required.");
      return;
    }
    if (formData.bank_name.length < 6) {
      alert("Name of the Bank must be at least 6 characters.");
      return;
    }

    if (!formData.bank_branch || formData.bank_branch.trim() === "") {
      alert("Bank Branch is required.");
      return;
    }
    if (formData.bank_branch.length < 6) {
      alert("Bank Branch must be at least 6 characters.");
      return;
    }

    if (!formData.location || formData.location.trim() === "") {
      alert("Location is required.");
      return;
    }
    if (formData.location.length < 6) {
      alert("Location must be at least 6 characters.");
      return;
    }

    if (!formData.ifsc_code || formData.ifsc_code.trim() === "") {
      alert("IFSC Code is required.");
      return;
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(formData.ifsc_code.trim().toUpperCase())) {
      alert("Invalid IFSC Code format.");
      return;
    }


    const formDataExcel = new FormData();
    formDataExcel.append("file", selectedFile);
    formDataExcel.append("lender_code", formData.lender_code);
    formDataExcel.append("sanction_id", formData.sanction_id);
    formDataExcel.append("tranche_id", formData.tranche_id);
    formDataExcel.append("tranche_date", formData.tranche_date);
    formDataExcel.append("tranche_number", formData.tranche_number);
    formDataExcel.append("moratorium_start_date", formData.moratorium_start_date);
    formDataExcel.append("moratorium_end_date", formData.moratorium_end_date);
    formDataExcel.append("tranche_amount", formData.tranche_amount);
    formDataExcel.append("interest_type", formData.interest_type);
    formDataExcel.append("interest_rate", formData.interest_rate);
    formDataExcel.append("tenure_months", formData.tenure_months);
    formDataExcel.append("principal_start_date", formData.principal_start_date);
    formDataExcel.append("interest_start_date", formData.interest_start_date);
    formDataExcel.append("principal_payment_frequency", formData.principal_payment_frequency);
    formDataExcel.append("interest_payment_frequency", formData.interest_payment_frequency);
    formDataExcel.append("applicable_of_leap_year", formData.applicable_of_leap_year);
    formDataExcel.append("interest_calculation_days", formData.interest_calculation_days);
    formDataExcel.append("input_file_format", formData.input_file_format);
    formDataExcel.append("loan_type", formData.loan_type);
    // bank append
    formDataExcel.append("current_ac_no", formData.current_ac_no);
    formDataExcel.append("conf_acc_no", formData.conf_acc_no);
    formDataExcel.append("bank_name", formData.bank_name);
    formDataExcel.append("bank_branch", formData.bank_branch);
    formDataExcel.append("location", formData.location);
    formDataExcel.append("ifsc_code", formData.ifsc_code.trim().toUpperCase());
    formDataExcel.append("created_by", createdby);

    console.log("FormData contents:");
    for (let [key, value] of formDataExcel.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      console.log(" FILE UPLOAD: ", formDataExcel)
      const res = await fetch(`${API_URL}/excel/upload/file`, {
        method: "POST",
        body: formDataExcel
      });

      const data = await res.json();
      alert(data.message);

      const finalFormData = {
        ...formData,
        createdby: createdby
      }
      // tranche create

      try {
        console.log("final frontend sending save: ", formData)
        const trancheResponse = await fetch(`${API_URL}/tranche/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ finalFormData }),
        });

        if (!trancheResponse.ok) {
          throw new Error(`Server Error: ${trancheResponse.status}`);
        }

        localStorage.setItem("submissionMessage", "Tranche Details Sent for Approval!");
        localStorage.setItem("messageType", "success");
        navigate("/DataCreation/TrancheDetails");
      } catch (error) {
        console.error("Error submitting tranche:", error);
        alert("Error submitting tranche: " + error.message);
      }
    } catch (err) {
      console.error("File upload failed:", err);
      alert("Upload failed.");
    }
  };

  const handleUpload = async (e) => {
    // e.preventDefault(); 
    const valueToTrim = formData.someField;
    const trimmedValue = valueToTrim?.trim() || "";

    const createdby = localStorage.getItem("token");

    if (!formData.tranche_date || !formData.principal_start_date || !formData.interest_start_date) {
      alert("All date fields are required.");
      return;
    }

    const finalFormData = {
      ...formData,
      createdby: createdby,
      updatedby: createdby,
      tranche_date: formatDate(formData.tranche_date),
      principal_start_date: formatDate(formData.principal_start_date),
      interest_start_date: formatDate(formData.interest_start_date),
    };

    const trancheDate = new Date(finalFormData.tranche_date);
    const principalDate = new Date(finalFormData.principal_start_date);
    const interestDate = new Date(finalFormData.interest_start_date);

    // Validate that start dates are on or after tranche_date
    if (principalDate < trancheDate || interestDate < trancheDate) {
      alert("Principal Start Date and Interest Start Date must be After Tranche Date Or same Date");
      return;
    }

    // Call the tranche create API
    if (finalFormData.current_ac_no !== finalFormData.conf_acc_no) {
      alert("Current A/C No and Confirm A/C No must match");
      return;  // Stop further execution if A/C numbers do not match
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const ifsc = formData.ifsc_code.trim().toUpperCase();
    if (!ifscRegex.test(ifsc)) {
      alert("Invalid IFSC Code format");
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    // Call the upload schedule API
    try {
      const uploadResponse = await fetch(`${API_URL}/excel/upload_schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ finalFormData }),
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        console.error("Upload failed:", uploadResult.message);
        alert("Upload failed: " + uploadResult.message);
        return;  // Stop further execution if upload fails
      } else {
        alert("Upload successful!");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("An error occurred during upload.");
      return;  // Stop further execution if there's an exception
    }

    try {
      console.log("final frontend sending save: ", finalFormData)
      const trancheResponse = await fetch(`${API_URL}/tranche/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalFormData }),
      });

      if (!trancheResponse.ok) {
        throw new Error(`Server Error: ${trancheResponse.status}`);
      }

      localStorage.setItem("submissionMessage", "Tranche Details Sent for Approval!");
      localStorage.setItem("messageType", "success");
      navigate("/DataCreation/TrancheDetails");
    } catch (error) {
      console.error("Error submitting tranche:", error);
      alert("Error submitting tranche: " + error.message);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
  }

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
        Tranche Details
      </Typography>

      <form onSubmit={getExcel}>
        <Grid container spacing={2}>
          {fieldConfig.map((field) => {
            const dynamicOptions = (() => {
              if (field.name === "lender_code") return lenderCodes;
              if (field.name === "sanction_id")
                return sanctionData.filter(
                  (sanction) => sanction.lender_code === formData.lender_code
                );
              return field.options || [];
            })();

            return (
              <React.Fragment key={field.name}>
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
                      {field.options.map((option) =>
                        typeof option === "object" ? (
                          <MenuItem
                            key={option.lender_code || option.sanction_id}
                            value={option.lender_code || option.sanction_id}
                          >
                            {option.lender_code
                              ? `${option.lender_code} - ${option.lender_name || option.lender_code}`
                              : option.sanction_id}
                          </MenuItem>

                        ) : (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        )
                      )}
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
                      inputProps={{
                        ...(field.maxLength && { maxLength: field.maxLength }),
                        ...(field.minLength && { minLength: field.minLength })
                      }}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                    />
                  )}
                </Grid>
                {/* Insert moratorium error just once below either of the two fields */}
                {(field.name === "moratorium_end_date") && formData.moratorium_start_date && formData.moratorium_end_date && errors.moratorium && (
                  <Grid item xs={12}>
                    <Typography color="error" variant="body2">
                      {errors.moratorium}
                    </Typography>
                  </Grid>
                )}
              </React.Fragment>
            );
          })}

          {/* Bank Details Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Bank Details</Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2}>
              {bankFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
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
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

        </Grid>
        {/* Generate Schedule Button (form submit) */}
        {!showFileUpload && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
            <Button variant="contained" color="primary" type="submit">
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
              <Checkbox checked={showFileUpload} onChange={handleCheckboxChange} />
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


        {/* Save, Back, Reset Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
          <Button variant="contained" color="warning" onClick={() => navigate(-1)}>
            Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={() => {
              if (showFileUpload) {
                handleFileUploadToDB();
              } else {
                handleUpload();
              }
            }}
          >
            Save
          </Button>
          {/* <Button variant="contained" color="error" onClick={handleReset}>
            Reset
          </Button> */}
        </Box>
      </form>
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

export default TrancheDetails;