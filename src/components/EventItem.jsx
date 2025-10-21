import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./EventItem.css";

const EventItem = ({ title, date, details }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="event-item"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="event-header">
        <h3>{title}</h3>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      <p className="event-date">{date}</p>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="event-details"
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p>{details}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventItem;

