import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../register-styles.css";
import { Button, Progress } from "@heroui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function AccountComplete() {
    const navigate = useNavigate();
    const location = useLocation();
    const { category } = location.state || {};

  
    const handleNext = () => {
        navigate("/dashboard")
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
            <p className="pText">Now you can go to the app and start tracking your {(category || "Baby's") + "'s"} development</p>
            <div className="buttonContainer">
                <Button
                    color="primary"
                    className="button"
                    onPress={handleNext}
                >
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
}
