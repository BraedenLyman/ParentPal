import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../register-styles.css";
import { Link as RouterLink } from "react-router-dom";
import { Button, Progress, Input, Select, SelectItem, Avatar } from "@heroui/react";

export const genders = [
  {key: "Male", label: "Male"},
  {key: "Female", label: "Female"},
  {key: "Other", label: "Other"}
]

export default function ParentInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const {email, fName, lName} = location.state || {};

    const [selectedGender, setSelectedGender] = useState("");

    const handleNext = () => {
      navigate("/add-baby");
    }
    console.log(fName, lName)
    return (
      <div className="mainDiv">
        <div className="arrowIcon" onClick={() => navigate("/account-type")}>
            <ArrowLeftIcon />
        </div>

        <Progress aria-label="Loading..." className="progressBar" value={40} />
        <h1 className="heading">Tell us more about yourself</h1>

        <div className="inputContainer">
            <Avatar
              name={`${fName?.charAt(0) ?? ""}${lName?.charAt(0) ?? ""}`}
              showFallback
              className="avatarSize"
            />
            <p>{fName} {lName}</p>

            <Input label="Date of Birth" type="date" variant="bordered" isRequired/>

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
                onClick={handleNext}
            >
                Next
            </Button>
        </div>
      </div>
    );
}
