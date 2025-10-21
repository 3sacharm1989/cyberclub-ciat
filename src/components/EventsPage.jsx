// src/components/EventsPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventItem from "./EventItem";
import AnnouncementsCarousel from "./AnnouncementsCarousel";
import "./EventsPage.css";
import BackButton from "./BackButton";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setEvents([
      {
        title: "Cybersecurity Awareness Workshop",
        date: "October 25, 2025",
        details:
          "Hands-on demo on phishing detection and secure browsing techniques. Learn from live attack simulations and defensive strategies.",
      },
      {
        title: "Red vs Blue Team Simulation",
        date: "November 10, 2025",
        details:
          "An interactive SOC battle between attack and defense teams. Experience the thrill of live threat response!",
      },
      {
        title: "Guest Speaker: SOC Analyst Q&A",
        date: "December 1, 2025",
        details:
          "Join a live Q&A session with a professional SOC Analyst — insights, stories, and advice from the frontlines of cybersecurity.",
      },
    ]);
  }, []);

  // Track scroll for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const backgroundStyle = {
    backgroundImage: "url('/cybersecurityclublogo.webp')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: `center ${50 + scrollY * 0.05}%`, // subtle parallax
    backgroundAttachment: "fixed",
    backgroundSize: "400px auto",
    transition: "background-position 0.2s ease-out",
  };

  return (
    <div className="events-page" style={backgroundStyle}>
      <div className="overlay">
        <BackButton />

        <motion.h1
          className="events-title"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Cybersecurity Club Events
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <AnnouncementsCarousel />
        </motion.div>

        <section className="calendar-section">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            🗓 Club Calendar
          </motion.h2>
          <motion.p
            className="calendar-placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            Microsoft Teams calendar integration coming soon! Stay tuned for automatic updates and synced events.
          </motion.p>
        </section>

        {/* Mission Timeline */}
        <section className="timeline-section">
          <h2>⚡ Mission Timeline</h2>
          <div className="timeline">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className="timeline-item"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3, duration: 0.6 }}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>{event.title}</h3>
                  <p className="timeline-date">{event.date}</p>
                  <p>{event.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventsPage;





