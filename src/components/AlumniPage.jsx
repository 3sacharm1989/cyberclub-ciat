import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import AlumniSignup from "./AlumniSignup";
import DirectMessageModal from "./DirectMessageModal";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./AlumniPage.css";

/* ---------------------------
   Mock data (hybrid mode)
---------------------------- */
const FEATURED_WEEK = {
  name: "Jordan Reyes",
  role: "Threat Hunter @ BlueShield",
  quote: "Hunting signals in the noise is an art — CIAT gave me the brushes.",
  image:
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop",
};

const FEATURED_MONTH = {
  name: "Ava Patel",
  role: "SOC Analyst II @ SentinelOne",
  quote:
    "Automate the boring, practice the critical — that’s how you scale your skills.",
  image:
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop",
};

const JOBS_INITIAL = [
  {
    id: "j1",
    title: "Junior SOC Analyst",
    company: "VectorSec",
    description:
      "Monitor SIEM alerts, triage events, escalate incidents. On-call rotation every 5 weeks.",
    applyLink: "https://example.com/apply/soc-analyst",
    deadline: "2025-12-31",
  },
  {
    id: "j2",
    title: "Security Engineer (Cloud)",
    company: "SkyForge",
    description:
      "IaC security reviews, misconfig detection, threat modeling in multi-cloud env.",
    applyLink: "https://example.com/apply/sec-eng",
    deadline: "2025-11-20",
  },
];

const DIRECTORY_MOCK = [
  { id: "u1", name: "Taylor Kim", email: "taylor.kim@alumni.ciat.edu" },
  { id: "u2", name: "Casey Monroe", email: "casey.monroe@alumni.ciat.edu" },
  { id: "u3", name: "Riley Chen", email: "riley.chen@alumni.ciat.edu" },
];

/* ---------------------------
   Announcements (hybrid)
---------------------------- */
const FEATURED_ANNOUNCEMENT =
  "🎓 Welcome to the CIAT Alumni Network — connect, collaborate, and lead in cyber!";
const ROTATING_ANNOUNCEMENTS = [
  "🎉 Alumni Mixer — Nov 8 (6–8pm) • RSVP on Events page.",
  "🛡️ Discount on CompTIA Security+ vouchers this month.",
  "🧠 Study Group: Cloud Security (Thursdays @ 7pm).",
  "💼 Hiring blitz: Submit your resume to the Job Board!",
];

/* ---------------------------
   Helpers and hooks
---------------------------- */
const sectionReveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const useSafeAuth = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    } catch (_) {
      // Firebase not configured - stay null
    }
    return () => unsub && unsub();
  }, []);
  return [user, setUser];
};

const useHybridChat = () => {
  const [messages, setMessages] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const q = query(
        collection(db, "alumni_messages"),
        orderBy("createdAt", "desc")
      );
      const unsub = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setReady(true);
      });
      return () => unsub();
    } catch (err) {
      setMessages([
        {
          id: "demo-1",
          senderName: "demo@alumni.ciat.edu",
          text: "Welcome to the Alumni Community Board!",
        },
        {
          id: "demo-2",
          senderName: "coach@ciat.edu",
          text: "Pro tip: rotate secrets regularly & audit access.",
        },
      ]);
      setReady(true);
    }
  }, []);
  return { messages, setMessages, ready };
};

const ADMIN_PASS = "CIAT-ADMIN-2025";

