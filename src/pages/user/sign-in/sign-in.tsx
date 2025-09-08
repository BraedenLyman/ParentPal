import { useState } from "react";
import { Navbar } from "@/components/navbar";
import {Button, Image, Input, Link} from "@heroui/react";
import { Link as RouterLink } from "react-router-dom";
import "./sign-in.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function SignIn() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
                Welcome back!
            </h1>
            
            <div className="formContainer">
                {/** Email Input */}
                <Input 
                    label="Email" 
                    placeholder="Enter your email" 
                    type="email" 
                    variant="bordered"
                    isRequired
                />

                {/** Password Input */}
                <Input 
                    label="Password" 
                    placeholder="Min 8 characters" 
                    type={isPasswordVisible ? "text" : "password"}
                    variant="bordered"
                    isRequired
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
                <div className={`passwordProbs ${false ? "hasError" : ""}`}>
                    {/* <p id="incorrectPassword">Incorrect Password</p> */}
                    <p><Link as={RouterLink} to="/forgot-password">Forgot Password?</Link></p>
                </div>

                <div className="logInButtonContainer">
                    <Button color="primary" className="logInButton">
                        Log In
                    </Button>
                </div>
                <p className="newUser">Are you new here? <Link as={RouterLink} to="/sign-up">Create account</Link></p>
            </div>
        </div>
    );
}
