import React from "react";
import axios from "axios";
import { useState } from "react";
import {Button, Image, Input, Link} from "@heroui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./sign-in-styles.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseAuth";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);
        setLoginError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
        
            const response = await axios.post(
                "http://localhost:3000/api/sign-in",
                { idToken },
                { withCredentials: true }
            );

            const { user: accountData, babyData } = response.data;
            
            console.log("Signed in user:", accountData);
            if (accountData.account_type === "parent") {
            navigate("/parent-dashboard", {state: {babyData}}); 
            } 
            if (accountData.account_type === "babysitter") {
            navigate("/babysitter-dashboard");
            }

        } catch (error) {
            console.error("Login error:", error);
            setLoginError(error.message || "Invalid email or password");
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <div className="mainDiv">
            <div className="imgContainer">
                <Image  
                    alt="Parent Pal Logo"
                    src="/images/ParentPal.png"
                    width={300}
                    classNames={{
                        wrapper: "logo"
                    }}
                />
            </div>
            <h1 className="heading">
                Welcome back!
            </h1>
            
            <form className="formContainer" onSubmit={handleLogin}>
                {/** Email Input */}
                <Input 
                    label="Email" 
                    placeholder="Enter your email" 
                    type="email" 
                    variant="bordered"
                    isRequired
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/** Password Input */}
                <Input 
                    label="Password" 
                    placeholder="Enter your password" 
                    type={isPasswordVisible ? "text" : "password"}
                    variant="bordered"
                    isRequired
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                
                {/** Forgot Password + Incorrect Password */}
                <div className={`passwordProbs ${true ? "hasError" : ""}`}>
                    <p id="incorrectPassword">{loginError}</p>
                    <p><Link as={RouterLink} to="/forgot-password">Forgot Password?</Link></p>
                </div>

                <div className="logInButtonContainer">
                    <Button color="primary" className="button" type="submit" isLoading={isSigningIn} isDisabled={isSigningIn}>
                        Log In
                    </Button>
                </div>
                <p className="newUser">Are you new here? <Link as={RouterLink} to="/create-account">Create account</Link></p>
            </form>
        </div>
    );
}
