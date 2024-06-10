import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import HomePage from "./Pages/HomePage";
import SingFormPage from "./Pages/SingFormPage";
import LoginFormPage from "./Pages/LoginFormPage";
import UserPage from "./Pages/UserPage";
import DownStore from "./Pages/DownStorePage";
import ScientificProjects from "./Pages/ScientificProjects";
import App from "./App.js";
import CadetPage from "./Pages/CadetPage.jsx";
import ScienceofficerPage from "./Pages/ScienceofficerPage.jsx";
import OfficerPage from "./Pages/OfficerPage.jsx";
import Document from "./Pages/DocumentPage.jsx";
import CalendarPage from "./Pages/CalendarPage.jsx";
import ScienceProjectPage from "./Pages/ScienceProjectPage.jsx";
import PublicationsPage from "./Pages/PublicationsPage.jsx";
import DocumentsPage from "./Pages/DocumentsPage.jsx";
import CertificatePage from "./Pages/CertificatePage.jsx";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginFormPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/singin" element={<SingFormPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/down" element={<DownStore />} />
      <Route path="/science" element={<ScientificProjects />} />
      <Route path="/projects" element={<ScienceProjectPage />} />
      <Route path="/publications" element={<PublicationsPage />} />
      <Route path="/document" element={<Document />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/app" element={<App />} />
      <Route path="/cadet" element={<CadetPage />} />
      <Route path="/certificate" element={<CertificatePage />} />
      <Route path="/officer" element={<ScienceofficerPage />} />
      <Route path="/science-officer" element={<OfficerPage />} />
      <Route path="/user-cabinet/:userId" element={<UserPage />} />
      <Route path="/cadet-cabinet/:userId" element={<CadetPage />} />
      <Route
        path="/science-officer-cabinet/:userId"
        element={<OfficerPage />}
      />
      <Route path="/officer-cabinet/:userId" element={<ScienceofficerPage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
