import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Typography,
    TextField,
    Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
const API_URL = process.env.REACT_APP_API_URL;

const RocSatisfactionChargeReport = ({ isDropped }) => {
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [lenders, setLenders] = useState([]);
    const [selectedLenders, setSelectedLenders] = useState([]);
    const [format, setFormat] = useState("excel");

    useEffect(() => {
        fetch(`${API_URL}/generate/roc/lendercodes`)
            .then((res) => res.json())
            .then((data) => {
                // Extract lender_code and lender_name from API response
                const lendersList = data.data.map(lender => ({
                    lender_code: lender.lender_code,
                }));
                setLenders(lendersList);
            })
            .catch((err) => console.error("Failed to fetch lenders", err));
    }, []);

    const handleGenerateReport = async () => {
        const payload = {
            fromDate: fromDate.format("YYYY-MM-DD"),
            toDate: toDate.format("YYYY-MM-DD"),
            lenders: selectedLenders.includes("all") ? "all" : selectedLenders,
            format,
        };

        try {
            console.log("payload generate ROC Form: ", payload)
            const res = await fetch(`${API_URL}/generate-Rocsatisfactionchange`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorResponse = await res.json();
                alert(errorResponse.message);
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            let extension = format === "excel" ? "xlsx" : format === "word" ? "docx" : format;

            a.download = `Roc_Satisfaction_of_Charge_Report.${extension}`;
            a.click();
        } catch (err) {
            console.error("Error generating report:", err);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
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
                    ROC Satisfaction of Charge Report
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="From Date"
                            value={fromDate}
                            onChange={(date) => setFromDate(date)}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="To Date"
                            value={toDate}
                            onChange={(date) => setToDate(date)}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Lender Code's</InputLabel>
                            <Select
                                multiple
                                value={selectedLenders}
                                onChange={(e) => setSelectedLenders(e.target.value)}
                                label="Lender(s)"
                            >
                                <MenuItem value="all">All</MenuItem>
                                {lenders.map((lender) => (
                                    <MenuItem key={lender.lender_code} value={lender.lender_code}>
                                        {lender.lender_code}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Format</InputLabel>
                            <Select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                label="Format"
                            >
                                <MenuItem value="excel">Excel</MenuItem>
                                <MenuItem value="pdf">PDF</MenuItem>
                                <MenuItem value="word">Word</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box mt={3} display="flex" justifyContent="center">
                    <Button variant="contained" onClick={handleGenerateReport}>
                        Generate Report
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default RocSatisfactionChargeReport;