import React, { useEffect, useState } from "react";
import {
    Box, Button, MenuItem, FormControl, InputLabel, Select, Typography,
    TextField, Grid, FormHelperText
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const API_URL = process.env.REACT_APP_API_URL;

const DatewiseRepaymentReport = ({ isDropped }) => {
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [lenders, setLenders] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [selectedLenders, setSelectedLenders] = useState([]);
    const [format, setFormat] = useState("excel");
    const [errors, setErrors] = useState({});

    const sortOptions = [
        { value: 'lender_code', label: 'Lender Code' },
        { value: 'due_date', label: 'Due Date' },
    ];

    useEffect(() => {
        fetch(`${API_URL}/repaymentschedule/lenders`)
            .then((res) => res.json())
            .then((data) => {
                // const lendersList = data.data.map(lender => ({
                //     lender_code: lender.lender_code,
                // }));
                // setLenders(lendersList);
                const uniqueLendersMap = new Map();

                data.data.forEach(lender => {
                    if (!uniqueLendersMap.has(lender.lender_code)) {
                        uniqueLendersMap.set(lender.lender_code, {
                            lender_code: lender.lender_code
                        });
                    }
                });

                setLenders(Array.from(uniqueLendersMap.values()));
            })
            .catch((err) => console.error("Failed to fetch lenders", err));
    }, []);

    const validateFields = () => {
        const newErrors = {};
        if (!fromDate) newErrors.fromDate = 'From date is required';
        if (!toDate) newErrors.toDate = 'To date is required';
        if (selectedLenders.length === 0) newErrors.selectedLenders = 'Atleast one lender must be selected';
        if (!sortBy) newErrors.sortBy = 'Sort option is required';
        if (!format) newErrors.format = 'Format is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGenerateReport = async () => {
        if (!validateFields()) return;

        const payload = {
            fromDate: fromDate.format("YYYY-MM-DD"),
            toDate: toDate.format("YYYY-MM-DD"),
            lenders: selectedLenders.includes("all") ? "all" : selectedLenders,
            format,
            sortBy
        };

        try {
            const res = await fetch(`${API_URL}/generate-DatewiseRepaymentReport`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorResponse = await res.json();
                alert(errorResponse.message);
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const extension = format === "excel" ? "xlsx" : format === "word" ? "docx" : format;
            a.download = `DateWise_Repayment_Statement_Report.${extension}`;
            a.click();
        } catch (err) {
            console.error("Error generating report:", err);
            alert("An error occurred while generating the report.");
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
                    Date Wise Repayment Statement Report
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="From Date"
                            value={fromDate}
                            onChange={(date) => setFromDate(date)}
                            renderInput={(params) =>
                                <TextField fullWidth {...params} error={!!errors.fromDate} helperText={errors.fromDate} />
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="To Date"
                            value={toDate}
                            onChange={(date) => setToDate(date)}
                            renderInput={(params) =>
                                <TextField fullWidth {...params} error={!!errors.toDate} helperText={errors.toDate} />
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.selectedLenders}>
                            <InputLabel>Lender(s)</InputLabel>
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
                            {errors.selectedLenders && (
                                <FormHelperText>{errors.selectedLenders}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Sort By"
                            fullWidth
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            error={!!errors.sortBy}
                            helperText={errors.sortBy}
                        >
                            {sortOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.format}>
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
                            {errors.format && <FormHelperText>{errors.format}</FormHelperText>}
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

export default DatewiseRepaymentReport;
