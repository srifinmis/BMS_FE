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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const API_URL = process.env.REACT_APP_API_URL;

const SummaryReport = ({ isDropped }) => {
    const [reportTypes] = useState([
        { key: 'lender_master', label: 'Lender Master Report' },
        { key: 'sanction_details', label: 'Sanction Details Report' },
        { key: 'tranche_details', label: 'Tranche Details Report' },
        { key: 'repayment_schedule', label: 'Repayment Schedule Report' },
        { key: 'daily_repayment_statement', label: 'Daily Repayment Statement Report' },
        { key: 'datewise_repayment_statement', label: 'Date Wise Repayment Statement Report' },
        { key: 'roc_charge_creation', label: 'ROC Charge Creation Report' },
        { key: 'roc_satisfactionof_charge', label: 'ROC Satisfaction Of Charge Report' },
    ]);
    const [selectedReportTypes, setSelectedReportTypes] = useState("");
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [date, setDate] = useState(dayjs());
    const [lenders, setLenders] = useState([]);
    const [selectedLenders, setSelectedLenders] = useState([]);
    const [format, setFormat] = useState("excel");
    const [sortBy, setSortBy] = useState("");

    useEffect(() => {
        if (["lender_master", "sanction_details"].includes(selectedReportTypes)) {
            fetch(`${API_URL}/sanction/lendercodes`)
                .then((res) => res.json())
                .then((data) => {
                    const options = data?.data || [];
                    setLenders(options);
                })
                .catch((err) => console.error("Error fetching lenders:", err));
        } else if (selectedReportTypes === "tranche_details") {
            fetch(`${API_URL}/tranche/findTwo`)
                .then((res) => res.json())
                .then((data) => {
                    const uniqueLendersMap = new Map();
                    data.data.forEach(lender => {
                        if (!uniqueLendersMap.has(lender.lender_code)) {
                            uniqueLendersMap.set(lender.lender_code, {
                                lender_code: lender.lender_code,
                            });
                        }
                    });
                    const uniqueLendersList = Array.from(uniqueLendersMap.values());
                    setLenders(uniqueLendersList);
                })
                .catch((err) => console.error("Failed to fetch lenders", err));
        } else if (selectedReportTypes === "repayment_schedule") {
            fetch(`${API_URL}/tranche/findTwo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ flag: 1 }) // Send the flag here
            })
                .then((res) => res.json())
                .then((data) => {
                    const uniqueLendersMap = new Map();
                    data.data.forEach(lender => {
                        if (!uniqueLendersMap.has(lender.lender_code)) {
                            uniqueLendersMap.set(lender.lender_code, {
                                lender_code: lender.lender_code,
                            });
                        }
                    });
                    const uniqueLendersList = Array.from(uniqueLendersMap.values());
                    setLenders(uniqueLendersList);
                })
                .catch((err) => console.error("Failed to fetch lenders", err));        
        } else if (["daily_repayment_statement", "datewise_repayment_statement"].includes(selectedReportTypes)) {
            fetch(`${API_URL}/repaymentschedule/lenders`)
                .then((res) => res.json())
                .then((data) => {
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
        } else if (["roc_charge_creation", "roc_satisfactionof_charge"].includes(selectedReportTypes)) {
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
        }
    }, [selectedReportTypes]);

    const handleGenerateReport = async () => {
        const payload = {
            reportTypes: selectedReportTypes,
            fromDate: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : undefined,
            toDate: toDate ? dayjs(toDate).format("YYYY-MM-DD") : undefined,
            date: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
            lenders: selectedLenders.includes("all") ? "all" : selectedLenders,
            format: format,
            sortBy: selectedReportTypes === "sanction_details" || selectedReportTypes === "tranche_details" || selectedReportTypes === "datewise_repayment_statement" ? sortBy : undefined,
        };
        console.log("Payload being sent:", payload);
        

        const reportEndpoints = {
            lender_master: "/generate-lender-master",
            sanction_details: "/generate-sanction-master",
            tranche_details: "/generate-LoanTrancheDetailsReport",
            repayment_schedule: "/generate-RepaymentScheduleReport",
            daily_repayment_statement: "/generate-DailyRepaymentReport",
            datewise_repayment_statement: "/generate-DatewiseRepaymentReport",
            roc_charge_creation: "/generate-Rocchangecreation",
            roc_satisfactionof_charge: "/generate-Rocsatisfactionchange"
        };

        const endpoint = reportEndpoints[selectedReportTypes];
        if (!endpoint) {
            console.error("Unknown Report Type");
            return;
        }

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to generate report");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const reportNameMap = {
                lender_master: "LenderMaster",
                sanction_details: "SanctionDetails",
                tranche_details: "TrancheDetails",
                repayment_schedule: "RepaymentSchedule",
                daily_repayment_statement: "DailyRepaymentStatement",
                datewise_repayment_statement: "DateWiseRepaymentStatement",
                roc_charge_creation: "ROCChargeCreation",
                roc_satisfactionof_charge: "ROCSatisfactionOfCharge"
            };
            const timestamp = dayjs().format("YYYYMMDD");
            const reportName = reportNameMap[selectedReportTypes] || 'Report';
            const extension = { excel: "xlsx", pdf: "pdf", word: "docx" };
            a.download = `${reportName}_${timestamp}.${extension[format]}`;
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
                    Summary Reports
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Report Types</InputLabel>
                            <Select
                                value={selectedReportTypes}
                                onChange={(e) => {
                                    setSelectedReportTypes(e.target.value)
                                    setSelectedLenders("");
                                    
                                    setFromDate(null);
                                    setToDate(null);
                                    setFormat("excel");
                                    setSortBy("");
                                }}
                                label="Report Types"
                            >
                                {reportTypes.map((type) => (
                                    <MenuItem key={type.key} value={type.key}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {(selectedReportTypes === "lender_master" || selectedReportTypes === "sanction_details" || selectedReportTypes === "tranche_details" || selectedReportTypes === "datewise_repayment_statement" || selectedReportTypes === "roc_charge_creation" || selectedReportTypes === "roc_satisfactionof_charge") && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="From Date"
                                    value={fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : ""}
                                    onChange={(e) => setFromDate(dayjs(e.target.value))}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="To Date"
                                    value={toDate ? dayjs(toDate).format('YYYY-MM-DD') : ""}
                                    onChange={(e) => setToDate(dayjs(e.target.value))}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Lender(s)</InputLabel>
                                    <Select
                                        required
                                        value={selectedLenders}
                                        onChange={(e) => setSelectedLenders(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
                                        label="Lender(s)"
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        {lenders.map((lender) => (
                                            <MenuItem key={lender.lender_code} value={lender.lender_code}>
                                                {lender.lender_code}-{lender.lender_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Format</InputLabel>
                                    <Select
                                        required
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
                            {selectedReportTypes === "sanction_details" && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Sort By</InputLabel>
                                        <Select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            label="Sort By"
                                        >
                                            <MenuItem value="lender_code">Lender Code</MenuItem>
                                            <MenuItem value="sanction_date">Sanction Date</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                            {(selectedReportTypes === "tranche_details" || selectedReportTypes === "datewise_repayment_statement") && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Sort By</InputLabel>
                                        <Select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            label="Sort By"
                                        >
                                            <MenuItem value="lender_code">Lender Code</MenuItem>
                                            <MenuItem value="due_date">Due Date</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                        </>
                    )}
                    {selectedReportTypes === "repayment_schedule" && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Bank Code</InputLabel>
                                    <Select
                                        required
                                        value={selectedLenders}
                                        onChange={(e) => setSelectedLenders(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
                                        label="Bank Code"
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        {lenders.map((lender) => (
                                            <MenuItem key={lender.lender_code} value={lender.lender_code}>
                                                {lender.lender_code}-{lender.lender_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Sanction No</InputLabel>
                                    <Select
                                        required
                                        value={selectedLenders}
                                        onChange={(e) => setSelectedLenders(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
                                        label="Sanction No"
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        {lenders.map((lender) => (
                                            <MenuItem key={lender.lender_code} value={lender.lender_code}>
                                                {lender.lender_code}-{lender.lender_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Tranche No</InputLabel>
                                    <Select
                                        required
                                        value={selectedLenders}
                                        onChange={(e) => setSelectedLenders(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
                                        label="Tranche No"
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        {lenders.map((lender) => (
                                            <MenuItem key={lender.lender_code} value={lender.lender_code}>
                                                {lender.lender_code}-{lender.lender_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Format</InputLabel>
                                    <Select
                                        required
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
                        </>
                    )}
                    {selectedReportTypes === "daily_repayment_statement" && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Date"
                                    value={date ? dayjs(date).format('YYYY-MM-DD') : ""}
                                    onChange={(e) => setDate(dayjs(e.target.value))}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Lender(s)</InputLabel>
                                    <Select
                                        required
                                        value={selectedLenders}
                                        onChange={(e) => setSelectedLenders(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
                                        label="Lender(s)"
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        {lenders.map((lender) => (
                                            <MenuItem key={lender.lender_code} value={lender.lender_code}>
                                                {lender.lender_code}-{lender.lender_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Format</InputLabel>
                                    <Select
                                        required
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
                        </>
                    )}
                </Grid>
                <Box mt={3} display="flex" justifyContent="center">
                    <Button variant="contained" onClick={handleGenerateReport}
                        disabled={selectedReportTypes.length === 0}
                    >
                        Generate Report
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default SummaryReport;
