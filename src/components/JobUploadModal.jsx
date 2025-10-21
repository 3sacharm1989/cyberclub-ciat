// src/components/JobUploadModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./JobUploadModal.css";

const ADMIN_PASS = "CIAT-ADMIN-2025";

const JobUploadModal = ({ onClose, showToast }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    applyLink: "",
    deadline: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (password === ADMIN_PASS) {
      setIsVerified(true);
      showToast("✅ Admin verified!");
    } else {
      showToast("❌ Invalid admin password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) return showToast("🔒 Admin access required");

    setLoading(true);
    let imageUrl = "";

    try {
      if (file) {
        const fileRef = ref(storage, `jobs/${file.name}-${Date.now()}`);
        await uploadBytes(fileRef, file);
        imageUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "job_opportunities"), {
        ...form,
        image: imageUrl,
        verified: true,
        createdAt: serverTimestamp(),
      });

      showToast("🎉 Job posted successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to upload job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {!isVerified ? (
          <>
            <h2>🔐 Admin Verification</h2>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleVerify}>Verify</button>
          </>
        ) : (
          <>
            <h2>📢 Post a New Job Opportunity</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Job Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />
              <textarea
                placeholder="Job Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
              <input
                type="url"
                placeholder="Apply Link"
                value={form.applyLink}
                onChange={(e) =>
                  setForm({ ...form, applyLink: e.target.value })
                }
              />
              <input
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm({ ...form, deadline: e.target.value })
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Posting..." : "Post Job"}
              </button>
            </form>
          </>
        )}
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default JobUploadModal;
