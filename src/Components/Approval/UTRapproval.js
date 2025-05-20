import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Spin, message, Checkbox, } from "antd";
import axios from "axios";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UTRUploadApprovalAll = ({ isDropped }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const [lenders, setLenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [remarksError, setRemarksError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLenders = async () => {
            setLoading(true);

            const submissionMessage = localStorage.getItem("submissionMessage");
            const messageType = localStorage.getItem("messageType");

            if (submissionMessage) {
                // Show toast message
                if (messageType === "success") {
                    toast.success(submissionMessage);
                } else if (messageType === "error") {
                    toast.error(submissionMessage);
                }
                setTimeout(() => {
                    localStorage.removeItem("submissionMessage");
                    localStorage.removeItem("messageType");
                }, 5000);
            }

            try {
                const response = await axios.get(`${API_URL}/UTR/pendingData`);
                console.log("get UTR Upload fetchall: ", response)
                if (response.status === 201) {
                    const sortedData = response.data.data.sort(
                        (a, b) => new Date(b.createdat) - new Date(a.createdat)
                    );
                    setLenders(sortedData);
                    // setLenders(response.data.data);
                } else {
                    message.error("Failed to fetch UTR Upload");
                }
            } catch (error) {
                message.error("Error fetching UTR Upload");
            } finally {
                setLoading(false);
            }
        };
        fetchLenders();
    }, [API_URL]);

    const groupedLenders = lenders.reduce((groups, lender) => {
        const key = `${lender.sanction_id}-${lender.tranche_id}`;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(lender);
        return groups;
    }, {});

    const handleView = (key) => {
        setSelectedGroup(groupedLenders[key]);
        setModalVisible(true);
    };

    const handleSelectAllChange = (e) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            setSelectedRows(Object.keys(groupedLenders).map((key) => key));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (e, key) => {
        if (e.target.checked) {
            setSelectedRows([...selectedRows, key]);
        } else {
            setSelectedRows(selectedRows.filter((id) => id !== key));
        }
    };
    const handleApprove = async () => {
        if (selectedRows.length === 0) {
            toast.warning("No UTR Upload selected.");
            return;
        }

        try {
            const payload = selectedRows.map((key) => {
                const lendersDetails = groupedLenders[key];
                return lendersDetails.map((lender) => ({
                    sanction_id: lender.sanction_id,
                    tranche_id: lender.tranche_id,
                    lender_code: lender.lender_code,
                    due_date: lender.due_date,
                    payment_date: lender.payment_date,
                    utr_no: lender.utr_no,
                    due_amt: lender.due_amt,
                    payment_amount: lender.payment_amount,
                    pricipal_coll: lender.pricipal_coll,
                    interest_coll: lender.interest_coll,
                    createdat: lender.createdat,
                    createdby: lender.createdby,
                    remarks: lender.remarks,
                    approval_status: "Approved",
                }));
            }).flat();

            const response = await axios.post(`${API_URL}/UTR/Approve`, payload);

            if (response.status === 201) {
                setLenders((prev) =>
                    prev.filter((lender) =>
                        !payload.some(
                            (approved) =>
                                lender.sanction_id === approved.sanction_id &&
                                lender.tranche_id === approved.tranche_id &&
                                lender.due_date === approved.due_date
                        )
                    )
                );
                localStorage.setItem("submissionMessage", "UTR Upload Schedule Approved!");
                localStorage.setItem("messageType", "success");
                navigate("/dashboard");
                setSelectedRows([]);
            } else {
                toast.error("UTR Upload Approval failed!"); // Error toast
            }
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || "Approval failed."}`); // Error toast
        }
    };

    const handleReject = async () => {
        if (selectedRows.length === 0) {
            alert("No UTR Upload selected.");
            return;
        }
        if (!remarks.trim()) {
            setRemarksError(true);
            alert("Please enter remarks before rejecting.");
            return;
        }

        try {
            const payload = selectedRows.map((key) => {
                const lendersDetails = groupedLenders[key];
                return lendersDetails.map((lender) => ({
                    sanction_id: lender.sanction_id,
                    tranche_id: lender.tranche_id,
                    due_date: lender.due_date,
                    remarks: remarks.trim(),
                }));
            }).flat();

            const response = await axios.post(`${API_URL}/UTR/reject`, payload);
            if (response.status === 201) {
                setLenders((prev) =>
                    prev.filter(
                        (lender) =>
                            !selectedRows.some(
                                (row) =>
                                    row.sanction_id === lender.sanction_id &&
                                    row.tranche_id === lender.tranche_id &&
                                    row.due_date === lender.due_date
                            )
                    )
                );
                // toast.success("Repayment Schedule Rejected successfully!"); // Success toast
                localStorage.setItem("submissionMessage", "UTR Upload Rejected !");
                localStorage.setItem("messageType", "success");

                navigate("/dashboard");

                setSelectedRows([]);
                setRemarks("");
                setRemarksError(false);
            } else {
                toast.error("UTR Upload Rejection failed."); // Error toast
            }
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || "Rejection failed."}`); // Error toast
        }
    };

    const columns = [
        {
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
            title: (
                <Checkbox
                    style={{ transform: "scale(1.6)" }}
                    indeterminate={selectedRows.length > 0 && selectedRows.length < Object.keys(groupedLenders).length}
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
            ),
            key: "selectAll",
            render: (_, record) => (
                <Checkbox
                    style={{ transform: "scale(1.6)" }}
                    checked={selectedRows.includes(record.key)}
                    onChange={(e) => handleSelectRow(e, record.key)}
                />
            ),
        },
        {
            title: "Lender Code",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
            dataIndex: "lender_code",
            key: "lender_code",
            render: (_, record) => groupedLenders[record.key]?.[0]?.lender_code || "N/A"
        },
        {
            title: "Sanction ID", dataIndex: "sanction_id", key: "sanction_id",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
        },
        {
            title: "Tranche ID", dataIndex: "tranche_id", key: "tranche_id",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
        },
        {
            title: "Action",
            key: "action",
            onHeaderCell: () => ({
                style: { backgroundColor: "#a2b0cc", color: "black" }
            }),
            render: (_, record) => (
                <Button type="primary" onClick={() => handleView(`${record.sanction_id}-${record.tranche_id}`)}>
                    View
                </Button>
            ),
        },
    ];

    const detailColumns = [
        // { title: "Lender Code", dataIndex: "lender_code", key: "lender_code" },
        // { title: "Sanction ID", dataIndex: "sanction_id", key: "sanction_id" },
        // { title: "Tranche ID", dataIndex: "tranche_id", key: "tranche_id" },
        { title: "Due Date", dataIndex: "due_date", key: "due_date" },
        { title: "Payment Date", dataIndex: "payment_date", key: "payment_date" },
        { title: "Payment Amount", dataIndex: "payment_amount", key: "payment_amount" },
        { title: "UTR No", dataIndex: "utr_no", key: "utr_no" },
        { title: "Principal Coll", dataIndex: "pricipal_coll", key: "pricipal_coll" },
        { title: "Interest Coll", dataIndex: "interest_coll", key: "interest_coll" },
        // { title: "Due Amount", dataIndex: "due_amt", key: "due_amt" },
        // { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    ];

    return (
        <div
            style={{
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
                border: "3px solid #ccc",
                borderRadius: 10,
                // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
            }}
        >
            <ToastContainer position="top-right" autoClose={5000} />
            <h2 style={{ textAlign: "center", borderBottom: "2px solid #0056b3", paddingBottom: 10 }}>
                UTR Upload Form Approval
            </h2>
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
            ) : Object.keys(groupedLenders).length === 0 ? (
                <p style={{ textAlign: "center" }}>No Pending UTR Upload's Available</p>
            ) : (
                <Table bordered
                    dataSource={Object.keys(groupedLenders).map((key) => {
                        const [sanction_id, tranche_id] = key.split("-");
                        return { key, sanction_id, tranche_id };
                    })}
                    columns={columns}
                    pagination={false}
                    rowKey="key"
                />
            )}

            <Modal
                title="UTR Upload Details"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}

                style={{
                    width: "1000",
                    position: "relative",
                    right: "-100px",
                    zIndex: 999,
                    transform: "translateY(0%)",
                }}
                bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
                centered
            >
                {selectedGroup && (
                    <Table
                        dataSource={selectedGroup}
                        columns={detailColumns}
                        rowKey={(record) => record.repayment_id}
                        pagination={false}
                    />
                )}
            </Modal>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", marginRight: "0px" }}>
                <TextField
                    label="Remarks (Required for Rejection)"
                    value={remarks}
                    onChange={(e) => {
                        setRemarks(e.target.value);
                        if (e.target.value.trim()) setRemarksError(false); // Remove error when user types
                    }}
                    multilines
                    rows={0} xs={12} sm={6}
                    sx={{ marginTop: 2, width: "400px" }}
                    required
                    error={remarksError}
                    helperText={remarksError ? "Remarks are required when rejecting." : ""}
                />
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 5, width: "100%" }}>
                <Button
                    type="primary"
                    style={{ marginBottom: "20px", marginRight: "20px", fontSize: "18px", height: "40px" }}
                    onClick={handleApprove}
                    disabled={selectedRows.length === 0 || loading}
                >
                    Approve
                </Button>
                <Button
                    type="primary" danger
                    style={{ marginBottom: "20px", marginRight: "20px", fontSize: "18px", height: "40px", borderColor: "white" }}
                    onClick={handleReject}
                    disabled={selectedRows.length === 0 || loading || !remarks.trim()}
                >
                    Reject
                </Button>

            </div>
        </div>
    );
};

