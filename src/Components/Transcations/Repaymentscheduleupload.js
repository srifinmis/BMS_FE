import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";

const columnMappings = {
  "Sanction ID": "sanction_id",
  "Tranche ID": "tranche_id",
  "Due Date": "due_date",
  "Principal Due": "principal_due",
  "Interest Due": "interest_due",
  "Total Due": "total_due",
};

const expectedHeaders = Object.keys(columnMappings);

export default function ExcelUpload({ isDropped }) {
  const [fileData, setFileData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const rawSheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

      if (rawSheet.length === 0) {
        setError("The uploaded file is empty.");
        setFileData([]);
        return;
      }

      const sheetHeaders = rawSheet[0].map((header) => header.trim());

      if (!expectedHeaders.every((header) => sheetHeaders.includes(header))) {
        setError("Invalid file format. Please use the correct template.");
        setFileData([]);
        return;
      }

      const formattedData = rawSheet
        .slice(1)
        .map((row) => {
          const rowData = Object.fromEntries(
            sheetHeaders.map((header, index) => {
              let value = row[index] ?? "";

              if (header === "Due Date" && value instanceof Date) {
                value = value.toISOString().split("T")[0];
              }

              return [columnMappings[header], value];
            })
          );

          if (!rowData["sanction_id"]?.trim() || !rowData["tranche_id"]?.trim() || !rowData["due_date"]?.trim() || rowData["principal_due"] <= 0) {
            return null;
          }

          rowData["createdby"] = localStorage.getItem("token") || "";
          rowData["updatedby"] = localStorage.getItem("token") || "";
          return rowData;
        })
        .filter(Boolean);

      setError(null);
      setSuccessMessage(null);
      setFileData(formattedData);
      // console.log("uploading: ", formattedData)
    };
  };

  const handleSubmit = async () => {
    if (fileData.length === 0) {
      setError("No valid data to submit.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // console.log("file data: ", fileData)
      const response = await fetch(`${API_URL}/upload-repayment-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ fileData }]),
      });
      // console.log("repayment: ", response)
      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Data uploaded successfully!");
        setFileData([]);
      } else {
        setError(result.message || "Failed to upload data.");
      }
    } catch (error) {
      setError("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "70px", marginLeft: isDropped ? "100px" : "280px", transition: "margin-left 0.3s ease", width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)", padding: 3, border: "1px solid #ccc", borderRadius: 2, boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)", backgroundColor: "#fff" }}>
      <Typography sx={{ color: "#0056b3", fontWeight: "600", fontSize: "20px", marginBottom: "20px", textAlign: "center", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #0056b3", paddingBottom: "10px" }}>Repayment Schedule Upload</Typography>

      <Grid container spacing={2} sx={{ width: "100%", maxWidth: 200 }}>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" component="label">
            Choose File
            <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
          </Button>
        </Grid>

        <Grid item xs={12}>
          {error && <Typography color="error">{error}</Typography>}
          {successMessage && <Typography color="success">{successMessage}</Typography>}
        </Grid>
      </Grid>

      {fileData.length > 0 && (
        <Box sx={{ width: "100%", marginTop: 3 }}>
          <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 1 }}>File Preview</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {expectedHeaders.map((header) => (
                    <TableCell key={header} sx={{ fontWeight: "bold" }}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {fileData.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(columnMappings).map((backendKey) => (
                      <TableCell key={backendKey}>{row[backendKey]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
        <Button variant="contained" color="primary" disabled={!fileData.length || loading} onClick={handleSubmit}>{loading ? <CircularProgress size={24} /> : "Submit"}</Button>
        <Button variant="contained" color="error" onClick={() => setFileData([])} disabled={loading}>Reset</Button>
      </Box>
    </Box>
  );
}