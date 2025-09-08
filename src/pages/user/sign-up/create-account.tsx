import { useState } from "react";
import { Navbar } from "@/components/navbar";
import {Button, Image, Input} from "@heroui/react";
import {useNavigate } from "react-router-dom";
import "./create-account.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function CreateAccount() {
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState("");
    const [password, setPassword] = useState("");
    const errors: string[] = [];
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }
    if ((password.match(/[A-Z]/g) || []).length < 1) {
        errors.push("Password must include at least 1 upper case letter");
    }
    if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
        errors.push("Password must include at least 1 symbol.");
    }

    return (
        <div className="mainDiv">
            <Navbar/>
            <div className="imgContainer">
                <Image  
                    alt="Parent Pal Logo"
                    src="/images/ParentPal.png"
                    width={200}
                    classNames={{
                        wrapper: "logo"
                    }}
                />
            </div>
            
            <h1 className="heading">
                Create an account
            </h1>
            
            <div className="createAccountInfo">
                {/** Input Name */}
                <Input 
                    label="Full Name" 
                    placeholder="Enter your full name" 
                    type="text" 
                    variant="bordered"
                    isRequired
                />

                {/** Input Email */}
                <Input 
                    label="Email" 
                    placeholder="Enter your email" 
                    type="email" 
                    variant="bordered"
                    isRequired
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />

                {/** Input Password */}
                <Input 
                    errorMessage={() => (
                        <ul>
                            {errors.map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    )}
                    isInvalid={errors.length > 0}
                    label="Password"
                    placeholder="Enter your password"
                    type={isPasswordVisible ? "text" : "password"}
                    variant="bordered"
                    isRequired
                    value={password}
                    onValueChange={setPassword}
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
                
                <Button 
                    color="primary" 
                    className="createAccountButton"
                    onClick={() => navigate("/new-accountOTP", {state: {userInput}})}
                >
                        Create an account
                </Button>
        
            </div>
        </div>
    );
}
