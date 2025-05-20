import React, { useState } from 'react';
import {
  Box, Button, Grid, TextField, MenuItem, Select, InputLabel, FormControl,
  Typography, CircularProgress
} from '@mui/material';

const EffectiveInterestRateReport = ({ isDropped }) => {
  const [asOfDate, setAsOfDate] = useState('');
  const [format, setFormat] = useState('Excel');
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const generateReport = async () => {
    setLoading(true);
    setDownloadLink('');

    const reportParams = { asOfDate, format };

    try {
      const response = await fetch(`http://localhost:5002/generate-effective-interest-rate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportParams),
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const data = await response.json();
      setDownloadLink(data.downloadUrl);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
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
      border: "1px solid #ccc",
      borderRadius: 2,
      boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
    }}>
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
        Effective Interest Rate Report
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        <Grid item xs={6}>
          <TextField
            label="As of Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ marginTop: 2 }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Output Format</InputLabel>
            <Select value={format} onChange={(e) => setFormat(e.target.value)}>
              <MenuItem value="Excel">Excel</MenuItem>
              <MenuItem value="PDF">PDF</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', marginTop: 3 }}>
        <Button variant="contained" onClick={generateReport} disabled={loading}>
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Generate Report'}
        </Button>
      </Box>

      {downloadLink && (
        <Typography variant="body2" sx={{ marginTop: '20px', textAlign: 'center' }}>
          Your report is ready! <a href={downloadLink} download>Click here to download</a>
        </Typography>
      )}
    </Box>
  );
};

export default EffectiveInterestRateReport;