export default UTRUploadApprovalAll;




// import React, { useState, useEffect } from "react";
// import { Table, Checkbox, message, Spin } from "antd";
// import { Typography, TextField, Button } from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UTRApproval = ({ isDropped }) => {
//     const API_URL = process.env.REACT_APP_API_URL;

//     const [selectedRows, setSelectedRows] = useState([]);
//     const [remarks, setRemarks] = useState("");
//     const [remarksError, setRemarksError] = useState(false);
//     const [interestRates, setInterestRates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchInterestRates = async () => {
//             setLoading(true);
//             const submissionMessage = localStorage.getItem("submissionMessage");
//             const messageType = localStorage.getItem("messageType");

//             if (submissionMessage) {
//                 // Show toast message
//                 if (messageType === "success") {
//                     toast.success(submissionMessage);
//                 } else if (messageType === "error") {
//                     toast.error(submissionMessage);
//                 }
//                 setTimeout(() => {
//                     localStorage.removeItem("submissionMessage");
//                     localStorage.removeItem("messageType");
//                 }, 5000);
//             }
//             try {
//                 const response = await axios.get(`${API_URL}/UTR/pendingData`);
//                 console.log("pending intrest: ", response)
//                 if (response.status === 201) {
//                     const sortedData = response.data.data.sort(
//                         (a, b) => new Date(b.updatedat || b.createdat) - new Date(a.updatedat || a.createdat));

