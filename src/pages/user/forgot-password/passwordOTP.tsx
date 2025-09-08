import "./passwordOTP.css";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import {InputOtp} from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PasswordOTP() {
    const navigate = useNavigate();
    const location = useLocation();
    const {userInput} = location.state || {userInput: ""};
    const [value, setValue] = useState("")
  
    return (
        <div className="mainDiv">
            <button onClick={() => navigate(-1)} className="backButton">
                <ArrowLeftIcon className="arrowIcon" />
            </button>

            <div className="passOTPInfo">
                <h1 className="heading">Enter the 4-digit code</h1>
                <p className="text">Your passcode has been sent to your email address:</p>
                <p className="userInputText">{userInput}</p>

            </div>
            
            {/** OTP Input */}
            <div className="otpInputContainer">
                <InputOtp 
                    length={4} 
                    size="lg"
                    variant="bordered"
                    color="primary"
                    value={value} 
                    onValueChange={setValue}
                />
            </div>
        </div>
    );
}
