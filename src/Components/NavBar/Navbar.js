import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, IconButton, Divider, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/Create';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { jwtDecode } from "jwt-decode";

import Logo from "../Images/SriFin_Logo.png";

const Navbar = ({ onToggle }) => {

  const [drop, setDrop] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [name, setName] = useState(null);
  const [id, setId] = useState(null);
  const [modulelist, setModuleList] = useState([]);

  const theme = useTheme();
  const navigate = useNavigate();

  const sidebarWidth = collapsed ? 80 : 260;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userModules = decoded.modules;
        // console.log("Modules Got: ", userModules);
        setModuleList(userModules)
        // setRole(decoded.Role);
        // console.log(" Got Token: ", decoded);
        setName(decoded.empName);
        setId(decoded.id);
        // console.log("Role Got: ", decoded.Role);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleToggle = () => {
    setDrop(!drop);
    onToggle(!drop);
    setCollapsed(!collapsed);
  };

  // const handleMenuClick = (menu) => {
  //   setCurrentMenu(currentMenu === menu ? null : menu);
  // };

  const handleMenuClick = (menu) => {
    setCollapsed(false);
    onToggle(false);
    setDrop(false);

    setCurrentMenu(currentMenu === menu ? null : menu); // Toggle menu
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navbar */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "60px",
        backgroundColor: "#1f2937",
        display: "flex",
        alignItems: "center",
        zIndex: 1000,
        justifyContent: "space-between",
      }}>
        <div style={{
          width: "140px",
          height: "50px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          marginLeft: "10px",
          justifyContent: "center",
        }}>
          <img src={Logo} alt="Logo" style={{ width: "120px", height: "30px" }} />
        </div>
        <div style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>
          BORROWING MANAGEMENT
        </div>

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px", marginRight: "25px" }}>
          <div style={{ color: "white" }}>
            <AssignmentIndIcon style={{ fontSize: 32, marginRight: "-10px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", color: "white" }}>
            <h5 style={{ margin: 0 }}>{name}</h5>
            <h5 style={{ margin: 0 }}>ID:{id}</h5>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#f87171",
              boxShadow: '1px 1px 2px silver',
              color: "#ffffff",
              padding: "10px 10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          transition: "width 0.1s ease-in-out",
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            marginTop: "60px",
            boxSizing: "border-box",
            backgroundColor: "#1f2937",
            color: theme.palette.common.white,
            overflowY: "auto",
            transition: "width 0.1s ease-in-out",
            zIndex: 1000,
          },
        }}
      >
        <IconButton
          sx={{
            color: "white",
            alignSelf: "center",
            margin: "5px",
            transition: "transform 0.1s",
            transform: "rotate(360deg)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          onClick={handleToggle}
        >
          <MenuIcon />
          {!collapsed && <span style={{ fontSize: "16px", color: "white" }}>Menu</span>}
          {/* <hr></hr> */}
        </IconButton>

        <Divider sx={{ bgcolor: "#FFFFFF" }} />

        {/* <Divider sx={{backgroundColor: theme.palette.divider }} /> */}

        {/* Sidebar Menu */}
        <nav>
          <ul style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            fontSize: "16px",
            justifyContent: "center",
            flexDirection: "column",
            marginLeft: "5px"
          }}>
            {/* Data Creation */}
            {modulelist.includes("BMS-Data Creation") && (
              <NavItem
                label="Data Creation"
                icon={<CreateIcon />}
                menu="DataCreation"
                currentMenu={currentMenu}
                handleMenuClick={handleMenuClick}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                collapsed={collapsed}
                links={[
                  { to: "/DataCreation/LenderMaster", label: "Lender Master" },
                  { to: "/DataCreation/SanctionDetails", label: "Sanction Details" },
                  { to: "/DataCreation/ROCForm", label: "ROC Form" },
                  { to: "/DataCreation/ExecutedDocuments", label: "Executed Documents" },
                  { to: "/DataCreation/TrancheDetails", label: "Tranche Details" },
                  { to: "/DataCreation/InterestRate", label: "Interest Rate Change" },
                  { to: "/DataCreation/UTRupload", label: "UTR Upload" },
                  // { to: "/DataCreation/RepaymentSchedule", label: "Repayment Schedule" },
                ]}
              />
            )}

            {/* Approval Pending */}
            {modulelist.includes("BMS-Approval Pending") && (
              <NavItem
                label="Approval Pending"
                icon={<CheckCircleIcon />}
                menu="Approve"
                currentMenu={currentMenu}
                handleMenuClick={handleMenuClick}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                collapsed={collapsed}
                links={[
                  { to: "/Approve/LenderMaster", label: "Lenders Pending Approvals" },
                  { to: "/Approve/SanctionDetails", label: "SanctionDetails Pending Approvals" },
                  { to: "/Approve/ROCForm", label: "ROC Forms Pending Approvals" },
                  { to: "/Approve/Executeddocumentsupload", label: "Executed Documents Pending Approvals" },
                  { to: "/Approve/Tranchedetails", label: "Tranche Details Pending Approvals" },
                  { to: "/Approve/RepaymentSchedule", label: "Repayment Schedule Pending Approvals" },
                  { to: "/Approve/Interestrate", label: "Interest Rate Pending Approvals" },
                  { to: "/Approve/UTRUpload", label: "UTR Upload Pending Approvals" },
                  { to: "/Approve/Alert", label: "Alert Pending Approvals" },
                ]}
              />
            )}

            {/* Reports */}
            {modulelist.includes("BMS-Reports") && (
              <NavItem
                label="Reports"
                icon={<BusinessIcon />}
                menu="Reports"
                currentMenu={currentMenu}
                handleMenuClick={handleMenuClick}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                collapsed={collapsed}
                links={[
                  { to: "/Reports/SummaryReports", label: "Summary Reports" },
                ]}
              />
            )}

            {/* Alerts */}
            {modulelist.includes("BMS-Alerts") && (
              <NavItem
                label="Alerts"
                icon={<WarningAmberIcon />}
                menu="Alerts"
                currentMenu={currentMenu}
                handleMenuClick={handleMenuClick}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                collapsed={collapsed}
                links={[
                  { to: "/Alerts/Alertmain", label: "Alert Update" },
                ]}
              />
            )}

            {/* Roles - visible only to admins */}
            {modulelist.includes("BMS-Role") && (
              <NavItem
                label="Roles"
                icon={<AdminPanelSettingsIcon />}
                menu="Roles"
                currentMenu={currentMenu}
                handleMenuClick={handleMenuClick}
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                collapsed={collapsed}
                links={[
                  { to: "/Roles/Rolesmain", label: "Role Change" },
                ]}
              />
            )}
          </ul>
        </nav>

      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", padding: "16px" }}>
        <div style={{ flexGrow: 1, marginLeft: sidebarWidth - 200 }}></div>
      </Box>
    </Box>
  );
};

// 🔽 Updated NavItem with disabled support
const NavItem = ({
  label,
  icon,
  menu,
  currentMenu,
  handleMenuClick,
  activeLink,
  setActiveLink,
  links,
  collapsed,
  disabled = false,
}) => (
  <li style={{
    marginBottom: "5px",
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? "none" : "auto"
  }}>
    <div
      onClick={() => !disabled && handleMenuClick(menu)}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        padding: "10px",
        color: currentMenu === menu ? "#79D7BE" : "white",
        transition: "background 0.1s",
      }}
    >
      {icon}
      {!collapsed && <span style={{ marginLeft: "10px" }}>{label}</span>}
    </div>

    {currentMenu === menu && !collapsed && !disabled && (
      <ul style={{ listStyle: "none", paddingLeft: "10px", marginTop: "0px" }}>
        {links.map((link, index) => (
          <li key={index} style={{ textAlign: "left", marginLeft: "20px", marginTop: "10px" }}>
            <Link
              to={link.to}
              onClick={() => setActiveLink(link.to)}
              style={{
                display: "block",
                padding: "2px 0",
                fontSize: "14px",
                color: activeLink === link.to ? "#79D7BE" : "white",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </li>
);

export default Navbar;