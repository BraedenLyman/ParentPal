import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import {Button, Input} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./forgot-password.css";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState("");

    return (
        <div className="mainDiv">
            <button onClick={() => navigate(-1)}>
                <ArrowLeftIcon className="arrowIcon" />
            </button>

            <div className="passRecoveryInfo">
                <h1 className="heading">Recover Password</h1>
                <p className="text">Enter your account email to recover password</p>
            </div>
            
            {/** Email Input */}
            <div className="inputRecoverContainer">
                <Input 
                    label="Email" 
                    placeholder="Enter your email" 
                    type="email" 
                    isRequired
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                
                <Button 
                    color="primary" 
                    className="recoverPassButton"
                    onClick={() => navigate("/recover-passwordOTP", {state: {userInput}})}
                >
                    Send restore link
                </Button>
            </div>
        </div>
    );
}
