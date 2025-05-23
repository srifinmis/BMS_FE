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
import { Autocomplete } from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const API_URL = process.env.REACT_APP_API_URL;

const SummaryReport = ({ isDropped }) => {
    const reportTypes = [
        { label: "Lender Master Details", value: "lender_master_details" },
        { label: "Sanction Master Details", value: "sanction_master_details" },
        { label: "Loan Tranche Details", value: "loan_tranche_details" },
        { label: "Repayment Schedule", value: "repayment_schedule" },
        { label: "Daily Repayment Statement", value: "daily_repayment_statement" },
        { label: "Datewise Repayment Statement", value: "datewise_repayment_statement" },
        { label: "Effective Interest Rate", value: "effective_interest_rate" },
        { label: "ROC Charge Creation", value: "roc_charge_creation" },
        { label: "ROC Satisfaction of Charge", value: "roc_satisfactionof_charge" },
        { label: "ALM Report", value: "alm_report" },
        { label: "Funding Mix", value: "funding_mix" },
        { label: "Master", value: "master_report" },
        { label: "Drawdown - FY 24-25 ", value: "drawdown_fy24_25" },
        { label: "Drawdown - Consolidated", value: "drawdown_consolidated" },
        { label: "Effective Interest", value: "effective_interest" },
        { label: "RunDown", value: "run_down" },
    ];

    const [selectedReportTypes, setSelectedReportTypes] = useState("");
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [date, setDate] = useState(dayjs());
    const [year, setYear] = useState(dayjs());
    const [lenders, setLenders] = useState([]);
    const [selectedLenders, setSelectedLenders] = useState([]);
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState('');
    const [sanctions, setSanctions] = useState([]);
    const [selectedSanction, setSelectedSanction] = useState('');
    const [tranches, setTranches] = useState([]);
    const [selectedTranche, setSelectedTranche] = useState('');
    const [rawTrancheData, setRawTrancheData] = useState([]);
    const [format, setFormat] = useState("excel");
    const [sortBy, setSortBy] = useState("");

    useEffect(() => {
        if (["lender_master_details", "sanction_master_details"].includes(selectedReportTypes)) {
            fetch(`${API_URL}/sanction/lendercodes`)
                .then((res) => res.json())
                .then((data) => {
                    const options = data?.data || [];
                    setLenders(options);
                })
                .catch((err) => console.error("Error fetching lenders:", err));
        } else if (selectedReportTypes === "loan_tranche_details") {
            fetch(`${API_URL}/tranche/findTwo?flag=1`, {
                method: "GET"
            })
                .then(res => res.json())
                .then(data => {
                    const uniqueLendersMap = new Map();

                    data.data.forEach(tranche => {
                        if (!uniqueLendersMap.has(tranche.lender_code)) {
                            uniqueLendersMap.set(tranche.lender_code, {
                                lender_code: tranche.lender_code,
                                lender_name: tranche.lender_code_lender_master?.lender_name || ""
                            });
                        }
                    });

                    const uniqueLendersList = Array.from(uniqueLendersMap.values());
                    setLenders(uniqueLendersList);
                })
                .catch(err => console.error("Failed to fetch lenders", err));
        }
        else if (selectedReportTypes === "repayment_schedule") {
            fetch(`${API_URL}/repaymentschedule/lenders?flag=1`, {
                method: "GET"
            })
                .then((res) => res.json())
                .then((data) => {
                    setRawTrancheData(data.data);
                    const uniqueBanks = new Set();
                    // const uniqueSanctions = new Set();
                    // const uniqueTranches = new Set();
                    // console.log("res:", data);
                    data.data.forEach((tranche) => {
                        if (tranche.tranche.bank_name) uniqueBanks.add(tranche.tranche.bank_name);
                        // uniqueSanctions.add(tranche.sanction_id);
                        // uniqueTranches.add(tranche.tranche_id);
                    });
                    // console.log("bank names: ", uniqueBanks)
                    setBanks(Array.from(uniqueBanks));
                    // setSanctions(Array.from(uniqueSanctions));
                    // setTranches(Array.from(uniqueTranches));
                })
                .catch((err) => console.error("Failed to fetch tranche details", err));
        } else if (["daily_repayment_statement", "datewise_repayment_statement"].includes(selectedReportTypes)) {
            fetch(`${API_URL}/repaymentschedule/lenders`)
                .then((res) => res.json())
                .then((data) => {
                    const uniqueLendersMap = new Map();
                    data.data.forEach(lender => {
                        if (!uniqueLendersMap.has(lender.lender_code)) {
                            uniqueLendersMap.set(lender.lender_code, {
                                lender_code: lender.lender_code,
                                lender_name: lender.lender_code_lender_master?.lender_name || ''
                            });
                        }
                    });
                    setLenders(Array.from(uniqueLendersMap.values()));
                    // console.log(Array.from(uniqueLendersMap.values()));
                })
                .catch((err) => console.error("Failed to fetch lenders", err));
        } else if (["roc_charge_creation", "roc_satisfactionof_charge"].includes(selectedReportTypes)) {
            fetch(`${API_URL}/generate/roc/lendercodes`)
                .then((res) => res.json())
                .then((data) => {
                    // Extract lender_code and lender_name from API response
                    const lendersList = data.data.map(lender => ({
                        lender_code: lender.lender_code,
                        lender_name: lender.lender_code_lender_master?.lender_name || ''
                    }));
                    setLenders(lendersList);
                })
                .catch((err) => console.error("Failed to fetch lenders", err));
        }
    }, [selectedReportTypes]);

    const handleBankChange = (bank) => {
        setSelectedBank(bank);
        setSelectedSanction('');
        setTranches([]);
        const filteredSanctions = new Set();
        rawTrancheData.forEach(item => {
            if (item.tranche.bank_name === bank) {
                filteredSanctions.add(item.sanction_id);
            }
        });
        setSanctions(Array.from(filteredSanctions));
    };

    const handleSanctionChange = (sanctionId) => {
        setSelectedSanction(sanctionId);
        const filteredTranches = new Set();
        rawTrancheData.forEach(item => {
            if (item.tranche.bank_name === selectedBank && item.sanction_id === sanctionId) {
                filteredTranches.add(item.tranche_id);
            }
        });
        setTranches(Array.from(filteredTranches));
    };

    const handleGenerateReport = async () => {
        const payload = {
            reportTypes: selectedReportTypes,
            format
        };

        if (selectedBank && selectedBank !== "all") {
            payload.banks = [selectedBank];
        } else if (banks.length) {
            payload.banks = banks;
        }

        if (selectedSanction && selectedSanction !== "all") {
            payload.sanctions = [selectedSanction];
        } else if (sanctions.length) {
            payload.sanctions = sanctions;
        }

        if (selectedTranche && selectedTranche !== "all") {
            payload.tranches = [selectedTranche];
        } else if (tranches.length) {
            payload.tranches = tranches;
        }

        if (fromDate) payload.fromDate = dayjs(fromDate).format("YYYY-MM-DD");
        if (toDate) payload.toDate = dayjs(toDate).format("YYYY-MM-DD");
        if (date) payload.date = dayjs(date).format("YYYY-MM-DD");
        // if (year) payload.year = dayjs(year).format("YYYY");
        if (year) {
            const fy = dayjs(year).format("YY");
            payload.year = `FY${fy}`;
        }

        if (selectedLenders.length)
            payload.lenders = selectedLenders.includes("all") ? "all" : selectedLenders;

        if (["sanction_master_details", "loan_tranche_details", "datewise_repayment_statement"].includes(selectedReportTypes)) {
            payload.sortBy = sortBy;
        }

        // if (["drawdown_fy24_25"].includes(selectedReportTypes)) {
        //     payload.year = year;
        // }

        console.log("Payload being sent:", payload);
        const reportEndpoints = {
            lender_master_details: "/generate-lender-master",
            sanction_master_details: "/generate-sanction-master",
            loan_tranche_details: "/generate-LoanTrancheDetailsReport",
            repayment_schedule: "/generate-RepaymentScheduleReport",
            daily_repayment_statement: "/generate-DailyRepaymentReport",
            datewise_repayment_statement: "/generate-DatewiseRepaymentReport",
            effective_interest_rate: "/generate-EffectiveInterestRateReport",
            roc_charge_creation: "/generate-Rocchangecreation",
            roc_satisfactionof_charge: "/generate-Rocsatisfactionchange",
            alm_report: "/generate-ALMReport",
            funding_mix: "/generate-FundingMixReport",
            master_report: "/generate-MasterReport",
            drawdown_fy24_25: "/drawdowns",
            drawdown_consolidated: "/drawdowns-consolidated",
            effective_interest: "/generate-EffectiveInterestofReport",
            run_down: "/generate-RundownReport",
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

            if (!res.ok) {
                const error = await res.json();
                alert(error.message);
                throw new Error("Failed to generate report");
            }

            const timestamp = dayjs().format("YYYYMMDD");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const reportNameMap = {
                lender_master_details: "LenderMasterDetails",
                sanction_master_details: "SanctionMasterDetails",
                loan_tranche_details: "LoanTrancheDetails",
                repayment_schedule: "RepaymentSchedule",
                daily_repayment_statement: "DailyRepaymentStatement",
                datewise_repayment_statement: "DateWiseRepaymentStatement",
                effective_interest_rate: "EffectiveInterestRate",
                roc_charge_creation: "ROCChargeCreation",
                roc_satisfactionof_charge: "ROCSatisfactionOfCharge",
                alm_report: "ALMReport",
                funding_mix: "FundingMix",
                master_report: "MasterReport",
                drawdown_fy24_25: "DrawdownFY2425",
                drawdown_consolidated: "DrawdownConsolidated",
                effective_interest: "EffectiveInterest",
                run_down: "RunDown"
            };
            const reportName = reportNameMap[selectedReportTypes] || 'Report';
            const extension = { excel: "xlsx", pdf: "pdf", word: "docx" };
            a.download = `${reportName}_${timestamp}.${extension[format]}`;
            a.click();
        } catch (err) {
            console.error("Error generating report:", err);
            // alert("❌ Failed to generate report. Please try again.\nError: " + err.message);
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
                    Summary Reports
                </Typography>

                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            fullWidth
                            options={reportTypes}
                            getOptionLabel={(option) => option.label}
                            value={reportTypes.find((type) => type.value === selectedReportTypes) || null}
                            onChange={(event, newValue) => {
                                setSelectedReportTypes(newValue ? newValue.value : '');
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Report Type" required />
                            )}
                        />
                    </Grid>
                    {(selectedReportTypes === "lender_master_details" || selectedReportTypes === "sanction_master_details" || selectedReportTypes === "loan_tranche_details" || selectedReportTypes === "datewise_repayment_statement" || selectedReportTypes === "roc_charge_creation" || selectedReportTypes === "roc_satisfactionof_charge") && (
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
                        </>
                    )}
                    {(selectedReportTypes === "lender_master_details" || selectedReportTypes === "sanction_master_details" || selectedReportTypes === "loan_tranche_details" || selectedReportTypes === "datewise_repayment_statement" || selectedReportTypes === "roc_charge_creation" || selectedReportTypes === "roc_satisfactionof_charge") && (
                        <>
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
                        </>
                    )}
                    {(selectedReportTypes === "lender_master_details" || selectedReportTypes === "sanction_master_details" || selectedReportTypes === "loan_tranche_details") && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    multiple
                                    fullWidth
                                    options={[{ lender_code: "all", lender_name: "Lenders" }, ...lenders]}
                                    getOptionLabel={(option) => `${option.lender_code} - ${option.lender_name}`}
                                    value={
                                        selectedLenders.includes("all")
                                            ? [{ lender_code: "all", lender_name: "Lenders" }]
                                            : lenders.filter((lender) => selectedLenders.includes(lender.lender_code))
                                    }
                                    onChange={(event, newValue) => {
                                        // If "All" is selected
                                        if (newValue.some((val) => val.lender_code === "all")) {
                                            setSelectedLenders(["all"]);
                                        } else {
                                            setSelectedLenders(newValue.map((val) => val.lender_code));
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Lender Code / Name(s)"
                                            placeholder="Search Lender(s)"
                                            required
                                        />
                                    )}
                                    disableCloseOnSelect
                                />
                            </Grid>
                        </>
                    )}
                    {/* for datewise repayment */}
                    {(selectedReportTypes === "datewise_repayment_statement" || selectedReportTypes === "daily_repayment_statement") && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    multiple
                                    fullWidth
                                    options={[{ lender_code: "all", lender_name: "Lenders" }, ...lenders]}
                                    getOptionLabel={(option) =>
                                        `${option.lender_code} - ${option.lender_code_lender_master?.lender_name || option.lender_name}`
                                    }
                                    value={
                                        selectedLenders.includes("all")
                                            ? [{ lender_code: "all", lender_name: "Lenders" }]
                                            : lenders.filter((lender) => selectedLenders.includes(lender.lender_code))
                                    }
                                    onChange={(event, newValue) => {
                                        if (newValue.some((val) => val.lender_code === "all")) {
                                            setSelectedLenders(["all"]);
                                        } else {
                                            setSelectedLenders(newValue.map((val) => val.lender_code));
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Lender Code / Name(s)"
                                            placeholder="Search Lender(s)"
                                            required
                                        />
                                    )}
                                    disableCloseOnSelect
                                />
                            </Grid>
                        </>
                    )}
                    {/* for roc charge repayment */}
                    {(selectedReportTypes === "roc_charge_creation" || selectedReportTypes === "roc_satisfactionof_charge") && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    multiple
                                    fullWidth
                                    options={[{ lender_code: "all", lender_name: "Lenders" }, ...lenders]}
                                    getOptionLabel={(option) =>
                                        `${option.lender_code} - ${option.lender_code_lender_master?.lender_name || option.lender_name}`
                                    }
                                    value={
                                        selectedLenders.includes("all")
                                            ? [{ lender_code: "all", lender_name: "Lenders" }]
                                            : lenders.filter((lender) => selectedLenders.includes(lender.lender_code))
                                    }
                                    onChange={(event, newValue) => {
                                        if (newValue.some((val) => val.lender_code === "all")) {
                                            setSelectedLenders(["all"]);
                                        } else {
                                            setSelectedLenders(newValue.map((val) => val.lender_code));
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Lender Code / Name(s)"
                                            placeholder="Search Lender(s)"
                                            required
                                        />
                                    )}
                                    disableCloseOnSelect
                                />
                            </Grid>
                        </>
                    )}
                    {selectedReportTypes === "sanction_master_details" && (
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
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
                    {(selectedReportTypes === "loan_tranche_details" || selectedReportTypes === "datewise_repayment_statement") && (
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
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
                    {selectedReportTypes === "repayment_schedule" && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    fullWidth
                                    options={banks}
                                    getOptionLabel={(option) => option}
                                    value={selectedBank}
                                    onChange={(event, newValue) => handleBankChange(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Bank Code"
                                            placeholder="Search Bank Code"
                                            required
                                        />
                                    )}
                                    disableClearable
                                />
                            </Grid>
                        </>
                    )}
                    {(selectedReportTypes === "repayment_schedule") && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    fullWidth
                                    options={sanctions}
                                    getOptionLabel={(option) => option}
                                    value={selectedSanction}
                                    onChange={(event, newValue) => handleSanctionChange(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sanction No"
                                            placeholder="Search Sanction No"
                                            required
                                        />
                                    )}
                                    disableClearable
                                />
                            </Grid>
                        </>
                    )}
                    {(selectedReportTypes === "repayment_schedule") && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    fullWidth
                                    options={tranches}
                                    getOptionLabel={(option) => option}
                                    value={selectedTranche}
                                    onChange={(event, newValue) => setSelectedTranche(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tranche No"
                                            placeholder="Search Tranche No"
                                            required
                                        />
                                    )}
                                    disableClearable
                                />
                            </Grid>
                        </>
                    )}
                    {(selectedReportTypes === "daily_repayment_statement" || selectedReportTypes === "effective_interest_rate" || selectedReportTypes === "funding_mix" || selectedReportTypes === "alm_report") && (
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
                        </>
                    )}
                    {(selectedReportTypes === "drawdown_fy24_25") && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    views={['year']}
                                    label="Year"
                                    value={year}
                                    onChange={(newValue) => setYear(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth required />
                                    )}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </>
                    )}
                    {(selectedReportTypes === "lender_master_details" || selectedReportTypes === "sanction_master_details" || selectedReportTypes === "loan_tranche_details" || selectedReportTypes === "repayment_schedule" || selectedReportTypes === "datewise_repayment_statement" || selectedReportTypes === "daily_repayment_statement" || selectedReportTypes === "roc_charge_creation" || selectedReportTypes === "roc_satisfactionof_charge") && (
                        <>
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
