import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DocumentsUpload = ({ isDropped }) => {
  const navigate = useNavigate();
  const [lenderCodes, setLenderCodes] = useState([]);
  const [allSanctionIds, setAllSanctionIds] = useState([]);
  const [filteredSanctionIds, setFilteredSanctionIds] = useState([]);
  const [documentType, setDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [lender_code, setLenderCode] = useState("");
  const [sanctionId, setSanctionId] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadedDate, setUploadedDate] = useState("");
  const [combinationExists, setCombinationExists] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchLenderCodes = async () => {
      try {
        const response = await axios.get(`${API_URL}/sanction/lendercodes`);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setLenderCodes(
            response.data.data.map((item) => ({
              code: item.lender_code,
              name: item.lender_name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching lenders:", error);
      }
    };

    const fetchSanctionIds = async () => {
      try {
        const response = await axios.get(`${API_URL}/roc/sanctionid`);
        if (response.data?.data) {
          setAllSanctionIds(response.data.data); // [{ sanction_id, lender_code }]
        }
      } catch (error) {
        console.error("Error fetching sanction IDs:", error);
      }
    };

    fetchLenderCodes();
    fetchSanctionIds();
  }, [API_URL]);

  const handleLenderChange = (code) => {
    setLenderCode(code);
    setSanctionId("");
    setCombinationExists(false);

    const filtered = allSanctionIds.filter((item) => item.lender_code === code);
    setFilteredSanctionIds(filtered);
  };

  const handleSanctionChange = async (sid) => {
    setSanctionId(sid);
    await checkExistingCombination(lender_code, sid);
  };

  const checkExistingCombination = async (lender, sanction) => {
    try {
      // console.log("check params: ", lender, sanction)
      const res = await axios.get(`${API_URL}/executed/validate`, {
        params: { lender_code: lender, sanction_id: sanction },
      });
      // console.log("check combo: ", res)
      setCombinationExists(res.data.data);
    } catch (err) {
      console.error("Error checking combination:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF and Image files (PNG, JPG, JPEG) are allowed!");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);

    try {
      const response = await axios.post(`${API_URL}/upload-local`, formData);
      if (response.status === 200 && response.data.filePath) {
        setFileUrl(response.data.filePath);
        alert("File uploaded successfully!");
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file. Please check the server.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!fileUrl) {
      alert("Please upload a file first before saving!");
      return;
    }

    if (combinationExists) {
      alert("This lender_code and sanction_id combination already exists!");
      return;
    }

    const createdby = localStorage.getItem("token");
    const updatedby = localStorage.getItem("token");

    const payload = {
      lender_code,
      sanctionId,
      documentType,
      fileName,
      uploadedDate,
      fileUrl,
      createdby,
      updatedby,
    };

    try {
      const response = await axios.post(`${API_URL}/executed/create`, payload);
      if (response.status === 201) {
        localStorage.setItem("submissionMessage", "Executed Document Sent to Approval!");
        localStorage.setItem("messageType", "success");
      } else {
        localStorage.setItem("submissionMessage", "Executed Document Sent to Approval Failed!");
        localStorage.setItem("messageType", "error");
      }
      navigate("/DataCreation/ExecutedDocuments");
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving data to the database.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        marginTop: "70px",
        marginLeft: isDropped ? "100px" : "280px",
        transition: "margin-left 0.3s ease-in-out",
        width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
        padding: 4,
        border: "3px solid #ccc",
        borderRadius: 2,
        // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
        backgroundColor: "#fff",
      }}
    >
      <Typography
        variant="h5"
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
        Upload and Save Documents
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <FormControl required fullWidth size="small">
            <InputLabel>Lender Code / Name</InputLabel>
            <Select value={lender_code} onChange={(e) => handleLenderChange(e.target.value)}>
              {lenderCodes.map((id) => (
                <MenuItem key={id.code} value={id.code}>
                  {id.code} - {id.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl required fullWidth size="small">
            <InputLabel>Sanction ID</InputLabel>
            <Select value={sanctionId} onChange={(e) => handleSanctionChange(e.target.value)}>
              {filteredSanctionIds.map((item) => (
                <MenuItem key={item.sanction_id} value={item.sanction_id}>
                  {item.sanction_id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {combinationExists && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              This lender_code and sanction_id combination already exists.
            </Typography>
          )}
        </Grid>

        <Grid item xs={6}>
          <FormControl required fullWidth size="small">
            <InputLabel>Document Type</InputLabel>
            <Select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
              <MenuItem value="Sanction Letter">Sanction Letter</MenuItem>
              <MenuItem value="Agreement">Agreement</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <TextField
            required
            label="File Name"
            fullWidth
            size="small"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            required
            label="Uploaded Date"
            type="date"
            fullWidth
            size="small"
            value={uploadedDate}
            onChange={(e) => setUploadedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <Button variant="contained" component="label" fullWidth>
            Choose File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Grid>

        <Grid item xs={2}>
          {selectedFile && (
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              {selectedFile.name}
            </Typography>
          )}
        </Grid>

        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Upload"}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent={"center"} alignItems="center">
        <Grid item xs={2}>
          <Button variant="contained" color="warning" fullWidth onClick={() => navigate(-1)}>
            Back
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleSave}
            disabled={!fileUrl}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentsUpload;
