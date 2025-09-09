import { useState } from "react";
import { Navbar } from "../../../components/navbar";
import {Button, Image, Input, Link} from "@heroui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./sign-in.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseAuth";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);
        setLoginError("");

        try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");  
        } catch (error) {
        setLoginError("Invalid email or password");
        console.error("Login error:", error);
        } finally {
        setIsSigningIn(false);
        }
    };

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
            
            <form className="formContainer" onSubmit={handleLogin}>
                {/** Email Input */}
                <Input 
                    label="Email" 
                    placeholder="Enter your email" 
                    type="email" 
                    variant="bordered"
                    isRequired
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/** Password Input */}
                <Input 
                    label="Password" 
                    placeholder="Min 8 characters" 
                    type={isPasswordVisible ? "text" : "password"}
                    variant="bordered"
                    isRequired
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <div className={`passwordProbs ${true ? "hasError" : ""}`}>
                    <p id="incorrectPassword">{loginError}</p>
                    <p><Link as={RouterLink} to="/forgot-password">Forgot Password?</Link></p>
                </div>

                <div className="logInButtonContainer">
                    <Button color="primary" className="logInButton" type="submit" isLoading={isSigningIn} isDisabled={isSigningIn}>
                        Log In
                    </Button>
                </div>
                <p className="newUser">Are you new here? <Link as={RouterLink} to="/sign-up">Create account</Link></p>
            </form>
        </div>
    );
}
