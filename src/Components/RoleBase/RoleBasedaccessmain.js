// import React, { useState, useEffect } from "react";
// import {
//     TextField,
//     Button,
//     Grid,
//     Box,
//     Typography,
//     Autocomplete,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const RoleChange = ({ isDropped }) => {
//     const navigate = useNavigate();
//     const [employeeList, setEmployeeList] = useState([]);
//     const [roleList, setRoleList] = useState([]);
//     const API_URL = process.env.REACT_APP_API_URL;

//     const [formData, setFormData] = useState({
//         emp_id: "",
//         role: "",
//     });

//     /* eslint-disable react-hooks/exhaustive-deps */
//     useEffect(() => {
//         const fetchEmployeeData = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/employee/idname`);
//                 if (Array.isArray(response.data?.data)) {
//                     setEmployeeList(response.data.data.map(item => ({
//                         emp_id: item.emp_id,
//                         emp_name: item.emp_name,
//                         role: item.role,
//                     })));
//                 }
//             } catch (error) {
//                 console.error("Error fetching employee data:", error);
//             }
//         };

//         const fetchRoles = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/role/fetchRole`);
//                 console.log("roles: ", response)
//                 if (Array.isArray(response.data?.data)) {
//                     setRoleList(response.data.data); 
//                 }
//             } catch (error) {
//                 console.error("Error fetching roles:", error);
//             }
//         };

//         fetchEmployeeData();
//         fetchRoles();
//     }, [API_URL]);

//     const handleEmpChange = (event, newValue) => {
//         if (newValue) {
//             setFormData({
//                 emp_id: newValue.emp_id,
//                 role: newValue.role?.role_name || "",
//             });
//         } else {
//             setFormData({ emp_id: "", role: "" });
//         }
//     };

