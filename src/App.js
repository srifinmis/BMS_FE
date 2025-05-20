
import React, { useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login.js";
import ForgotPassword from "./Components/Login/ForgotPassword.js"
import ResetPass from "./Components/Login/Reset_Pass.js"
import Dashboard from "./Components/DashBoard/Dashboard.js";
import Navbar from "./Components/NavBar/Navbar.js";
import BackButton from "./Components/NavBar/Backbutton.js"

import LenderMaster from "./Components/Transcations/Lendermaster.js";
import SanctionDetails from "./Components/Transcations/SanctionDetails.js";
import BankAccount from "./Components/Transcations/RepaymentDetails.js";
import Rocform from "./Components/Transcations/Rocform.js";
import Documentsupload from "./Components/Transcations/Executeddocuments.js";
import UTRupload from "./Components/Transcations/UTR.js";


import LenderMasterApproval from "./Components/Approval/LenderMasterapproval.js";
import SanctionDetailsApproval from "./Components/Approval/SanctionDetailsapproval.js";
import RocFormApproval from "./Components/Approval/RocFormapproval.js"
import BankRepaymentApprovalAll from "./Components/Approval/BankRepaymentapproval.js"
import ExecutedDocumentsApprovalAll from "./Components/Approval/ExecutedDocumentsapproval.js"
import RepaymentScheduleApprovalAll from "./Components/Approval/repaymentSheduleapproval.js"
import Interestviewapprove from "./Components/Details/interestrateviewapprove.js"
import UTRviewapprove from "./Components/Details/UTRdetailapprove.js"

import SanctionDetailsapprove from "./Components/Details/Sanctionmasterdetailapproval.js"
import ROCFormsapprove from "./Components/Details/Rocformsdetailapproval.js";
import BankRepaymentapprove from "./Components/Details/Bankrepaymentinnerapprove.js"
import Executedapprove from "./Components/Details/Executedinnerapprove.js"
import Trancheapprove from "./Components/Details/Tranchedetailapproval.js"
import LenderDetailsapprove from "./Components/Details/Lendermasterdetailsapprove.js";
import LenderMastermain from "./Components/Mainpages/LenderMastermain.js";
import LenderDetailsmaker from "./Components/Details/Lendermasterdetailsmaker.js";
import SanctionDetailsmaker from "./Components/Details/Sanctionmasterdetailsmaker.js"
import RocDetailmaker from "./Components/Details/Rocformdetailmaker.js"
import BankRepaymentmaker from "./Components/Details/Bankrepaymentdetailmaker.js"
import Executedmaker from "./Components/Details/Executedviewmaker.js"
import Tranchemaker from "./Components/Details/Tranchemaker.js"
import Interestratemaker from "./Components/Details/InterestRatemaker.js"
import UTRmaker from "./Components/Details/UTRmaker.js"

import AlertsPage from "./Components/Alerts/Alertmain.js";
import Addalert from "./Components/Alerts/AddAlert.js";

import SanctionDetailsMain from "./Components/Mainpages/Sanctiondetailsmain.js";
import RocFormMain from "./Components/Mainpages/ROCMain.js";
import BankAccountsMain from "./Components/Mainpages/Repaymentdetailsmain.js";
import ExecutedDocumentsMain from "./Components/Mainpages/Executeddocumentsmain.js";
import TrancheDetailsMain from "./Components/Mainpages/Tranchedetailsmain.js";
import Tranchedetails from "./Components/Transcations/Tranchedetails.js";
import UTRMain from "./Components/Mainpages/UTRmain.js"

import InterestRateChangeMain from "./Components/Mainpages/Interestchangemain.js";
import InterestRateChangeForm from "./Components/Transcations/Intrestchange.js";
import ExcelUpload from "./Components/Transcations/Repaymentscheduleupload.js";

import LoanTrancheReport from "./Components/Reports/TrancheDetailsReport.js"
import DateWiseLoanRepaymentReport from "./Components/Reports/DatewiseRepaymentReport.js";
import RocChangeCreationReport from "./Components/Reports/RocChangeCreationreport.js"
import RocSatisfactionChargeReport from "./Components/Reports/RocSatisfactionChargereport.js"
import DailyRepaymentReport from "./Components/Reports/DailyRepaymentStatmentReport.js"

import ExecutedDocumentApproval from "./Components/Approval/ExecutedDocumentsapproval.js";
import TrancheDetailsApproval from "./Components/Approval/Tranchedetailsmainapproval.js";
import InterestRateChangeApproval from "./Components/Approval/interstrateapproval.js";
import UTRApproval from "./Components/Approval/UTRapproval.js";


//reports
import LenderMasterReport from "./Components/Reports/Lendermasterreport.js";
import SanctionMasterReport from "./Components/Reports/Sanctiondetailsreport.js";

import SessionTimeout from "./Components/SessionTimeOut/sessionTimeOut.js"
import SessionExpired from "./Components/SessionTimeOut/sessionExpired.js"
// role access
import RoleChangePage from "./Components/RoleBase/RoleBasedaccessmain.js"
import SummaryReport from "./Components/Reports/SummaryReports.js";

const ProtectedRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? element : <Navigate to="/" />;
}
function App() {
  const [drop, setDrop] = useState(false);
  const location = useLocation();
  const hideBackButtonRoutes = ["/", "/dashboard", "/session-expired", "/ForgotPassword", "/ResetPassword"];

  return (

    <div style={{ display: "flex" }}>
      {/* Persistent Navbar */}

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, padding: "2px", marginLeft: "0px" }}>
        <SessionTimeout />
        {!hideBackButtonRoutes.includes(location.pathname.toLowerCase()) && (
          <BackButton isDropped={drop} />
        )}
        {/* {window.location.pathname !== "/" && <BackButton isDropped={drop} />} */}
        {/* <backButton /> */}
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPass />} />
          {/* <ProtectedRoute> */}
          <Route path="/dashboard" element={<><ProtectedRoute /><Dashboard isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/DataCreation/LenderMaster" element={<><ProtectedRoute /><LenderMastermain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/DataCreation/SanctionDetails" element={<><ProtectedRoute /><SanctionDetailsMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/DataCreation/RepaymentDetails" element={<><ProtectedRoute /><BankAccountsMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/DataCreation/ROCForm" element={<><ProtectedRoute /><RocFormMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/DataCreation/ExecutedDocuments" element={<><ProtectedRoute /><ExecutedDocumentsMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/DataCreation/TrancheDetails" element={<><ProtectedRoute /><TrancheDetailsMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/DataCreation/InterestRate" element={<><ProtectedRoute /><InterestRateChangeMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/DataCreation/UTRUpload" element={<><ProtectedRoute /><UTRMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          {<Route path="/DataCreation/RepaymentSchedule" element={<><ProtectedRoute /><ExcelUpload isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />}

          <Route path="/Approve/LenderMaster" element={<><ProtectedRoute /><LenderMasterApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Approve/SanctionDetails" element={<><ProtectedRoute /><SanctionDetailsApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Approve/ROCForm" element={<><ProtectedRoute /><RocFormApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Approve/BankRepayment" element={<><ProtectedRoute /><BankRepaymentApprovalAll isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Approve/ExecutedDocuments" element={<><ProtectedRoute /><ExecutedDocumentsApprovalAll isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Approve/RepaymentSchedule" element={<><ProtectedRoute /><RepaymentScheduleApprovalAll isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Approve/Executeddocumentsupload" element={<><ProtectedRoute /><ExecutedDocumentApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Approve/Tranchedetails" element={<><ProtectedRoute /><TrancheDetailsApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Approve/Interestrate" element={<><ProtectedRoute /><InterestRateChangeApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Approve/UTRUpload" element={<><ProtectedRoute /><UTRApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />


          {/* Approver */}
          <Route path="/lenderapprove/:lender_code" element={<><ProtectedRoute /><LenderDetailsapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/sanctionapprove/:sanction_id" element={<><ProtectedRoute /><SanctionDetailsapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/rocapprove/:sanction_id" element={<><ProtectedRoute /><ROCFormsapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/bankrepaymentapprove/:sanction_id" element={<><ProtectedRoute /><BankRepaymentapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/executedapprove/:sanction_id" element={<><ProtectedRoute /><Executedapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/trancheapprove/:tranche_id" element={<><ProtectedRoute /><Trancheapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/interestrateapprove/:sanction_id" element={<><ProtectedRoute /><Interestviewapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/UTRapprove/:sanction_id" element={<><ProtectedRoute /><UTRviewapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />

          {/* WhatsAPP APIS */}
          {/* <Route path="/whatsapp" element></Route> */}

          {/* Maker */}
          <Route path="/lendermaker/:lender_code" element={<><ProtectedRoute /><LenderDetailsmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/sanctionmaker/:sanction_id" element={<><ProtectedRoute /><SanctionDetailsmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/rocmaker/:sanction_id" element={<><ProtectedRoute /><RocDetailmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/bankrepaymentmaker/:sanction_id" element={<><ProtectedRoute /><BankRepaymentmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/executedmaker/:sanction_id" element={<><ProtectedRoute /><Executedmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/tranchemaker/:tranche_id" element={<><ProtectedRoute /><Tranchemaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/interestratemaker/:sanction_id" element={<><ProtectedRoute /><Interestratemaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
          <Route path="/UTRmaker/:tranche_id" element={<><ProtectedRoute /><UTRmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />

          <Route path="/Alerts/Alertmain" element={<><ProtectedRoute /><AlertsPage isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/LenderMaster" element={<><ProtectedRoute /><LenderMaster isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/SanctionDetails" element={<><ProtectedRoute /><SanctionDetails isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/AddAlert" element={<><ProtectedRoute /><Addalert isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/addrocform" element={<><ProtectedRoute /><Rocform isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/addbankaccount" element={<><ProtectedRoute /><BankAccount isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/addexecuteddocument" element={<><ProtectedRoute /><Documentsupload isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/addtranche" element={<><ProtectedRoute /><Tranchedetails isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/add-interestrate" element={<><ProtectedRoute /><InterestRateChangeForm isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/addUTRupload" element={<><ProtectedRoute /><UTRupload isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />

          {/* reports */}
          <Route path="/Reports/SummaryReports" element={<><ProtectedRoute /><SummaryReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Reports/LenderMaster" element={<><ProtectedRoute /><LenderMasterReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Reports/SanctionDetails" element={<><ProtectedRoute /><SanctionMasterReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Reports/LoanTrancheDetails" element={<><ProtectedRoute /><LoanTrancheReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Reports/RepaymentSchedule" element={<><ProtectedRoute /><LenderMasterReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Reports/DailyRepaymentStatement" element={<><ProtectedRoute /><DailyRepaymentReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Reports/DataWiseLoanRepayment" element={<><ProtectedRoute /><DateWiseLoanRepaymentReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Reports/ROCchangeCreation" element={<><ProtectedRoute /><RocChangeCreationReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
          <Route path="/Reports/ROCSatisfactioncharge" element={<><ProtectedRoute /><RocSatisfactionChargeReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />

          <Route path="/Roles/Rolesmain" element={<><ProtectedRoute /><RoleChangePage isDropped={drop} />, <Navbar onToggle={setDrop} /></>}></Route>
          {/* </ProtectedRoute> */}
          <Route path="/session-expired" element={<SessionExpired />} />
        </Routes>

      </main>
    </div>

  );
}

export default App;










// import React, { useState } from "react";
// import { Route, Routes, useLocation } from "react-router-dom";
// import "./App.css";
// import Login from "./Components/Login/Login.js";
// import Dashboard from "./Components/DashBoard/Dashboard.js";
// import Navbar from "./Components/NavBar/Navbar.js";
// import BackButton from "./Components/NavBar/Backbutton.js"

// import LenderMaster from "./Components/Transcations/Lendermaster.js";
// import SanctionDetails from "./Components/Transcations/SanctionDetails.js";
// import BankAccount from "./Components/Transcations/RepaymentDetails.js";
// import Rocform from "./Components/Transcations/Rocform.js";
// import Documentsupload from "./Components/Transcations/Executeddocuments.js";
// import LenderMasterApproval from "./Components/Approval/LenderMasterapproval.js";
// import SanctionDetailsApproval from "./Components/Approval/SanctionDetailsapproval.js";
// import RocFormApproval from "./Components/Approval/RocFormapproval.js"
// import BankRepaymentApprovalAll from "./Components/Approval/BankRepaymentapproval.js"
// import ExecutedDocumentsApprovalAll from "./Components/Approval/ExecutedDocumentsapproval.js"
// import RepaymentScheduleApprovalAll from "./Components/Approval/repaymentSheduleapproval.js"
// import Interestviewapprove from "./Components/Details/interestrateviewapprove.js"
// import SanctionDetailsapprove from "./Components/Details/Sanctionmasterdetailapproval.js"
// import ROCFormsapprove from "./Components/Details/Rocformsdetailapproval.js";
// import BankRepaymentapprove from "./Components/Details/Bankrepaymentinnerapprove.js"
// import Executedapprove from "./Components/Details/Executedinnerapprove.js"
// import Trancheapprove from "./Components/Details/Tranchedetailapproval.js"
// import LenderDetailsapprove from "./Components/Details/Lendermasterdetailsapprove.js";
// import LenderMastermain from "./Components/Mainpages/LenderMastermain.js";
// import LenderDetailsmaker from "./Components/Details/Lendermasterdetailsmaker.js";
// import SanctionDetailsmaker from "./Components/Details/Sanctionmasterdetailsmaker.js"
// import RocDetailmaker from "./Components/Details/Rocformdetailmaker.js"
// import BankRepaymentmaker from "./Components/Details/Bankrepaymentdetailmaker.js"
// import Executedmaker from "./Components/Details/Executedviewmaker.js"
// import Tranchemaker from "./Components/Details/Tranchemaker.js"
// import Interestratemaker from "./Components/Details/InterestRatemaker.js"
// import AlertsPage from "./Components/Alerts/Alertmain.js";
// import Addalert from "./Components/Alerts/AddAlert.js";
// import SanctionDetailsMain from "./Components/Mainpages/Sanctiondetailsmain.js";
// import RocFormMain from "./Components/Mainpages/ROCMain.js";
// import BankAccountsMain from "./Components/Mainpages/Repaymentdetailsmain.js";
// import ExecutedDocumentsMain from "./Components/Mainpages/Executeddocumentsmain.js";

// import TrancheDetailsMain from "./Components/Mainpages/Tranchedetailsmain.js";
// import Tranchedetails from "./Components/Transcations/Tranchedetails.js";

// import InterestRateChangeMain from "./Components/Mainpages/Interestchangemain.js";
// import InterestRateChangeForm from "./Components/Transcations/Intrestchange.js";
// import ExcelUpload from "./Components/Transcations/Repaymentscheduleupload.js";

// import LoanTrancheReport from "./Components/Reports/TrancheDetailsReport.js"
// import DateWiseLoanRepaymentReport from "./Components/Reports/DatewiseRepaymentReport.js";
// import RocChangeCreationReport from "./Components/Reports/RocChangeCreationreport.js"
// import RocSatisfactionChargeReport from "./Components/Reports/RocSatisfactionChargereport.js"
// import DailyRepaymentReport from "./Components/Reports/DailyRepaymentStatmentReport.js"

// import ExecutedDocumentApproval from "./Components/Approval/ExecutedDocumentsapproval.js";
// import TrancheDetailsApproval from "./Components/Approval/Tranchedetailsmainapproval.js";
// import InterestRateChangeApproval from "./Components/Approval/interstrateapproval.js";

// //reports
// import LenderMasterReport from "./Components/Reports/Lendermasterreport.js";
// import SanctionMasterReport from "./Components/Reports/Sanctiondetailsreport.js";

// import SessionTimeout from "./Components/SessionTimeOut/sessionTimeOut.js"
// import SessionExpired from "./Components/SessionTimeOut/sessionExpired.js"
// // role access
// import RoleChangePage from "./Components/RoleBase/RoleBasedaccessmain.js"

// // const ProtectedRoute = ({ element }) => {
// //   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
// //   return isLoggedIn ? element : <Navigate to="/" />;
// // }
// function App() {
//   const [drop, setDrop] = useState(false);
//   const location = useLocation();
//   const hideBackButtonRoutes = ["/", "/dashboard", "/session-expired"];

//   return (

//     <div style={{ display: "flex" }}>
//       {/* Persistent Navbar */}

//       {/* Main Content Area */}
//       <main style={{ flexGrow: 1, padding: "2px", marginLeft: "0px" }}>
//         <SessionTimeout />
//         {!hideBackButtonRoutes.includes(location.pathname.toLowerCase()) && (
//           <BackButton isDropped={drop} />
//         )}
//         {/* {window.location.pathname !== "/" && <BackButton isDropped={drop} />} */}
//         {/* <backButton /> */}
//         <Routes>

//           <Route path="/" element={<Login />} />
//           {/* <ProtectedRoute> */}
//           <Route path="/dashboard" element={<><Dashboard isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/LenderMaster" element={<><LenderMaster isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/DataCreation/LenderMaster" element={<><LenderMastermain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/DataCreation/SanctionDetails" element={<><SanctionDetailsMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/DataCreation/RepaymentDetails" element={<><BankAccountsMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/DataCreation/ROCForm" element={<><RocFormMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/DataCreation/ExecutedDocuments" element={<><ExecutedDocumentsMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/DataCreation/TrancheDetails" element={<><TrancheDetailsMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/DataCreation/InterestRate" element={<><InterestRateChangeMain isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           {<Route path="/DataCreation/RepaymentSchedule" element={<><ExcelUpload isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />}

//           <Route path="/Approve/LenderMaster" element={<><LenderMasterApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Approve/SanctionDetails" element={<><SanctionDetailsApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Approve/ROCForm" element={<><RocFormApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Approve/BankRepayment" element={<><BankRepaymentApprovalAll isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Approve/ExecutedDocuments" element={<><ExecutedDocumentsApprovalAll isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Approve/RepaymentSchedule" element={<><RepaymentScheduleApprovalAll isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Approve/Executeddocumentsupload" element={<><ExecutedDocumentApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Approve/Tranchedetails" element={<><TrancheDetailsApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Approve/Interestrate" element={<><InterestRateChangeApproval isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />

//           {/* Approver */}
//           <Route path="/lenderapprove/:lender_code" element={<><LenderDetailsapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/sanctionapprove/:sanction_id" element={<><SanctionDetailsapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/rocapprove/:sanction_id" element={<><ROCFormsapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/bankrepaymentapprove/:sanction_id" element={<><BankRepaymentapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/executedapprove/:sanction_id" element={<><Executedapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/trancheapprove/:tranche_id" element={<><Trancheapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/interestrateapprove/:sanction_id" element={<><Interestviewapprove isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />


//           {/* Maker */}
//           <Route path="/lendermaker/:lender_code" element={<><LenderDetailsmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/sanctionmaker/:sanction_id" element={<><SanctionDetailsmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/rocmaker/:sanction_id" element={<><RocDetailmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/bankrepaymentmaker/:sanction_id" element={<><BankRepaymentmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/executedmaker/:sanction_id" element={<><Executedmaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/tranchemaker/:tranche_id" element={<><Tranchemaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />
//           <Route path="/interestratemaker/:sanction_id" element={<><Interestratemaker isDropped={drop} />, <Navbar onToggle={setDrop} /> </>} />

//           <Route path="/Alerts/Alertmain" element={<><AlertsPage isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/SanctionDetails" element={<><SanctionDetails isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/AddAlert" element={<><Addalert isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/addrocform" element={<><Rocform isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/addbankaccount" element={<><BankAccount isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/addexecuteddocument" element={<><Documentsupload isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/addtranche" element={<><Tranchedetails isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/add-interestrate" element={<><InterestRateChangeForm isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />

//           {/* reports */}
//           <Route path="/Reports/LenderMaster" element={<><LenderMasterReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Reports/SanctionDetails" element={<><SanctionMasterReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Reports/LoanTrancheDetails" element={<><LoanTrancheReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Reports/RepaymentSchedule" element={<><LenderMasterReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Reports/DailyRepaymentStatement" element={<><DailyRepaymentReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Reports/DataWiseLoanRepayment" element={<><DateWiseLoanRepaymentReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Reports/ROCchangeCreation" element={<><RocChangeCreationReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />
//           <Route path="/Reports/ROCSatisfactioncharge" element={<><RocSatisfactionChargeReport isDropped={drop} />, <Navbar onToggle={setDrop} /></>} />

//           <Route path="/Roles/Rolesmain" element={<><RoleChangePage isDropped={drop} />, <Navbar onToggle={setDrop} /></>}></Route>
//           {/* </ProtectedRoute> */}
//           <Route path="/session-expired" element={<SessionExpired />} />
//         </Routes>

//       </main>
//     </div>

//   );
// }

// export default App;
