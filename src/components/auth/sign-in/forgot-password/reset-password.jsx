import React from "react";
import { useEffect, useState } from "react";
import { Button, Image, Input, Link } from "@heroui/react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { auth } from "../../../../firebase/firebaseAuth";
import "../sign-in-styles.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState({ message: "", error: false, loading: false });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  useEffect(() => {
    const checkCode = async () => {
      try {
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
      } catch {
        setStatus({ message: "Invalid or expired reset link.", error: true });
      }
    };
    if (oobCode) checkCode();
  }, [oobCode]);

  useEffect(() => {
    const newErrors = [];
    if (newPassword && newPassword.length < 8) {
      newErrors.push("Password must be at least 8 characters long.");
    }
    if (newPassword && (newPassword.match(/[A-Z]/g) || []).length < 1) {
      newErrors.push("Password must include at least 1 upper case letter.");
    }
    if (newPassword && (newPassword.match(/[^a-z0-9]/gi) || []).length < 1) {
      newErrors.push("Password must include at least 1 symbol.");
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.push("Passwords do not match.");
    }
    setErrors(newErrors);
  }, [newPassword, confirmPassword]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (errors.length > 0 || !newPassword || !confirmPassword) return;

    try {
      setStatus({ message: "", error: false, loading: true });
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus({ message: "Password successfully reset! Redirecting...", error: false });
      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (err) {
      console.error(err);
      setStatus({ message: "Failed to reset password. Please try again.", error: true });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="mainDiv">
      <div className="imgContainer">
        <Image
          alt="Parent Pal Logo"
          src="/images/ParentPal.png"
          width={300}
          classNames={{ wrapper: "logo" }}
        />
      </div>

      <h1 className="heading">Reset Your Password</h1>
      {email && <p className="text">Resetting password for: <strong>{email}</strong></p>}

      <form className="formContainer" onSubmit={handleReset}>
        <Input
          label="New Password"
          placeholder="Enter new password"
          type={isPasswordVisible ? "text" : "password"}
          variant="bordered"
          value={newPassword}
          isInvalid={errors.length > 0}
          onValueChange={setNewPassword}
          errorMessage={
            errors.length > 0 && (
              <ul>
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            )
          }
          endContent={
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <EyeSlashIcon className="hiddenPasswordIcon" />
              ) : (
                <EyeIcon className="showPasswordIcon" />
              )}
            </button>
          }
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm new password"
          type={isConfirmVisible ? "text" : "password"}
          variant="bordered"
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          endContent={
            <button
              type="button"
              onClick={() => setIsConfirmVisible(!isConfirmVisible)}
            >
              {isConfirmVisible ? (
                <EyeSlashIcon className="hiddenPasswordIcon" />
              ) : (
                <EyeIcon className="showPasswordIcon" />
              )}
            </button>
          }
        />

        <div className={`passwordProbs ${true ? "hasError" : ""}`}>
          <p className={status.error ? "errorText" : "successText"}>{status.message}</p>
          <p><Link as={RouterLink} to="/sign-in">Back to Sign In</Link></p>
        </div>

        <div className="logInButtonContainer">
          <Button
            color="primary"
            className="button"
            type="submit"
            isLoading={status.loading}
            isDisabled={
              status.loading ||
              !newPassword ||
              !confirmPassword ||
              errors.length > 0
            }
          >
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
}
