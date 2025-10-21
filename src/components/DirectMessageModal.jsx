import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import "./DirectMessageModal.css";

export default function DirectMessageModal({ sender, recipient, onClose }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Load previous DMs between the two users
  useEffect(() => {
    const q = query(
      collection(db, "alumni_dm"),
      where("participants", "array-contains", sender.email),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((msg) => msg.participants.includes(recipient));
      setChatHistory(messages);
    });

    return unsub;
  }, [sender, recipient]);

  const sendDM = async () => {
    if (!message.trim()) return;
    try {
      await addDoc(collection(db, "alumni_dm"), {
        sender: sender.email,
        recipient,
        participants: [sender.email, recipient],
        message,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (err) {
      console.error("Error sending DM:", err);
    }
  };

  return (
    <div className="dm-overlay">
      <div className="dm-modal">
        <h3>Private Chat with {recipient}</h3>
        <div className="dm-messages">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`dm-message ${
                msg.sender === sender.email ? "sent" : "received"
              }`}
            >
              <strong>{msg.sender === sender.email ? "You" : msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="dm-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendDM}>Send</button>
        </div>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
