import { Navbar } from "@/components/navbar";
import {Button, Image} from "@heroui/react";
import { Link as RouterLink } from "react-router-dom";
import "./sign-up.css";

export default function SignUp() {
  return (
    <div className="flex flex-col">
        <Navbar/>
        <div className="flex justify-center">
            <Image  
                className="logo"
                alt="Parent Pal Logo"
                src="/images/ParentPal.png"
                width={300}
            />
        </div>
        <h1 className="heading">
            Track your baby’s Development
        </h1>
        
        <div className="signUpInfo">
            <p className="signUpText">
                Your essential companion for managing and tracking your baby’s  development! With features like a Growth Tracker, Sleep Analytics,  and a Health Journal, ParentPal ensures you have all the tools you need  to support your little one’s growth and well-being.
            </p>
            <p className="signUpText">
                Let’s embark on this exciting journey together!
            </p>
            
            {/* Router Link wrapping the button */}
            <RouterLink to="/create-account" className="getStartedWrapper">
                <Button color="primary" className="getStartedButton">
                    Get Started
                </Button>
            </RouterLink>
        </div>
    </div>
  );
}
