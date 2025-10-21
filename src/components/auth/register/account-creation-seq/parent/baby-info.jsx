import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../register-styles.css";
import { Button, Input, Progress, Avatar } from "@heroui/react";
import Select from "../../../../custom-select/CustomSelect";

export const genders = [
  { key: "Male", label: "Male" },
  { key: "Female", label: "Female" },
  { key: "Other", label: "Other" },
];

export default function BabyInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, accountType, category, selectedGender, fName, lName, gender, dob, bFName: initialFName, bLName: initialLName } = location.state || {};
  
  const [bFName, setBFName] = useState(initialFName || "");
  const [bLName, setBLName] = useState(initialLName || "");
  const [bDob, setBDob] = useState("");
  const [selectedBGender, setSelectedBGender] = useState("");
  const [otherGender, setOtherGender] = useState("");

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date instanceof Date && !isNaN(date) && date < today;
  };

  const isButtonDisabled =
    !bFName.trim() ||
    !bLName.trim() ||
    !isValidDate(bDob) ||
    !selectedBGender ||
    (selectedBGender === "Other" && otherGender.trim() === "");

  const handleNext = () => {
    navigate("/account-complete", {
      state: {
        email, 
        accountType,
        category,
        bFName,
        bLName,
        fName,
        lName,
        gender,
        dob,
        selectedGender,
        bGender: selectedBGender === "Other" ? otherGender : selectedBGender,
        bDob,
      },
    });
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
          name={`${bFName?.charAt(0) ?? ""}${bLName?.charAt(0) ?? ""}`}
          showFallback
          className="avatarSize"
        />
        <p>{bFName} {bLName}</p>

        <Input
          label={(category + "'s" || "Baby's") + " first name"}
          placeholder={`Enter your ${category || "baby"}'s first name`}
          type="text"
          variant="bordered"
          isRequired
          value={bFName}
          onChange={(e) => setBFName(e.target.value)}
        />

        <Input
          label={(category + "'s" || "Baby's") + " last name"}
          placeholder={`Enter your ${category || "baby"}'s last name`}
          type="text"
          variant="bordered"
          isRequired
          value={bLName}
          onChange={(e) => setBLName(e.target.value)}
        />

        <Input
          label={(category + "'s" || "Baby's") + " date of birth"}
          type="date"
          variant="bordered"
          isRequired
          value={bDob}
          onChange={(e) => setBDob(e.target.value)}
        />

        <div className="form-field">
          <label className="form-label">Gender *</label>
          <Select
            options={genders.map(g => ({ value: g.key, label: g.label }))}
            value={selectedBGender ? { value: selectedBGender, label: selectedBGender } : null}
            onChange={(option) => {
              setSelectedBGender(option ? option.value : "");
              setOtherGender("");
            }}
            placeholder="Select your gender"
          />
        </div>

        {selectedBGender === "Other" && (
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

      <div className="buttonContainer">
        <Button
          color="primary"
          className="button"
          onPress={handleNext}
          isDisabled={isButtonDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