//     const handleRoleChange = (event, newValue) => {
//         setFormData(prev => ({
//             ...prev,
//             role: newValue?.role_name || "",
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const finalFormData = {
//             ...formData,
//         };
//         try {
//             const response = await fetch(`${API_URL}/role/update`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(finalFormData),
//             });

//             if (!response.ok) {
//                 localStorage.setItem("submissionMessage", "User Role Change failed!");
//                 localStorage.setItem("messageType", "error");
//                 throw new Error(`Server Error: ${response.status}`);
//             }

//             localStorage.setItem("submissionMessage", "User Role Changed Successfully!");
//             localStorage.setItem("messageType", "success");
//             setFormData({ emp_id: "", role: "" });
//             navigate("/dashboard");
//         } catch (error) {
//             console.log("Error connecting to server ⚠️", error);
//         }
//     };

//     const handleReset = () => {
//         setFormData({ emp_id: "", role: "" });
//     };

//     return (
//         <Box
//             sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 flexDirection: "column",
//                 gap: 2,
//                 margin: "auto",
//                 marginTop: "70px",
//                 marginLeft: isDropped ? "100px" : "280px",
//                 transition: "margin-left 0.3s ease",
//                 width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//                 padding: 3,
//                 border: "1px solid #ccc",
//                 borderRadius: 2,
//                 boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
//             }}
//         >
//             <Typography
//                 sx={{
//                     color: "#0056b3",
//                     fontWeight: "600",
//                     fontSize: "20px",
//                     marginBottom: "20px",
//                     textAlign: "center",
//                     textTransform: "uppercase",
//                     letterSpacing: "1px",
//                     borderBottom: "2px solid #0056b3",
//                     paddingBottom: "10px",
//                 }}
//             >
//                 User Role Change
//             </Typography>
//             <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <Autocomplete
//                             options={employeeList}
//                             getOptionLabel={(option) =>
//                                 `${option.emp_id} - ${option.emp_name}`
//                             }
//                             value={
//                                 employeeList.find(emp => emp.emp_id === formData.emp_id) || null
//                             }
//                             onChange={handleEmpChange}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     label="Employee Id/Name"
//                                     required
//                                 />
//                             )}
//                             isOptionEqualToValue={(option, value) =>
//                                 option.emp_id === value.emp_id
//                             }
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <Autocomplete
//                             options={roleList}
//                             getOptionLabel={(option) => option.role_name}
//                             value={
//                                 roleList.find(role => role.role_name === formData.role) || null
//                             }
//                             onChange={handleRoleChange}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     label="User Role"
//                                     required
//                                 />
//                             )}
//                             isOptionEqualToValue={(option, value) =>
//                                 option.role_name === value.role_name
//                             }
//                         />
//                     </Grid>
//                 </Grid>
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
//                     <Button variant="contained" color="warning" onClick={() => navigate(-1)}>Back</Button>
//                     <Button variant="contained" color="primary" type="submit">Save</Button>
//                     <Button variant="contained" color="error" onClick={handleReset}>Reset</Button>
//                 </Box>
//             </form>
//         </Box>
//     );
// };
// export default RoleChange;





//  new code///

// import React, { useState, useEffect } from "react";
// import {
//     TextField,
//     Button,
//     Grid,
//     Box,
//     Typography,
//     Autocomplete,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const RoleChange = ({ isDropped }) => {
//     const navigate = useNavigate();
//     const [employeeList, setEmployeeList] = useState([]);
//     const [roleList, setRoleList] = useState([]);
//     const API_URL = process.env.REACT_APP_API_URL;

//     const [formData, setFormData] = useState({
//         emp_id: "",
//         roles: [], // This will hold multiple selected roles
//     });

//     useEffect(() => {
//         const fetchEmployeeData = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/employee/idname`);
//                 if (Array.isArray(response.data?.data)) {
//                     setEmployeeList(response.data.data.map(item => ({
//                         emp_id: item.emp_id,
//                         emp_name: item.emp_name,
//                         role: item.role,
//                     })));
//                 }
//             } catch (error) {
//                 console.error("Error fetching employee data:", error);
//             }
//         };

//         const fetchRoles = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/role/fetchRole`);
//                 if (Array.isArray(response.data?.data)) {
//                     setRoleList(response.data.data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching roles:", error);
//             }
//         };

//         fetchEmployeeData();
//         fetchRoles();
//     }, [API_URL]);

//     const handleEmpChange = (event, newValue) => {
//         if (newValue) {
//             setFormData({
//                 emp_id: newValue.emp_id,
//                 roles: newValue.role ? [newValue.role] : [], // Populate with a single role
//             });
//         } else {
//             setFormData({ emp_id: "", roles: [] });
//         }
//     };

//     const [roleError, setRoleError] = useState(false); // New state to track role validation

//     const handleRoleChange = (event, newValue) => {
//         setFormData(prev => ({
//             ...prev,
//             roles: newValue,
//         }));
//         if (newValue.length > 0) {
//             setRoleError(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (formData.roles.length === 0) {
//             setRoleError(true);
//             return;
//         }

//         const finalFormData = {
//             emp_id: formData.emp_id,
//             roles: formData.roles.map(role => role.role_name),
//         };
//         console.log("sending role change: ", finalFormData)

//         try {
//             const response = await fetch(`${API_URL}/role/update`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(finalFormData),
//             });

//             if (!response.ok) {
//                 localStorage.setItem("submissionMessage", "User Role Change failed!");
//                 localStorage.setItem("messageType", "error");
//                 throw new Error(`Server Error: ${response.status}`);
//             }

//             localStorage.setItem("submissionMessage", "User Role Changed Successfully!");
//             localStorage.setItem("messageType", "success");
//             setFormData({ emp_id: "", role: "" });
//             navigate("/dashboard");
//         } catch (error) {
//             console.log("Error connecting to server ⚠️", error);
//         }
//     };

//     const handleReset = () => {
//         setFormData({ emp_id: "", roles: [] });
//     };

//     return (
//         <Box
//             sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 flexDirection: "column",
//                 gap: 2,
//                 margin: "auto",
//                 marginTop: "70px",
//                 marginLeft: isDropped ? "100px" : "280px",
//                 transition: "margin-left 0.3s ease",
//                 width: isDropped ? "calc(100% - 180px)" : "calc(100% - 350px)",
//                 padding: 3,
//                 border: "1px solid #ccc",
//                 borderRadius: 2,
//                 boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
//             }}
//         >
//             <Typography
//                 sx={{
//                     color: "#0056b3",
//                     fontWeight: "600",
//                     fontSize: "20px",
//                     marginBottom: "20px",
//                     textAlign: "center",
//                     textTransform: "uppercase",
//                     letterSpacing: "1px",
//                     borderBottom: "2px solid #0056b3",
//                     paddingBottom: "10px",
//                 }}
//             >
//                 User Role Change
//             </Typography>
//             <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <Autocomplete
//                             options={employeeList}
//                             getOptionLabel={(option) =>
//                                 `${option.emp_id} - ${option.emp_name}`
//                             }
//                             value={
//                                 employeeList.find(emp => emp.emp_id === formData.emp_id) || null
//                             }
//                             onChange={handleEmpChange}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     label="Employee Id/Name"
//                                     required
//                                 />
//                             )}
//                             isOptionEqualToValue={(option, value) =>
//                                 option.emp_id === value.emp_id
//                             }
//                         />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                         <Autocomplete
//                             multiple
//                             options={roleList}
//                             getOptionLabel={(option) => option.role_name}
//                             value={formData.roles}
//                             onChange={handleRoleChange}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     label="User Role"
//                                     error={roleError}
//                                     helperText={roleError ? 'Please select at least one role' : ''}
//                                 />
//                             )}
//                             isOptionEqualToValue={(option, value) =>
//                                 option.role_name === value.role_name
//                             }
//                         />

//                     </Grid>
//                 </Grid>
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 5, gap: 2 }}>
//                     <Button variant="contained" color="warning" onClick={() => navigate(-1)}>Back</Button>
//                     <Button variant="contained" color="primary" type="submit">Save</Button>
//                     <Button variant="contained" color="error" onClick={handleReset}>Reset</Button>
//                 </Box>
//             </form>
//         </Box>
//     );
// };

