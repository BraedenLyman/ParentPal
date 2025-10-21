// forgot-password.jsx
import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Button, Input } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../../firebase/firebaseAuth";
import "../sign-in-styles.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState({ message: "", error: false, loading: false });

  const handlePasswordReset = async () => {
    if (!userInput) {
      setStatus({ message: "Please enter your email", error: true });
      return;
    }
    try {
      setStatus({ message: "", error: false, loading: true });
      await sendPasswordResetEmail(auth, userInput);
      setStatus({ message: "Password reset email sent! Check your inbox.", error: false });
    } catch (error) {
      console.error(error);
      setStatus({ message: "Failed to send reset email. Please check the address.", error: true });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="mainDiv">
      <button onClick={() => navigate("/sign-in")}>
        <ArrowLeftIcon className="arrowIcon" />
      </button>

      <div className="passRecoveryInfo">
        <h1 className="heading">Recover Password</h1>
        <p className="text">Enter your account email to recover password</p>
      </div>

      <div className="inputRecoverContainer">
        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          variant="bordered"
          isRequired
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />

        <Button
          color="primary"
          className="recoverPassButton"
          isLoading={status.loading}
          onClick={handlePasswordReset}
        >
          Send restore link
        </Button>

        {status.message && (
          <p className={status.error ? "errorText" : "successText"}>{status.message}</p>
        )}
      </div>
    </div>
  );
}
