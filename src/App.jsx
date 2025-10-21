import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BinaryLoginScreen from "./components/BinaryLoginScreen";
import CodiTransition from "./components/CodiTransition";
import Dashboard from "./components/Dashboard";
import AnnouncementsPage from "./components/AnnouncementsPage";
import EventsPage from "./components/EventsPage";
import ActivitiesPage from "./components/ActivitiesPage";
import AccreditationsPage from "./components/AccreditationsPage";
import AlumniPage from "./components/AlumniPage";
import CodingClubPage from "./components/CodingClubPage";

function App() {
  const [step, setStep] = useState("login"); // login -> codi -> dashboard

  const handleAccessGranted = () => setStep("codi");
  const handleTransitionFinish = () => setStep("dashboard");

  if (step === "login")
    return <BinaryLoginScreen onAccessGranted={handleAccessGranted} />;
  if (step === "codi") return <CodiTransition onFinish={handleTransitionFinish} />;

  // Dashboard as homepage with routing
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/accreditations" element={<AccreditationsPage />} />
        <Route path="/alumni" element={<AlumniPage />} />
        <Route path="/codingclub" element={<CodingClubPage />} />
      </Routes>
    </Router>
  );
}

export default App;
