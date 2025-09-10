import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Navbar } from "../../../components/navbar";
import {Button, Image, Input, Link} from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseAuth";
import "./register-styles.css";


export default function CreateAccount() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const newErrors = [];
        if (password.length < 8) {
            newErrors.push("Password must be at least 8 characters long.");
        }
        if ((password.match(/[A-Z]/g) || []).length < 1) {
            newErrors.push("Password must include at least 1 upper case letter");
        }
        if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
            newErrors.push("Password must include at least 1 symbol.");
        }
        setErrors(newErrors);
    }, [password]);

    const handleCreateAccount = async () => {
        if (errors.length > 0) return;
        setIsCreating(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/account-type", {state: {email}})
        } catch (error) {
            console.error("Firebase error:", error);
            setErrors([error.message]);
        } finally {
            setIsCreating(false);
        }
    };

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
            
            <h1 className="heading">Create an account</h1>
            
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/** Input Password */}
                <Input 
                    errorMessage={
                        errors.length > 0 ? (
                            <ul>
                                {errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                ))}
                            </ul>
                        ): null 
                    }
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
                    isDisabled={isCreating || errors.length > 0}
                    isLoading={isCreating}
                    onClick={handleCreateAccount}
                >
                    Create an account
                </Button>
                <p className="newUser">Already have an account? <Link as={RouterLink} to="/sign-in">Log in</Link></p>
            </div>
        </div>
    );
}
