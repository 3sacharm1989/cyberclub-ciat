import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import announcementsData from "../data/announcements.json";
import "./AnnouncementsPage.css";
import BackButton from "./BackButton";

const AnnouncementsPage = () => {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();

  const handleSectionClick = (section) => {
    // ✅ Use React Router navigation for internal links
    if (section.link) {
      navigate(section.link);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className="announcements-page">
      <BackButton />

      {/* 🗞️ Newspaper background with bear watermark */}
      <div className="newspaper-background">
        <div className="fake-columns"></div>
        <img src="/bear.png" alt="Bear watermark" className="bear-watermark" />
      </div>

      {/* 📰 Header */}
      <header className="newsletter-header">
        <h1 className="newsletter-title">The Grizzly Cyber Sentinel</h1>
      </header>

      {/* 🗂️ Announcement sections */}
      <div className="newsletter-sections">
        {announcementsData.map((section, index) => (
          <motion.div
            key={index}
            className="newsletter-card"
            whileHover={{
              background: "rgba(0, 255, 0, 0.08)",
              boxShadow: "0 0 20px rgba(0,255,0,0.2)",
            }}
            transition={{ duration: 0.4 }}
            onClick={() => handleSectionClick(section)}
          >
            <h2>{section.title}</h2>
            <p>Click to read more...</p>
          </motion.div>
        ))}
      </div>

      {/* 💬 Section pop-up modal */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            className="binary-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSection(null)}
          >
            <motion.div
              className="binary-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{activeSection.title}</h2>
              <div
                className="binary-content"
                dangerouslySetInnerHTML={{
                  __html: activeSection.content.replace(/\n/g, "<br />"),
                }}
              />
              <button
                className="close-button"
                onClick={() => setActiveSection(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementsPage;
