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

    const handleNext = () => {
      navigate("/add-baby")
    }
    
    return (
      <div className="mainDiv">
        <div className="arrowIcon" onClick={() => navigate("/account-type")}>
            <ArrowLeftIcon />
        </div>

        <Progress aria-label="Loading..." className="progressBar" value={40} />
        <h1 className="heading">Tell us more about yourself</h1>

        <div className="inputContainer">
            <Avatar
              className="avatarSize"
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
            />
            {/* Birthday Input */}
            <Input label="Date of Birth" type="date" variant="bordered" />

            <Select
              items={genders}
              label="Gender"
              placeholder="Select your gender"
              variant="bordered"
            >
              {(genders) => <SelectItem>{genders.label}</SelectItem>}
            </Select>
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
