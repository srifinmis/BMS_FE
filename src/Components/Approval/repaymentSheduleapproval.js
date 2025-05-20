// import React, { useState, useEffect } from "react";
// import { Table, Checkbox, message, Spin } from "antd";
// import { Typography, TextField, Button } from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const RepaymentScheduleApprovalAll = ({ isDropped }) => {
//     const [selectedRows, setSelectedRows] = useState([]);
//     const [remarks, setRemarks] = useState("");
//     const [remarksError, setRemarksError] = useState(false);
//     const [lenders, setLenders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchLenders = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get("http://localhost:5002/api/repayment/schedule/fetchAll");
//                 if (response.status === 201) {
//                     setLenders(response.data.data);
//                 } else {
//                     message.error("Failed to fetch lenders");
//                 }
//             } catch (error) {
//                 message.error("Error fetching lenders");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLenders();
//     }, []);

//     const handleSelect = (lender) => {
//         setSelectedRows((prev) => {
//             const isSelected = prev.some(
//                 (row) =>
//                     row.sanction_id === lender.sanction_id &&
//                     row.tranche_id === lender.tranche_id&&
//                 row.due_date === lender.due_date
//             );
//             return isSelected
//                 ? prev.filter(
//                     (row) =>
//                         row.sanction_id !== lender.sanction_id ||
//                         row.tranche_id !== lender.tranche_id ||
//                     row.due_date !== lender.due_date
//                 )
//                 : [...prev, lender];
//         });
//     };

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             const uniqueRows = [];
//             const seenKeys = new Set();
//             lenders.forEach((lender) => {
//                 const key = `${lender.sanction_id}-${lender.tranche_id}-${lender.due_date}`;
//                 // const key = `${lender.sanction_id}-${lender.tranche_id}`;
//                 if (!seenKeys.has(key)) {
//                     seenKeys.add(key);
//                     uniqueRows.push(lender);
//                 }
//             });
//             setSelectedRows(uniqueRows);
//         } else {
//             setSelectedRows([]);
//         }
//     };

//     const handleApprove = async () => {
//         if (selectedRows.length === 0) {
//             message.warning("No lenders selected.");
//             return;
//         }

//         try {
//             // Prepare payload with unique combination and approval status
//             const payload = selectedRows.map((lender) => ({
//                 // ...selectedRows,
//                 sanction_id: lender.sanction_id,
//                 tranche_id: lender.tranche_id,
//                 due_date: lender.due_date,
//                 createdat: lender.createdat,
//                 updatedat: lender.createdat,
//                 updatedby: lender.createdby,
//                 createdby: lender.createdby,
//                 interest_due: lender.interest_due,
//                 principal_due: lender.principal_due,
//                 total_due: lender.total_due,
//                 remarks: lender.remarks,
//                 approval_status: "Approved",
//             }));
//             console.log("Data: RS: ", selectedRows)
//             console.log("Payload RS: ", payload)
//             const response = await axios.post("http://localhost:5002/api/schedule/Approve", payload);
//             console.log("Approval RS: ", response)
//             if (response.status === 201) {
//                 toast.success("Lenders approved successfully!");

//                 // Remove lenders from UI based on unique key match
//                 setLenders((prev) =>
//                     prev.filter(
//                         (lender) =>
//                             !selectedRows.some(
//                                 (row) =>
//                                     row.sanction_id === lender.sanction_id &&
//                                     row.tranche_id === lender.tranche_id &&
//                                 row.due_date === lender.due_date
//                             )
//                     )
//                 );
//                 setSelectedRows([]);
//             } else {
//                 toast.error("Approval failed.");
//             }
//         } catch (error) {
//             message.error(`Error: ${error.response?.data?.message || "Approval failed."}`);
//         }
//     };

//     const handleReject = async () => {
//         if (selectedRows.length === 0) {
//             message.warning("No lenders selected.");
//             return;
//         }
//         if (!remarks.trim()) {
//             setRemarksError(true);
//             return;
//         }

