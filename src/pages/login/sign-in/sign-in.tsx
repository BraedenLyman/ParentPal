import { Navbar } from "@/components/navbar";
import {Button, Image, Input, Link} from "@heroui/react";
import "./sign-in.css";

export default function SignIn() {
  return (
    <div className="flex flex-col">
        <Navbar/>
        <div className="flex justify-center">
            <Image  
                className="logo"
                alt="Parent Pal Logo"
                src="public/images/ParentPal.png"
                width={300}
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
                <p><Link>Forgot Password?</Link></p>
            </div>

            <Button color="primary">
                Log In
            </Button>
            
            <p className="text-center mb-5">Are you new here? <Link >Create account</Link></p>
        </div>
    </div>
  );
}
