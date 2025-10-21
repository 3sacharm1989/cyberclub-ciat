import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Transition & Gate
import KodiTransition from "./components/KodiTransition";
import HackerScreen from "./components/HackerScreen";

// Main Dashboard
import Dashboard from "./components/Dashboard";

// Alumni Components
import AlumniLogin from "./components/AlumniLogin";
import AlumniPage from "./components/AlumniPage";

// Other Sections
import AnnouncementsPage from "./components/AnnouncementsPage";
import EventsPage from "./components/EventsPage";
import ActivitiesPage from "./components/ActivitiesPage";
import AccreditationsPage from "./components/AccreditationsPage";
import StorePage from "./components/StorePage"; 
import CheckoutPage from "./components/CheckoutPage";


function App() {
  const [stage, setStage] = useState("transition");

  // Stage 1: CIAT intro → KodiTransition
  if (stage === "transition") {
    return <KodiTransition onComplete={() => setStage("hacker")} />;
  }

  // Stage 2: HackerScreen (Access Gate)
  if (stage === "hacker") {
    return <HackerScreen onAccessGranted={() => setStage("dashboard")} />;
  }

  // Stage 3: Full App Navigation
  return (
    <Router>
      <Routes>
        {/* Main Hub */}
        <Route path="/" element={<Dashboard />} />

        {/* Alumni Vault Flow */}
        <Route path="/alumni-login" element={<AlumniLogin />} />
        <Route path="/alumni" element={<AlumniPage />} />

        {/* Club Sections */}
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/accreditations" element={<AccreditationsPage />} />
        <Route path="/store" element={<StorePage />} /> 
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;

