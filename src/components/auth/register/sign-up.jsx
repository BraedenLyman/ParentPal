import React from "react";
import {Button, Image} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import "./register-styles.css";

export default function SignUp() {
    const navigate = useNavigate();

    const handleNext = () => {
      navigate("/create-account")
    }

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
                Track your baby’s Development
            </h1>
            
            <div className="signUpInfo">
                <p className="pText">
                    Your essential companion for managing and tracking your baby’s  development! With features like a Growth Tracker, Sleep Analytics,  and a Health Journal, ParentPal ensures you have all the tools you need  to support your little one’s growth and well-being.
                </p>
                <p className="pText">
                    Let’s embark on this exciting journey together!
                </p>
                
                <div className="buttonContainer">
                    <Button 
                        color="primary" 
                        className="button"
                        onClick={handleNext}
                    >
                        Get Started
                    </Button>
                </div>
            </div>
        </div>
    );
}