//         try {
//             // Prepare payload with unique key and remarks
//             const payload = selectedRows.map((lender) => ({
//                 sanction_id: lender.sanction_id,
//                 tranche_id: lender.tranche_id,
//                 due_date: lender.due_date,
//                 remarks: remarks.trim(),
//             }));

//             const response = await axios.post("http://localhost:5002/api/schedule/Reject", payload);

//             if (response.status === 201) {
//                 toast.success("Lenders rejected successfully!");

//                 // Remove lenders from UI based on unique key match
//                 setLenders((prev) =>
//                     prev.filter(
//                         (lender) =>
//                             !selectedRows.some(
//                                 (row) =>
//                                     row.sanction_id === lender.sanction_id &&
//                                     row.tranche_id === lender.tranche_id &&
//                                 row.due_date === lender.due_date
//                             )
//                     )
//                 );
//                 setSelectedRows([]);
//                 setRemarks("");
//                 setRemarksError(false);
//             } else {
//                 toast.error("Rejection failed.");
//             }
//         } catch (error) {
//             message.error(`Error: ${error.response?.data?.message || "Rejection failed."}`);
//         }
//     };



//     // 

//     const columns = [
//         {
//             title: <Checkbox onChange={handleSelectAll} checked={selectedRows.length === lenders.length} />,
//             dataIndex: "sanction_id",
//             render: (_, lender) => (
//                 <Checkbox
//                     checked={selectedRows.some(
//                         (row) =>
//                             row.sanction_id === lender.sanction_id &&
//                             row.tranche_id === lender.tranche_id &&
//                         row.due_date === lender.due_date
//                     )}
//                     onChange={() => handleSelect(lender)}
//                 />
//             ),
//         },
//         { title: "Sanction ID", dataIndex: "sanction_id" },
//         { title: "Tranche ID", dataIndex: "tranche_id" },
//         { title: "Due Date", dataIndex: "due_date" },
//         { title: "Principal Due", dataIndex: "principal_due" },
//         { title: "Interest Due", dataIndex: "interest_due" },
//         { title: "Total Due", dataIndex: "total_due" },
//         { title: "Remarks", dataIndex: "remarks" },
//     ];

//     return (
//         <div style={{
//             display: "flex",
//             justifyContent: "center",
//             flexDirection: "column",
//             gap: 2,
//             // width: "auto",
//             margin: "auto",
//             marginTop: "70px",
//             marginLeft: isDropped ? "100px" : "280px",
//             transition: "margin-left 0.3s ease-in-out",
//             width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//             padding: 3,
//             border: "1px solid #ccc",
//             borderRadius: 10,
//             boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)"
//         }}>
//             <ToastContainer position="top-right" autoClose={5000} />
//             <Typography
//                 sx={{
//                     color: "#0056b3",
//                     fontWeight: "600",
//                     fontSize: "20px",
//                     marginTop: "20px",
//                     marginBottom: "20px",
//                     textAlign: "center",
//                     textTransform: "uppercase",
//                     letterSpacing: "1px",
//                     borderBottom: "2px solid #0056b3",
//                     paddingBottom: "10px",
//                 }}
//             >
//                 Repayment Schedule Approval
//             </Typography>

//             {loading ? (
//                 <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
//             ) : lenders.length === 0 ? (
//                 <p style={{ textAlign: "center" }}>No lenders available</p>
//             ) : (
//                 <Table dataSource={lenders} columns={columns} rowKey={(record) => `${record.sanction_id}-${record.tranche_id}-${record.due_date}`} pagination={false} />
//                 // <Table dataSource={lenders} columns={columns} rowKey={(record) => `${record.sanction_id}-${record.tranche_id}-${record.due_date}`} pagination={false} />
//             )}

//             <div style={{ marginTop: 20, display: "flex", justifyContent: "center", marginRight: "20px" }}>

//                 <TextField
//                     label="Remarks (Required for Rejection)"
//                     value={remarks}
//                     onChange={(e) => {
//                         setRemarks(e.target.value);
//                         if (e.target.value.trim()) setRemarksError(false); // Remove error when user types
//                     }}
//                     multilines
//                     rows={0} xs={12} sm={6}
//                     sx={{ marginTop: 2, width: "400px" }}
//                     required
//                     error={remarksError}
//                     helperText={remarksError ? "Remarks are required when rejecting." : ""}
//                 />
//             </div>

