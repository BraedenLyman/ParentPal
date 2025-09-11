import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../register-styles.css";
import { Button, Input, Progress, Select, SelectItem, Avatar } from "@heroui/react";

export const genders = [
  {key: "Male", label: "Male"},
  {key: "Female", label: "Female"},
  {key: "Other", label: "Other"}
]

export default function BabyInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState(null);
    const [selectedGender, setSelectedGender] = useState("");
    const { category, fName: initialFName, lName: initialLName } = location.state || {};
    const [fName, setFName] = useState(initialFName || "");
    const [lName, setLName] = useState(initialLName || "");

  
    const handleNext = () => {
        navigate("/account-complete", { state: { category, fName, lName } });
    };

    return (
        <div className="mainDiv">
            
            <div className="arrowIcon" onClick={() => navigate("/add-baby")}>
                <ArrowLeftIcon />
            </div>

            <Progress aria-label="Loading..." className="progressBar" value={80} />
            <h1 className="heading">Tell us more about your {category || "baby"}</h1>

            <div className="inputContainer">
                <Avatar
                    name={`${fName?.charAt(0) ?? ""}${lName?.charAt(0) ?? ""}`}
                    showFallback
                    className="avatarSize"
                />
                <p>{fName} {lName}</p>

                <Input 
                    label={(category + "'s" || "Baby's") + " first name"} 
                    placeholder={"Enter your " + (category || "Baby's") + "'s first name" }
                    type="text" 
                    variant="bordered"
                    isRequired
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                />

                <Input 
                    label={(category + "'s" || "Baby's") + " last name"} 
                    placeholder={"Enter your " + (category || "Baby's") + "'s last name" }
                    type="text" 
                    variant="bordered"
                    isRequired
                    value={lName}
                    onChange={(e) => setLName(e.target.value)}
                />

                <Input 
                    label={(category + "'s" || "Baby's") + " date of birth"} 
                    type="date" 
                    variant="bordered"
                    isRequired
                />

                <Select
                    selectedKeys={[selectedGender]}
                    onSelectionChange={(keys) => setSelectedGender(Array.from(keys)[0])}
                    items={genders}
                    label="Gender"
                    placeholder="Select your gender"
                    variant="bordered"
                    isRequired
                >
                    {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
                </Select>
                
                {selectedGender === "Other" && (
                    <Input
                    label="Other Gender"
                    placeholder="Enter your gender"
                    type="text"
                    variant="bordered"
                    isRequired
                    />
                )}
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
