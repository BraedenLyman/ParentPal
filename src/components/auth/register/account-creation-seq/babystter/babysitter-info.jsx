import React, { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import "../../register-styles.css";
import { Button, Progress, Input, Select, SelectItem, Avatar } from "@heroui/react";

export const genders = [
  { key: "Male", label: "Male" },
  { key: "Female", label: "Female" },
  { key: "Other", label: "Other" },
];

export default function BabysitterInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, fName, lName, accountType } = location.state || {};

  const [selectedGender, setSelectedGender] = useState("");
  const [otherGender, setOtherGender] = useState("");
  const [dob, setDob] = useState("");

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date instanceof Date && !isNaN(date) && date < today;
  };

  const handleNext = () => {
    navigate("/account-complete", {
      state: { email, fName, lName, selectedGender: selectedGender === "Other" ? otherGender : selectedGender, dob, accountType },
    });
  };

  const isButtonDisabled =
    !isValidDate(dob) ||
    !selectedGender ||
    (selectedGender === "Other" && otherGender.trim() === "");

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
        <p>
          {fName} {lName}
        </p>

        {/* Date of Birth */}
        <Input
          label="Date of Birth"
          type="date"
          variant="bordered"
          isRequired
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        {/* Gender Selection */}
        <Select
          selectedKeys={[selectedGender]}
          onSelectionChange={(keys) => {
            setSelectedGender(Array.from(keys)[0]);
            setOtherGender("");
          }}
          items={genders}
          label="Gender"
          placeholder="Select your gender"
          variant="bordered"
          isRequired
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>

        {/* Other Gender Input */}
        {selectedGender === "Other" && (
          <Input
            label="Other Gender"
            placeholder="Enter your gender"
            type="text"
            variant="bordered"
            isRequired
            value={otherGender}
            onChange={(e) => setOtherGender(e.target.value)}
          />
        )}
      </div>

      {/* Next Button */}
      <div className="buttonContainer">
        <Button
          color="primary"
          className="button"
          onClick={handleNext}
          isDisabled={isButtonDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