//             <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10, width: "100%" }}>
//                 <Button variant="contained" color="success" style={{ marginBottom: "20px", marginRight: "20px" }} onClick={handleApprove} disabled={selectedRows.length === 0 || loading}>
//                     Approve
//                 </Button>
//                 <Button variant="contained" color="error" style={{ marginBottom: "20px", marginRight: "20px" }} onClick={handleReject} disabled={selectedRows.length === 0 || !remarks.trim() || loading}>
//                     Reject
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default RepaymentScheduleApprovalAll;


import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Spin, message, Checkbox, } from "antd";
import axios from "axios";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RepaymentScheduleApprovalAll = ({ isDropped }) => {
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
                const response = await axios.get(`${API_URL}/repayment/schedule/fetchAll`);
                console.log("get repayment fetchall: ", response)
                if (response.status === 201) {
                    const sortedData = response.data.data.sort(
                        (a, b) => new Date(b.createdat) - new Date(a.createdat)
                    );
                    setLenders(sortedData);

                    // setLenders(response.data.data);
                } else {
                    message.error("Failed to fetch Repayment");
                }
            } catch (error) {
                message.error("Error fetching Repayment");
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
            toast.warning("No Repayment selected.");
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
                    createdat: lender.createdat,
                    updatedat: lender.createdat,
                    updatedby: lender.createdby,
                    createdby: lender.createdby,
                    interest_due: lender.interest_due,
                    principal_due: lender.principal_due,
                    opening_balance: lender.opening_balance,
                    closing_balance: lender.closing_balance,
                    from_date: lender.from_date,
                    interest_days: lender.interest_days,
                    interest_rate: lender.interest_rate,
                    emi_sequence: lender.emi_sequence,
                    repayment_type: lender.repayment_type,
                    total_due: lender.total_due,
                    remarks: lender.remarks,
                    approval_status: "Approved",
                }));
            }).flat();

            const response = await axios.post(`${API_URL}/schedule/Approve`, payload);

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
                localStorage.setItem("submissionMessage", "Repayment Schedule Approved!");
                localStorage.setItem("messageType", "success");
                // toast.success("Repayment Schedule Approved successfully!"); // Success toast
                // setTimeout(() => {
                navigate("/dashboard");
                // }, 1500);
                setSelectedRows([]);
            } else {
                toast.error("Repayment Schedule Approval failed!"); // Error toast
            }
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || "Approval failed."}`); // Error toast
        }
    };

    const handleReject = async () => {
        if (selectedRows.length === 0) {
            alert("No Repayment selected.");
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

            const response = await axios.post(`${API_URL}/schedule/Reject`, payload);
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
                localStorage.setItem("submissionMessage", "Repayment Schedule Rejected !");
                localStorage.setItem("messageType", "error");

                navigate("/dashboard");

                setSelectedRows([]);
                setRemarks("");
                setRemarksError(false);
            } else {
                toast.error("Repayment Schedule Rejection failed."); // Error toast
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
        { title: "Lender Code", dataIndex: "lender_code", key: "lender_code" },
        { title: "Sanction ID", dataIndex: "sanction_id", key: "sanction_id" },
        { title: "Tranche ID", dataIndex: "tranche_id", key: "tranche_id" },
        { title: "Due Date", dataIndex: "due_date", key: "due_date" },
        { title: "Principal Due", dataIndex: "principal_due", key: "principal_due" },
        { title: "Interest Due", dataIndex: "interest_due", key: "interest_due" },
        { title: "Total Due", dataIndex: "total_due", key: "total_due" },
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
                Repayment Schedule Approval
            </h2>
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
            ) : Object.keys(groupedLenders).length === 0 ? (
                <p style={{ textAlign: "center" }}>No Pending Repayment Schedule's Available</p>
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
                title="Repayment Schedule Details"
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

export default RepaymentScheduleApprovalAll;


