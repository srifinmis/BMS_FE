import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Spin, message, Checkbox, } from "antd";
import axios from "axios";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlertApprovalAll = ({ isDropped }) => {
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
                const response = await axios.get(`${API_URL}/alert/pendingData`);
                console.log("get Alert Details fetchall: ", response)
                if (response.status === 201) {
                    const sortedData = response.data.data.sort(
                        (a, b) => new Date(b.createdat) - new Date(a.createdat)
                    );
                    setLenders(sortedData);
                    // setLenders(response.data.data);
                } else {
                    message.error("Failed to fetch Alert Details");
                }
            } catch (error) {
                message.error("Error fetching Alert Details");
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
            toast.warning("No Alert Details selected.");
            return;
        }

        try {
            const payload = selectedRows.map((key) => {
                const lendersDetails = groupedLenders[key];
                return lendersDetails.map((lender) => ({
                    sanction_id: lender.sanction_id,
                    tranche_id: lender.tranche_id,
                    lender_code: lender.lender_code,
                    alert_start_date: lender.alert_start_date,
                    alert_end_date: lender.alert_end_date,
                    alert_time: lender.alert_time,
                    alert_frequency: lender.alert_frequency,
                    alert_trigger: lender.alert_trigger,
                    to_addr: lender.to_addr,
                    cc_addr: lender.cc_addr,
                    cron_expression: lender.cron_expression,
                    createdat: lender.createdat,
                    createdby: lender.createdby,
                    remarks: lender.remarks,
                    approval_status: "Approved",
                }));
            }).flat();

            const response = await axios.post(`${API_URL}/alert/Approve`, payload);

            if (response.status === 201) {
                setLenders((prev) =>
                    prev.filter((lender) =>
                        !payload.some(
                            (approved) =>
                                lender.sanction_id === approved.sanction_id &&
                                lender.tranche_id === approved.tranche_id
                            // lender.due_date === approved.due_date
                        )
                    )
                );
                localStorage.setItem("submissionMessage", "Alert Details Schedule Approved!");
                localStorage.setItem("messageType", "success");
                navigate("/dashboard");
                setSelectedRows([]);
            } else {
                toast.error("Alert Details Approval failed!"); // Error toast
            }
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || "Approval failed."}`); // Error toast
        }
    };

    const handleReject = async () => {
        if (selectedRows.length === 0) {
            alert("No Alert Details selected.");
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
                    // due_date: lender.due_date,
                    remarks: remarks.trim(),
                }));
            }).flat();

            const response = await axios.post(`${API_URL}/alert/reject`, payload);
            if (response.status === 201) {
                setLenders((prev) =>
                    prev.filter(
                        (lender) =>
                            !selectedRows.some(
                                (row) =>
                                    row.sanction_id === lender.sanction_id &&
                                    row.tranche_id === lender.tranche_id
                                // row.due_date === lender.due_date
                            )
                    )
                );
                // toast.success("Repayment Schedule Rejected successfully!"); // Success toast
                localStorage.setItem("submissionMessage", "Alert Details Rejected !");
                localStorage.setItem("messageType", "success");

                navigate("/dashboard");

                setSelectedRows([]);
                setRemarks("");
                setRemarksError(false);
            } else {
                toast.error("Alert Details Rejection failed."); // Error toast
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
        { title: "Alert Start Date", dataIndex: "alert_start_date", key: "alert_start_date" },
        { title: "Alert End Date", dataIndex: "alert_end_date", key: "alert_end_date" },
        { title: "Alert Time", dataIndex: "alert_time", key: "payment_date" },
        { title: "Alert Frequency", dataIndex: "alert_frequency", key: "alert_frequency" },
        { title: "Alert Trigger", dataIndex: "alert_trigger", key: "alert_trigger" },
        { title: "Mail To", dataIndex: "to_addr", key: "to_addr" },
        { title: "Mail CC", dataIndex: "cc_addr", key: "cc_addr" },
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
                ALERT TRIGGER APPROVAL
            </h2>
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
            ) : Object.keys(groupedLenders).length === 0 ? (
                <p style={{ textAlign: "center" }}>No Pending Alert's Available</p>
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
                // title="Alert Details"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={1000}

                style={{
                    width: "1000",
                    position: "relative",
                    right: "-100px",
                    zIndex: 1001,
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

export default AlertApprovalAll;