//                     setInterestRates(sortedData);
//                 } else {
//                     message.error("Failed to fetch interest rate changes");
//                 }
//             } catch (error) {
//                 console.error("Error fetching interest rates:", error);
//                 message.error("Error fetching interest rates");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchInterestRates();
//     }, [API_URL]);

//     const handleSelect = (record) => {
//         setSelectedRows((prev) => {
//             const exists = prev.some(
//                 (row) => row.payment_id_id === record.payment_id && row.sanction_id === record.sanction_id && row.tranche_id === record.tranche_id
//             );

//             if (exists) {
//                 return prev.filter(
//                     (row) => !(row.payment_id === record.payment_id && row.sanction_id === record.sanction_id && row.tranche_id === record.tranche_id)
//                 );
//             } else {
//                 return [...prev, record];
//             }
//         });
//     };

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             setSelectedRows(interestRates.map(({ sanction_id, tranche_id }) => ({ sanction_id, tranche_id })));
//         } else {
//             setSelectedRows([]);
//         }
//     };

//     const handleViewDetails = (sanction_id, lender_code, tranche_id, approval_status, createdat) => {
//         navigate(`/UTRapprove/${sanction_id}`, {
//             state: { sanction_id, lender_code, tranche_id, approval_status, createdat },
//         });
//     };

