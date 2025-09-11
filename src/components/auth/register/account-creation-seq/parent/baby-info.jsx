import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../register-styles.css";
import { Button, Input, Progress, Select, SelectItem } from "@heroui/react";

export const genders = [
  {key: "Male", label: "Male"},
  {key: "Female", label: "Female"},
  {key: "Other", label: "Other"}
]

export default function BabyInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState(null);
    const { category } = location.state || {};
  
    const handleNext = () => {
        navigate("/account-complete", { state: { category } });
    };

    return (
        <div className="mainDiv">
            
            <div className="arrowIcon" onClick={() => navigate("/add-baby")}>
                <ArrowLeftIcon />
            </div>

            <Progress aria-label="Loading..." className="progressBar" value={80} />
            <h1 className="heading">Tell us more about your {category || "baby"}</h1>

            <div className="inputContainer">
                {/** Categories' Name */}
                <Input 
                    label={(category + "'s" || "Baby's") + " name"} 
                    placeholder={"Enter your " + (category || "Baby's") + "'s full name" }
                    type="text" 
                    variant="bordered"
                    isRequired
                />

                <Input 
                    label={(category + "'s" || "Baby's") + " date of birth"} 
                    type="date" 
                    variant="bordered"
                    isRequired
                />

                <Select
                    items={genders}
                    label={(category || "Baby's") + "'s Gender"}
                    placeholder={"Select your " + (category || "Baby's") + "'s gender"}
                    variant="bordered"
                >
                    {(genders) => <SelectItem>{genders.label}</SelectItem>}
                </Select>
            </div>

            <div className="buttonContainer">
                <Button
                    color="primary"
                    className="button"
                    onPress={handleNext}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
