import { Navbar } from "@/components/navbar";
import {Button, Image, Input, Link} from "@heroui/react";
import { Link as RouterLink } from "react-router-dom";
import "./sign-in.css";

export default function SignIn() {
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
        
        <div className="formWrapper">
            {/** Email Input */}
            <Input 
                label="Email" 
                placeholder="Enter your email" 
                type="email" 
                className="mb-5"
                isRequired
            />

            {/** Password Input */}
            <Input 
                label="Password" 
                placeholder="Min 8 characters" 
                type="password" 
                isInvalid={false}
                variant="bordered"
                isRequired
            />
            
           {/** Forgot Password + Incorrect Password */}
            <div className={`passwordProbs ${false ? "hasError" : ""}`}>
                {/* <p id="incorrectPassword">Incorrect Password</p> */}
                <p><Link as={RouterLink} to="/forgot-password">Forgot Password?</Link></p>
            </div>

            <div className="logInButtonWrapper">
                <Button color="primary" className="logInButton">
                    Log In
                </Button>
            </div>
            <p className="newUser">Are you new here? <Link as={RouterLink} to="/sign-up">Create account</Link></p>
        </div>
    </div>
  );
}
