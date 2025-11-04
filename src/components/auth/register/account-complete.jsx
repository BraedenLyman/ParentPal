import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./register-styles.css";
import { Button, Image } from "@heroui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function AccountComplete() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {}

    console.log("Account Complete received state:", state);

    const {
        accountType,
    } = state;

    const handleNext = () => {
        navigate("/sign-in");
    };

    return (
        <div className="mainDiv">
            <div className="imgContainer">
                <Image
                    alt="Parent Pal Logo"
                    src="/images/ParentPal.png"
                    width={240}
                    classNames={{ wrapper: "logo" }}
                />
            </div>

            <div className="checkmarkContainer">
                <CheckCircleIcon className="checkmarkIcon" />
            </div>

            <h1 className="heading">
                Welcome to ParentPal!
            </h1>

            <div className="signUpInfo">
                <p className="pText">
                    Your account has been successfully created! You're all set to start tracking your baby's development journey.
                </p>
                <p className="pText">
                    Sign in now to access Growth Tracker, Sleep Analytics, Health Journal, and more.
                </p>

                <div className="buttonContainer">
                    <Button
                        color="primary"
                        className="button"
                        onPress={handleNext}
                        size="lg"
                    >
                        Sign In to Get Started
                    </Button>
                </div>
            </div>
        </div>
    );
}
