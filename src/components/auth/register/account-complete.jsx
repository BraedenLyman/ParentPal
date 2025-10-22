import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./register-styles.css";
import { Button, Progress } from "@heroui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function AccountComplete() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {}

    console.log("AccountComplete received state:", state);

    const {
        accountType,
    } = state;

    const handleNext = () => {
        navigate("/sign-in");
    };

    return (
        <div className="mainDiv">

            {/** Placeholder div so progress bar can be at same height */}
            <div className="arrowIcon"></div>

            <Progress aria-label="Loading..." className="progressBar" value={100} />
            <div className="checkmarkContainer">
                <CheckCircleIcon className="checkmarkIcon" />
            </div>

            <h1 className="heading">Profile has been successfully completed!</h1>

            <div className="debug-info">
                <h2>Debug Info</h2>
                <pre>{JSON.stringify(state, null, 2)}</pre>
            </div>

            <div className="buttonContainer">
                <Button
                    color="primary"
                    className="button"
                    onPress={handleNext}
                >
                    Go to Sign In
                </Button>
            </div>
        </div>
    );
}
