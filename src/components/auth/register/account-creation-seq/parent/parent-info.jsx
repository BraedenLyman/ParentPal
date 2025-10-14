import React, { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import "../../register-styles.css";
import { Button, Progress, Input, Avatar } from "@heroui/react";
import Select from "../../../../custom-select/CustomSelect";

export const genders = [
  { key: "Male", label: "Male" },
  { key: "Female", label: "Female" },
  { key: "Other", label: "Other" },
];

export default function ParentInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedGender, setSelectedGender] = useState("");
  const [otherGender, setOtherGender] = useState("");
  const [dob, setDob] = useState("");
  const { email, fName, lName, accountType } = location.state || {};

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date instanceof Date && !isNaN(date) && date < today;
  };

  const handleNext = () => {
    navigate("/add-baby", {
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
        <div className="form-field">
          <label className="form-label">Gender *</label>
          <Select
            options={genders.map(g => ({ value: g.key, label: g.label }))}
            value={selectedGender ? { value: selectedGender, label: selectedGender } : null}
            onChange={(option) => {
              setSelectedGender(option ? option.value : "");
              setOtherGender("");
            }}
            placeholder="Select your gender"
          />
        </div>

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
