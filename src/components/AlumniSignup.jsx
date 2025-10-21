// src/components/AlumniSignup.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./AlumniSignup.css";

const AlumniSignup = ({ onSignupSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      onSignupSuccess(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="alumni-auth-box">
      <h2>{isLogin ? "Welcome Back, Alum!" : "Join the Alumni Network"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={isLogin ? "Enter your password" : "Create a password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="toggle-text">
        {isLogin ? (
          <>
            Need an account?{" "}
            <span onClick={() => setIsLogin(false)} className="toggle-link">
              Sign Up
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)} className="toggle-link">
              Log In
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default AlumniSignup;


