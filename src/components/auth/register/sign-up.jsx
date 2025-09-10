import { Navbar } from "../../../components/navbar";
import {Button, Image} from "@heroui/react";
import { Link as RouterLink } from "react-router-dom";
import "./register-styles.css";

export default function SignUp() {

    return (
        <div className="mainDiv">
            <Navbar/>
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
                <p className="signUpText">
                    Your essential companion for managing and tracking your baby’s  development! With features like a Growth Tracker, Sleep Analytics,  and a Health Journal, ParentPal ensures you have all the tools you need  to support your little one’s growth and well-being.
                </p>
                <p className="signUpText">
                    Let’s embark on this exciting journey together!
                </p>
                
                {/* Router Link wrapping the button */}
                <RouterLink to="/create-account" className="buttonContainer">
                    <Button color="primary" className="button">
                        Get Started
                    </Button>
                </RouterLink>
            </div>
        </div>
    );
}