//     const handleApprove = async () => {
//         if (selectedRows.length === 0) {
//             message.warning("No interest rate changes selected.");
//             return;
//         }
//         const updatedRows = selectedRows.map(({ payment_id, ...rest }) => rest);

//         console.log("approve sending: ", updatedRows)
//         try {
//             const response = await axios.post(`${API_URL}/UTR/Approve`, updatedRows);
//             if (response.status === 201) {
//                 message.success("UTR Upload Approved successfully.");
//                 localStorage.setItem("submissionMessage", "UTR Upload Approved successfully!");
//                 localStorage.setItem("messageType", "success");

//                 const submissionMessage = localStorage.getItem("submissionMessage");
//                 const messageType = localStorage.getItem("messageType");
//                 if (submissionMessage) {
//                     // Show toast message
//                     if (messageType === "success") {
//                         toast.success(submissionMessage);
//                     } else if (messageType === "error") {
//                         toast.error(submissionMessage);
//                     }
//                     setTimeout(() => {
//                         localStorage.removeItem("submissionMessage");
//                         localStorage.removeItem("messageType");
//                     }, 5000);
//                 }
//                 setInterestRates((prev) => prev.filter((rate) => !selectedRows.includes(rate)));
//                 setSelectedRows([]);
//             } else {
//                 message.error("Approval failed.");
//             }
//         } catch (error) {
//             console.error("Error approving UTR Upload:", error);
//             message.error("Approval failed.");
//         }
//     };

//     const handleReject = async () => {
//         if (!remarks.trim()) {
//             setRemarksError(true);
//             return;
//         }
//         if (selectedRows.length === 0) {
//             message.warning("No UTR Upload selected.");
//             return;
//         }
//         try {
//             // console.log("slected: rows: ", selectedRows)
//             const response = await axios.post(`${API_URL}/UTR/reject`, selectedRows.map(lender => ({
//                 tranche_id: lender.tranche_id,
//                 sanction_id: lender.sanction_id,
//                 lender_code: lender.lender_code,
//                 payment_id: lender.payment_id,
//                 remarks: remarks
//             })));
//             if (response.status === 201) {
//                 message.success("UTR Upload Rejected successfully.");
//                 localStorage.setItem("submissionMessage", "UTR Upload Rejected successfully!");
//                 localStorage.setItem("messageType", "success");

//                 const submissionMessage = localStorage.getItem("submissionMessage");
//                 const messageType = localStorage.getItem("messageType");
//                 if (submissionMessage) {
//                     // Show toast message
//                     if (messageType === "success") {
//                         toast.success(submissionMessage);
//                     } else if (messageType === "error") {
//                         toast.error(submissionMessage);
//                     }
//                     setTimeout(() => {
//                         localStorage.removeItem("submissionMessage");
//                         localStorage.removeItem("messageType");
//                     }, 5000);
//                 }
//                 setInterestRates((prev) => prev.filter((rate) => !selectedRows.includes(rate)));
//                 setSelectedRows([]);
//                 setRemarks("");
//                 setRemarksError(false);
//             } else {
//                 message.error("Rejection failed.");
//             }
//         } catch (error) {
//             console.error("Error rejecting UTR Upload:", error);
//             message.error("Rejection failed.");
//         }
//     };