// export default RoleChange;

// updated code 2:56///////////


import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Grid,
    Box,
    Typography,
    Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RoleChange = ({ isDropped }) => {
    const navigate = useNavigate();
    const [employeeList, setEmployeeList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({
        emp_id: "",
        roles: [], // This will hold multiple selected roles
    });

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get(`${API_URL}/employee/idname`);
                console.log("fetch emp data API: ", response)
                if (Array.isArray(response.data?.data)) {
                    setEmployeeList(response.data.data.map(item => ({
                        emp_id: item.emp_id,
                        emp_name: item.emp_name,
                        // role: item.role,
                        role_ids_assigned: item.role_ids_assigned
                    })));
                }
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${API_URL}/role/fetchRole`);
                console.log("fetch roles API: ", response)
                if (Array.isArray(response.data?.data)) {
                    setRoleList(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchEmployeeData();
        fetchRoles();
    }, [API_URL]);

    // const handleEmpChange = (event, newValue) => {
    //     if (newValue) {
    //         setFormData({
    //             emp_id: newValue.emp_id,
    //             roles: newValue.role ? [newValue.role] : [], // Populate with a single role
    //         });
    //     } else {
    //         setFormData({ emp_id: "", roles: [] });
    //     }
    // };

    const handleEmpChange = (event, newValue) => {
        if (newValue) {
            // Step 1: Parse role_ids_assigned from string to array of numbers
            const assignedRoleIds = newValue.role_ids_assigned
                ? newValue.role_ids_assigned.split(',').map(id => parseInt(id.trim()))
                : [];

            // Step 2: Filter roleList to match those role_ids
            const assignedRoles = roleList.filter(role =>
                assignedRoleIds.includes(role.role_id)
            );

            // Step 3: Set the form data with emp_id and matched roles
            setFormData({
                emp_id: newValue.emp_id,
                roles: assignedRoles,
            });
        } else {
            setFormData({ emp_id: "", roles: [] });
        }
    };


    const [roleError, setRoleError] = useState(false); // New state to track role validation

    const handleRoleChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            roles: newValue,
        }));
        if (newValue.length > 0) {
            setRoleError(false); // Clear the error if roles are selected
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.roles.length === 0) {
            setRoleError(true); // Show error if no role is selected
            return;
        }

        const finalFormData = {
            emp_id: formData.emp_id,
            roles: formData.roles.map(role => role.role_name), // Assuming 'role_name' is the correct property
        };
        console.log("sending role change: ", finalFormData)

        try {
            const response = await fetch(`${API_URL}/role/update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalFormData),
            });

            if (!response.ok) {
                localStorage.setItem("submissionMessage", "User Role Change failed!");
                localStorage.setItem("messageType", "error");
                throw new Error(`Server Error: ${response.status}`);
            }

            localStorage.setItem("submissionMessage", "User Role Changed Successfully!");
            localStorage.setItem("messageType", "success");
            setFormData({ emp_id: "", roles: [] }); // Reset form data after successful submission
            navigate("/dashboard");
        } catch (error) {
            console.log("Error connecting to server ⚠️", error);
        }
    };

    const handleReset = () => {
        setFormData({ emp_id: "", roles: [] }); // Reset form data on reset button click
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
                margin: "auto",
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
                    marginBottom: "20px",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    borderBottom: "2px solid #0056b3",
                    paddingBottom: "10px",
                }}
            >
                User Role Change
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={employeeList}
                            getOptionLabel={(option) =>
                                `${option.emp_id} - ${option.emp_name}`
                            }
                            value={
                                employeeList.find(emp => emp.emp_id === formData.emp_id) || null
                            }
                            onChange={handleEmpChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Employee Id/Name"
                                    required
                                />
                            )}
                            isOptionEqualToValue={(option, value) =>
                                option.emp_id === value.emp_id
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            multiple
                            options={roleList}
                            getOptionLabel={(option) => option.role_name}
                            value={formData.roles}
                            onChange={handleRoleChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="User Role"
                                    error={roleError}
                                    helperText={roleError ? 'Please select at least one role' : ''}
                                />
                            )}
                            isOptionEqualToValue={(option, value) =>
                                option.role_name === value.role_name
                            }
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5, gap: 2 }}>
                    <Button variant="contained" color="warning" onClick={() => navigate(-1)}>Back</Button>
                    <Button variant="contained" color="primary" type="submit">Save</Button>
                    <Button variant="contained" color="error" onClick={handleReset}>Reset</Button>
                </Box>
            </form>
        </Box>
    );
};

export default RoleChange;