/* ---------------------------
   Main Component
---------------------------- */
const AlumniPage = () => {
  const [user, setUser] = useSafeAuth();
  const { messages, setMessages, ready } = useHybridChat();

  const [newMsg, setNewMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // rotating announcements
  const [rotateIndex, setRotateIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setRotateIndex((i) => (i + 1) % ROTATING_ANNOUNCEMENTS.length),
      10000
    );
    return () => clearInterval(t);
  }, []);

  // directory + dms
  const directory = useMemo(() => DIRECTORY_MOCK, []);
  const [showDM, setShowDM] = useState(false);
  const [dmRecipient, setDmRecipient] = useState(null);

  // jobs (mock with admin add)
  const [jobs, setJobs] = useState(JOBS_INITIAL);
  const [showJobForm, setShowJobForm] = useState(false);
  const [adminVerified, setAdminVerified] = useState(false);
  const [jobDraft, setJobDraft] = useState({
    title: "",
    company: "",
    description: "",
    applyLink: "",
    deadline: "",
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // called by AlumniSignup after successful signup
  const handleSignupSuccess = (newUser) => {
    setUser(newUser);
    showToast("✅ Access granted. You can now chat & DM alumni.");
    // Mock email “send”
    if (newUser?.email) {
      console.log(`(Mock) Welcome email sent to ${newUser.email}`);
      showToast("📧 Welcome email sent (mock).");
    }
  };

  // chat send (auth required)
  const sendMessage = async () => {
    if (!user) return showToast("Please sign in to post.");
    if (!newMsg.trim()) return;

    try {
      await addDoc(collection(db, "alumni_messages"), {
        senderName: user.email,
        text: newMsg,
        createdAt: serverTimestamp(),
      });
      setNewMsg("");
    } catch {
      // fallback demo push
      setMessages((prev) => [
        { id: `local-${Date.now()}`, senderName: user.email, text: newMsg },
        ...prev,
      ]);
      setNewMsg("");
      showToast("Posted locally (demo mode).");
    }
  };

  const openDM = (alum) => {
    if (!user) return showToast("Sign in to send direct messages.");
    setDmRecipient(alum);
    setShowDM(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (_) {}
    setUser(null);
    showToast("Signed out.");
  };

  const verifyAdmin = () => {
    const pass = prompt("Enter admin password:");
    if (pass === ADMIN_PASS) {
      setAdminVerified(true);
      setShowJobForm(true);
      showToast("🔑 Admin verified (mock).");
    } else {
      showToast("❌ Invalid admin password.");
    }
  };

  const submitJobMock = (e) => {
    e.preventDefault();
    const id = `job-${Date.now()}`;
    setJobs((prev) => [{ id, ...jobDraft }, ...prev]);
    setJobDraft({
      title: "",
      company: "",
      description: "",
      applyLink: "",
      deadline: "",
    });
    setShowJobForm(false);
    showToast("🎉 Job posted (mock).");
  };

  return (
    <div className="alumni-page">
      <Navbar />

      {/* Crest background */}
      <div className="crest-background">
        <motion.img
          src="/AlumniCrest.png"
          alt="Alumni Crest"
          className="alumni-crest"
          initial={{ opacity: 0.05, scale: 0.9 }}
          animate={{
            opacity: [0.05, 0.14, 0.1],
            scale: [0.92, 1.02, 1],
            filter: [
              "drop-shadow(0 0 30px #00cccc)",
              "drop-shadow(0 0 60px #00ffff)",
              "drop-shadow(0 0 40px #0099ff)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      <motion.div
        className="alumni-content"
        initial="hidden"
        animate="show"
        variants={sectionReveal}
        transition={{ duration: 0.9 }}
      >
        {/* Hero */}
        <section className="hero">
          <h1>CIAT Cybersecurity Alumni Vault</h1>
          <p className="intro-text">
            Welcome to the <strong>CIAT Alumni Network</strong> — collaborate,
            grow, and lead in cybersecurity excellence.
          </p>

          {/* Featured announcement (static) */}
          <div className="announcement-featured">
            {FEATURED_ANNOUNCEMENT}
          </div>

          {/* Rotating announcements */}
          <div className="announcement-rotator">
            <AnimatePresence mode="wait">
              <motion.div
                key={rotateIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
                className="announcement-item"
              >
                {ROTATING_ANNOUNCEMENTS[rotateIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {!user ? (
            <div className="signup-wrapper">
              <AlumniSignup onSignupSuccess={handleSignupSuccess} />
              <p className="hint">
                Sign in to join the chat, DM peers, and access community tools.
              </p>
            </div>
          ) : (
            <div className="auth-bar">
              <p>
                Signed in as <strong>{user.email}</strong>
              </p>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </section>

        {/* Featured Alumni */}
        <motion.section
          className="featured-section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionReveal}
          transition={{ duration: 0.8 }}
        >
          <h2>🌟 Featured Alumni</h2>
          <div className="featured-grid">
            <div className="featured-card">
              <div className="badge">WEEK</div>
              <img src={FEATURED_WEEK.image} alt={FEATURED_WEEK.name} />
              <h3>{FEATURED_WEEK.name}</h3>
              <p className="role">{FEATURED_WEEK.role}</p>
              <blockquote>“{FEATURED_WEEK.quote}”</blockquote>
            </div>
            <div className="featured-card">
              <div className="badge gold">MONTH</div>
              <img src={FEATURED_MONTH.image} alt={FEATURED_MONTH.name} />
              <h3>{FEATURED_MONTH.name}</h3>
              <p className="role">{FEATURED_MONTH.role}</p>
              <blockquote>“{FEATURED_MONTH.quote}”</blockquote>
            </div>
          </div>
        </motion.section>

        {/* Community Chat */}
        <motion.section
          className="community-section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionReveal}
          transition={{ duration: 0.8 }}
        >
          <h2>💬 Alumni Community Board</h2>
          <div className="chat-box">
            <div className="messages">
              {!ready && <p className="subtle">Connecting…</p>}
              {ready &&
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className="message"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <strong>{msg.senderName}:</strong> {msg.text}
                  </motion.div>
                ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder={user ? "Type your message…" : "Sign in to post…"}
                disabled={!user}
              />
              <button onClick={sendMessage} disabled={!user}>
                Send
              </button>
            </div>
          </div>
        </motion.section>

        {/* Alumni Directory + DM (mock) */}
        <motion.section
          className="directory-section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionReveal}
          transition={{ duration: 0.8 }}
        >
          <h2>👥 Alumni Directory</h2>
          <p className="subtle">
            Click “Message” to open a private (demo) DM window. Sign in required.
          </p>
          <div className="alumni-list">
            {directory.map((alum) => (
              <div className="alumni-card" key={alum.id}>
                <div>
                  <h4>{alum.name}</h4>
                  <p className="small">{alum.email}</p>
                </div>
                <button
                  onClick={() => openDM(alum)}
                  disabled={!user}
                  className="outline"
                >
                  Message
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Job Opportunities (mock + admin add) */}
        <motion.section
          className="jobs-section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={sectionReveal}
          transition={{ duration: 0.8 }}
        >
          <h2>💼 Job Opportunities</h2>
          <p className="job-intro">
            Curated roles shared by alumni & coaches. (This section uses mock data in hybrid mode.)
          </p>

          <div className="job-actions">
            {!adminVerified ? (
              <button className="add-job-btn" onClick={verifyAdmin}>
                🔑 Admin: Add Job (mock)
              </button>
            ) : (
              !showJobForm && (
                <button className="add-job-btn" onClick={() => setShowJobForm(true)}>
                  ➕ Post New Job (mock)
                </button>
              )
            )}
          </div>

          {showJobForm && (
            <form className="job-form" onSubmit={submitJobMock}>
              <input
                type="text"
                placeholder="Job Title"
                value={jobDraft.title}
                onChange={(e) => setJobDraft({ ...jobDraft, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Company"
                value={jobDraft.company}
                onChange={(e) => setJobDraft({ ...jobDraft, company: e.target.value })}
                required
              />
              <textarea
                placeholder="Job Description"
                value={jobDraft.description}
                onChange={(e) =>
                  setJobDraft({ ...jobDraft, description: e.target.value })
                }
                required
              />
              <input
                type="url"
                placeholder="Apply Link"
                value={jobDraft.applyLink}
                onChange={(e) =>
                  setJobDraft({ ...jobDraft, applyLink: e.target.value })
                }
              />
              <input
                type="date"
                value={jobDraft.deadline}
                onChange={(e) =>
                  setJobDraft({ ...jobDraft, deadline: e.target.value })
                }
              />
              <div className="job-form-actions">
                <button type="submit">Post Job</button>
                <button type="button" className="outline" onClick={() => setShowJobForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </motion.section>
      </motion.div>

      {/* DM Modal */}
      {showDM && (
        <DirectMessageModal
          sender={user}
          recipient={dmRecipient?.email}
          onClose={() => setShowDM(false)}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------------------
   Small Job Card (expandable)
---------------------------- */
const JobCard = ({ job }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="job-card"
      whileHover={{ scale: 1.02, boxShadow: "0 0 22px rgba(0,255,255,0.25)" }}
      transition={{ duration: 0.2 }}
    >
      <h3>{job.title}</h3>
      <p className="company">{job.company}</p>
      <button className="chip" onClick={() => setOpen((v) => !v)}>
        {open ? "Hide Details" : "Read More"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="job-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="description">{job.description}</p>
            {job.deadline && <p className="deadline">Apply by: {job.deadline}</p>}
            {job.applyLink && (
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-btn"
              >
                Apply Now
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AlumniPage;