//     const columns = [
//         {
//             title: <Checkbox style={{ transform: "scale(1.6)" }} onChange={handleSelectAll} checked={selectedRows.length === interestRates.length} />,
//             dataIndex: "change_id",
//             onHeaderCell: () => ({
//                 style: { backgroundColor: "#a2b0cc", color: "black" }
//             }),
//             render: (_, record) => (
//                 <Checkbox
//                     style={{ transform: "scale(1.6)" }}
//                     checked={selectedRows.some(
//                         (row) => row.change_id === record.change_id && row.sanction_id === record.sanction_id && row.tranche_id === record.tranche_id
//                     )}
//                     onChange={() => handleSelect(record)}
//                 />
//             ),
//         },
//         {
//             title: "Lender Code", dataIndex: "lender_code",
//             onHeaderCell: () => ({
//                 style: { backgroundColor: "#a2b0cc", color: "black" }
//             }),
//         },
//         {
//             title: "Sanction ID", dataIndex: "sanction_id",
//             onHeaderCell: () => ({
//                 style: { backgroundColor: "#a2b0cc", color: "black" }
//             }),
//         },
//         {
//             title: "Tranche ID", dataIndex: "tranche_id",
//             onHeaderCell: () => ({
//                 style: { backgroundColor: "#a2b0cc", color: "black" }
//             }),
//         },
//         {
//             title: "Payment Date", dataIndex: "payment_date",
//             onHeaderCell: () => ({
//                 style: { backgroundColor: "#a2b0cc", color: "black" }
//             }),
//         },
//         // { title: "Effective Date", dataIndex: "effective_date" },
//         // { title: "Updated Date", dataIndex: "updatedat" },
//         {
//             title: "UTR NO", dataIndex: "utr_no",
//             onHeaderCell: () => ({
//                 style: { backgroundColor: "#a2b0cc", color: "black" }
//             }),
//         },
//         {
//             title: "Details",
//             dataIndex: "sanction_id",
//             onHeaderCell: () => ({
//                 style: { backgroundColor: "#a2b0cc", color: "black" }
//             }),
//             render: (code, record) => <Button type="link" onClick={() => handleViewDetails(code, record.lender_code, record.tranche_id, record.approval_status, record.createdat)}>View</Button>,
//         },
//     ];

//     return (
//         <div style={{
//             display: "flex",
//             flexDirection: "column",
//             margin: "70px auto",
//             marginLeft: isDropped ? "100px" : "280px",
//             transition: "margin-left 0.3s ease-in-out",
//             width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//             padding: 20,
//             border: "3px solid #ccc",
//             borderRadius: 10,
//             // boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
//         }}>
//             <ToastContainer position="top-right" autoClose={5000} />
//             <Typography sx={{
//                 color: "#0056b3",
//                 fontWeight: "600",
//                 fontSize: "20px",
//                 marginBottom: "20px",
//                 textAlign: "center",
//                 textTransform: "uppercase",
//                 letterSpacing: "1px",
//                 borderBottom: "2px solid #0056b3",
//                 paddingBottom: "10px",
//             }}>
//                 UTR Upload Approval
//             </Typography>
//             {
//                 loading ? (
//                     <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
//                 ) : interestRates.length === 0 ? (
//                     <p style={{ textAlign: "center" }}>No pending UTR Upload's Available</p>
//                 ) : (
//                     <Table bordered dataSource={interestRates}
//                         columns={columns}
//                         rowKey="change_id"
//                         pagination={false} />
//                 )
//             }
//             <div style={{ marginTop: 20, display: "flex", justifyContent: "center", marginRight: "20px" }}>
//                 <TextField
//                     label="Remarks (Required for Rejection)"
//                     value={remarks}
//                     onChange={(e) => {
//                         setRemarks(e.target.value);
//                         setRemarksError(!e.target.value.trim());
//                     }}
//                     fullWidth
//                     multiline
//                     rows={2}
//                     error={remarksError}
//                     helperText={remarksError ? "Remarks are required when rejecting." : ""}
//                     sx={{ marginTop: 2, width: "400px" }}
//                 />
//             </div>
//             <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10 }}>
//                 <Button variant="contained" color="success" onClick={handleApprove} disabled={selectedRows.length === 0 || loading}>
//                     Approve
//                 </Button>
//                 <Button variant="contained" color="error" onClick={handleReject} disabled={selectedRows.length === 0 || !remarks.trim() || loading}>
//                     Reject
//                 </Button>
//             </div>
//         </div >
//     );
// };

// export default UTRApproval;